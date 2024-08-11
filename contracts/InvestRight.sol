// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract InvestRight {
    IPyth public immutable pyth;

    struct Prediction {
        address owner;
        string coin;
        string reasoning;
        uint256 currentPrice;
        uint256 targetPrice;
        uint256 stakeAmount;
        uint256 viewAmount;
        uint256 targetDate;
        uint256 totalPositiveStake;
        uint256 totalNegativeStake;
        uint256 totalFeesCollected;
        bytes32 pythPriceId;
        bool isDistributed;
        address[] positiveStakers;
        address[] negativeStakers;
    }

    event PredictionCreated(
        uint256 indexed predictionId,
        address indexed owner,
        string coin,
        uint256 stakeAmount
    );

    event StakeAdded(
        uint256 indexed predictionId,
        address indexed staker,
        bool isPositive,
        uint256 amount
    );

    event RewardDistributed(
        uint256 indexed predictionId,
        bool predictionCorrect,
        uint256 totalReward
    );

    mapping(uint256 => Prediction) public predictions;
    mapping(uint256 => mapping(address => uint256)) public positiveStakes;
    mapping(uint256 => mapping(address => uint256)) public negativeStakes;
    mapping(uint256 => mapping(address => bool)) public hasPaidViewFee;

    constructor(address pythAddress) {
        pyth = IPyth(pythAddress);
    }

    //Create prediction with prediction ID
    function createPrediction(
        uint256 predictionId,
        string memory _coin,
        string memory _reasoning,
        uint256 _targetPrice,
        uint256 _viewAmount,
        uint256 _targetDate,
        bytes32 _pythPriceId
    ) public payable {
        require(msg.value > 0, "Stake amount must be greater than 0");

        Prediction storage prediction = predictions[predictionId];

        prediction.owner = msg.sender;
        prediction.coin = _coin;
        prediction.reasoning = _reasoning;
        prediction.currentPrice = getCurrentPrice(_pythPriceId);
        prediction.targetPrice = _targetPrice;
        prediction.viewAmount = _viewAmount;
        prediction.stakeAmount = msg.value;
        prediction.targetDate = _targetDate;
        prediction.totalPositiveStake = msg.value;
        prediction.pythPriceId = _pythPriceId;
        prediction.positiveStakers.push(msg.sender); // Add owner as initial positive staker

        positiveStakes[predictionId][msg.sender] = msg.value;

        hasPaidViewFee[predictionId][msg.sender] = true;

        emit PredictionCreated(predictionId, msg.sender, _coin, msg.value);
        emit StakeAdded(predictionId, msg.sender, true, msg.value);
    }

    //Get current price from Pyth
    function getCurrentPrice(bytes32 priceId) public view returns (uint256) {
        PythStructs.Price memory price = pyth.getPriceUnsafe(priceId);
        require(price.price > 0, "Non-positive price");

        uint256 priceUint = uint256(uint64(price.price));
        int32 expo = price.expo;

        return
            expo >= 0
                ? priceUint * (10**uint256(uint32(expo)))
                : priceUint / (10**uint256(uint32(-expo)));
    }

    //Add Stake according to your view
    function addStake(uint256 _id, bool isPositive) public payable {
        require(msg.value > 0, "Stake amount must be greater than 0");

        Prediction storage prediction = predictions[_id];
        if (isPositive) {
            if (msg.sender == prediction.owner) {
                prediction.stakeAmount += msg.value;
            }
            if (positiveStakes[_id][msg.sender] == 0) {
                prediction.positiveStakers.push(msg.sender); // Add staker if not already added
            }
            prediction.totalPositiveStake += msg.value;
            positiveStakes[_id][msg.sender] += msg.value;

            emit StakeAdded(_id, msg.sender, true, msg.value);
        } else {
            if (negativeStakes[_id][msg.sender] == 0) {
                prediction.negativeStakers.push(msg.sender); // Add staker if not already added
            }
            prediction.totalNegativeStake += msg.value;
            negativeStakes[_id][msg.sender] += msg.value;

            emit StakeAdded(_id, msg.sender, false, msg.value);
        }
    }

    // Check if the post-view fee has been paid for a specific address.
    function isWhitelisted(uint256 _predictionId, address _user)
        public
        view
        returns (bool)
    {
        return hasPaidViewFee[_predictionId][_user];
    }

    //Pay fees for view post
    function viewerFees(uint256 _id)
        public
        payable
        returns (InvestRight.Prediction memory)
    {
        Prediction storage prediction = predictions[_id];

        require(
            msg.sender != prediction.owner,
            "Owner cannot view their own post"
        );

        if (!isWhitelisted(_id, msg.sender)) {
            uint256 amount = prediction.viewAmount;
            require(msg.value == amount, "Incorrect ETH amount to view post");

            prediction.totalFeesCollected += amount;

            (bool sent, ) = payable(prediction.owner).call{value: amount}("");
            require(sent, "Failed to send fee to prediction owner");

            hasPaidViewFee[_id][msg.sender] = true;
        } else {
            require(
                msg.value == 0,
                "You have already paid the view fee for this prediction"
            );
        }

        return getPredictions(_id);
    }

    //Get particular prediction using ID
    function getPredictions(uint256 _id)
        public
        view
        returns (Prediction memory)
    {
        require(predictions[_id].owner != address(0), "Invalid prediction ID");
        return predictions[_id];
    }

    //Distribute the reward when prediction is over
    function rewardDistribution(uint256 _id) public {
        Prediction storage prediction = predictions[_id];
        require(
            block.timestamp >= prediction.targetDate,
            "Prediction period not over"
        );
        require(!prediction.isDistributed, "Rewards already distributed");

        uint256 currentPrice = getCurrentPrice(prediction.pythPriceId);
        uint256 totalFeesCollected = prediction.totalFeesCollected;
        uint256 totalPositiveStake = prediction.totalPositiveStake;
        uint256 totalNegativeStake = prediction.totalNegativeStake;
        uint256 totalStake = totalFeesCollected +
            totalPositiveStake +
            totalNegativeStake;
        bool predictionCorrect;

        if (prediction.targetPrice > prediction.currentPrice) {
            // Predicted price increase
            predictionCorrect = currentPrice >= prediction.targetPrice;
        } else {
            // Predicted price decrease or no change
            predictionCorrect = currentPrice <= prediction.targetPrice;
        }

        if (predictionCorrect) {
            // Distribute to prediction owner and positive stakers
            uint256 ownerReward = (prediction.stakeAmount * totalStake) /
                totalPositiveStake;
            payable(prediction.owner).transfer(ownerReward);

            for (uint256 i = 0; i < prediction.positiveStakers.length; i++) {
                address staker = prediction.positiveStakers[i];
                uint256 stake = positiveStakes[_id][staker];
                if (stake > 0) {
                    uint256 reward = (stake * totalStake) / totalPositiveStake;
                    payable(staker).transfer(reward);
                }
            }
        } else {
            // Distribute to negative stakers
            for (uint256 i = 0; i < prediction.negativeStakers.length; i++) {
                address staker = prediction.negativeStakers[i];
                uint256 stake = negativeStakes[_id][staker];
                if (stake > 0) {
                    uint256 reward = (stake * totalStake) / totalNegativeStake;
                    payable(staker).transfer(reward);
                }
            }
        }

        prediction.isDistributed = true;
        emit RewardDistributed(_id, predictionCorrect, totalStake);
    }
}
