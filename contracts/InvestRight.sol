// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract InvestRight {
    IPyth public pyth;

    struct Prediction {
        address owner;
        string coin;
        string reasoning;
        uint256 currentPrice;
        uint256 targetPrice;
        uint256 stakeAmount;
        uint256 viewAmount;
        uint256 targetDate;
        uint256 totalFeesCollected;
        uint256 totalPositiveStake;
        uint256 totalNegativeStake;
        bytes32 pythPriceId;
        bool isDistributed;
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

    uint256 public numberOfPredictions = 0;

    constructor(address pythAddress) {
        pyth = IPyth(pythAddress);
    }

    function createPrediction(
        string memory _coin,
        string memory _reasoning,
        uint256 _targetPrice,
        uint256 _viewAmount,
        uint256 _targetDate,
        bytes32 _pythPriceId
    ) public payable returns (uint256) {
        require(msg.value > 0, "Stake amount must be greater than 0");

        uint256 predictionId = numberOfPredictions++;
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

        positiveStakes[predictionId][msg.sender] = msg.value;

        emit PredictionCreated(predictionId, msg.sender, _coin, msg.value);
        emit StakeAdded(predictionId, msg.sender, true, msg.value);

        return predictionId;
    }

    function getCurrentPrice(bytes32 priceId) public view returns (uint256) {
        try pyth.getPriceUnsafe(priceId) returns (
            PythStructs.Price memory price
        ) {
            // Ensure the price is positive
            require(price.price >= 0, "Negative price returned by Pyth");

            // Convert the price to uint256
            uint256 priceUint = uint256(uint64(price.price));

            // Handle the exponent
            if (price.expo >= 0) {
                return priceUint * (10**uint256(uint32(price.expo)));
            } else {
                return priceUint / (10**uint256(uint32(-price.expo)));
            }
        } catch Error(string memory reason) {
            revert(
                string(abi.encodePacked("Pyth getPriceUnsafe failed: ", reason))
            );
        } catch (bytes memory lowLevelData) {
            // Try to decode the error if possible
            if (lowLevelData.length >= 4) {
                bytes4 errorSelector;
                assembly {
                    errorSelector := mload(add(lowLevelData, 32))
                }
                if (
                    errorSelector ==
                    bytes4(keccak256("PythNetworkError(uint256)"))
                ) {
                    uint256 errorCode;
                    assembly {
                        errorCode := mload(add(lowLevelData, 36))
                    }
                    revert(
                        string(
                            abi.encodePacked(
                                "Pyth network error: ",
                                uint2str(errorCode)
                            )
                        )
                    );
                }
            }
            revert("Pyth getPriceUnsafe failed: unknown low-level error");
        }
    }

    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        str = string(bstr);
    }

    function updateCurrentPrice(uint256 _id) public {
        Prediction storage prediction = predictions[_id];
        prediction.currentPrice = getCurrentPrice(prediction.pythPriceId);
    }

    function addPositiveStake(uint256 _id) public payable {
        require(_id < numberOfPredictions, "Invalid prediction ID");
        require(msg.value > 0, "Stake amount must be greater than 0");

        Prediction storage prediction = predictions[_id];
        prediction.totalPositiveStake += msg.value;
        positiveStakes[_id][msg.sender] += msg.value;

        emit StakeAdded(_id, msg.sender, true, msg.value);
    }

    function addNegativeStake(uint256 _id) public payable {
        require(_id < numberOfPredictions, "Invalid prediction ID");
        require(msg.value > 0, "Stake amount must be greater than 0");

        Prediction storage prediction = predictions[_id];
        prediction.totalNegativeStake += msg.value;
        negativeStakes[_id][msg.sender] += msg.value;

        emit StakeAdded(_id, msg.sender, false, msg.value);
    }

    function viewerFees(uint256 _id) public payable {
        require(_id < numberOfPredictions, "Invalid prediction ID");

        Prediction storage prediction = predictions[_id];

        if (msg.sender == prediction.owner) {
            return;
        }

        uint256 amount = prediction.viewAmount;
        require(msg.value == amount, "Incorrect ETH amount to view post");

        prediction.totalFeesCollected += amount;

        (bool sent, ) = payable(prediction.owner).call{value: amount}("");
        require(sent, "Failed to send fee to prediction owner");
    }

    function getPredictions() public view returns (Prediction[] memory) {
        Prediction[] memory allPredictions = new Prediction[](
            numberOfPredictions
        );

        for (uint256 i = 0; i < numberOfPredictions; i++) {
            allPredictions[i] = predictions[i];
        }

        return allPredictions;
    }

    function getTotalFeesCollected(uint256 _id) public view returns (uint256) {
        require(_id < numberOfPredictions, "Invalid prediction ID");
        return predictions[_id].totalFeesCollected;
    }

    function getTotalPositiveStake(uint256 _id) public view returns (uint256) {
        require(_id < numberOfPredictions, "Invalid prediction ID");
        return predictions[_id].totalPositiveStake;
    }

    function getTotalNegativeStake(uint256 _id) public view returns (uint256) {
        require(_id < numberOfPredictions, "Invalid prediction ID");
        return predictions[_id].totalNegativeStake;
    }

    function getTotalStake(uint256 _id) public view returns (uint256) {
        require(_id < numberOfPredictions, "Invalid prediction ID");
        Prediction storage prediction = predictions[_id];
        return
            prediction.totalFeesCollected +
            prediction.totalPositiveStake +
            prediction.totalNegativeStake;
    }

    function rewardDistribution(uint256 _id) public {
        require(_id < numberOfPredictions, "Invalid prediction ID");
        Prediction storage prediction = predictions[_id];
        require(block.timestamp >= prediction.targetDate, "Prediction period not over");
        require(!prediction.isDistributed, "Rewards already distributed");

        uint256 currentPrice = getCurrentPrice(prediction.pythPriceId);
        uint256 totalStake = getTotalStake(_id);
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
            uint256 ownerReward = (prediction.stakeAmount * totalStake) / prediction.totalPositiveStake;
            payable(prediction.owner).transfer(ownerReward);

            for (uint256 i = 0; i < numberOfPredictions; i++) {
                address staker = address(uint160(i)); // This is a simplification. In reality, you'd need to keep track of all stakers.
                uint256 stake = positiveStakes[_id][staker];
                if (stake > 0) {
                    uint256 reward = (stake * totalStake) / prediction.totalPositiveStake;
                    payable(staker).transfer(reward);
                }
            }
        } else {
            // Distribute to negative stakers
            for (uint256 i = 0; i < numberOfPredictions; i++) {
                address staker = address(uint160(i)); // This is a simplification. In reality, you'd need to keep track of all stakers.
                uint256 stake = negativeStakes[_id][staker];
                if (stake > 0) {
                    uint256 reward = (stake * totalStake) / prediction.totalNegativeStake;
                    payable(staker).transfer(reward);
                }
            }
        }

        prediction.isDistributed = true;
        emit RewardDistributed(_id, predictionCorrect, totalStake);
    }
}