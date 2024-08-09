const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvestRight", function () {
  let investRight;
  let owner;
  let addr1;
  let addr2;
  let pythMock;

  beforeEach(async function () {
    // Deploy a mock Pyth contract
    const PythMock = await ethers.getContractFactory("PythMock");
    pythMock = await PythMock.deploy();
    await pythMock.deployed();

    // Deploy the InvestRight contract
    const InvestRight = await ethers.getContractFactory("InvestRight");
    [owner, addr1, addr2] = await ethers.getSigners();
    investRight = await InvestRight.deploy(pythMock.address);
    await investRight.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right Pyth address", async function () {
      expect(await investRight.pyth()).to.equal(pythMock.address);
    });
  });

  describe("Creating a prediction", function () {
    it("Should create a prediction with correct details", async function () {
      const coin = "ETH";
      const reasoning = "ETH will moon";
      const targetPrice = ethers.utils.parseEther("2000");
      const viewAmount = ethers.utils.parseEther("0.1");
      const targetDate = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
      const pythPriceId = ethers.utils.formatBytes32String("ETH-USD");
      const stakeAmount = ethers.utils.parseEther("1");

      await pythMock.setPrice(pythPriceId, ethers.utils.parseEther("1900"));

      await expect(investRight.createPrediction(coin, reasoning, targetPrice, viewAmount, targetDate, pythPriceId, { value: stakeAmount }))
        .to.emit(investRight, "PredictionCreated")
        .withArgs(0, owner.address, coin, stakeAmount);

      const prediction = await investRight.predictions(0);
      expect(prediction.owner).to.equal(owner.address);
      expect(prediction.coin).to.equal(coin);
      expect(prediction.reasoning).to.equal(reasoning);
      expect(prediction.currentPrice).to.equal(ethers.utils.parseEther("1900"));
      expect(prediction.targetPrice).to.equal(targetPrice);
      expect(prediction.viewAmount).to.equal(viewAmount);
      expect(prediction.stakeAmount).to.equal(stakeAmount);
      expect(prediction.targetDate).to.equal(targetDate);
      expect(prediction.totalPositiveStake).to.equal(stakeAmount);
      expect(prediction.pythPriceId).to.equal(pythPriceId);
    });

    it("Should fail to create a prediction with zero stake", async function () {
      await expect(investRight.createPrediction("ETH", "Reason", 2000, 100, 1000000000, ethers.utils.formatBytes32String("ETH-USD")))
        .to.be.revertedWith("Stake amount must be greater than 0");
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      await investRight.createPrediction(
        "ETH",
        "ETH will moon",
        ethers.utils.parseEther("2000"),
        ethers.utils.parseEther("0.1"),
        Math.floor(Date.now() / 1000) + 86400,
        ethers.utils.formatBytes32String("ETH-USD"),
        { value: ethers.utils.parseEther("1") }
      );
    });

    it("Should allow positive staking", async function () {
      await expect(investRight.connect(addr1).addPositiveStake(0, { value: ethers.utils.parseEther("0.5") }))
        .to.emit(investRight, "StakeAdded")
        .withArgs(0, addr1.address, true, ethers.utils.parseEther("0.5"));

      expect(await investRight.getTotalPositiveStake(0)).to.equal(ethers.utils.parseEther("1.5"));
    });

    it("Should allow negative staking", async function () {
      await expect(investRight.connect(addr1).addNegativeStake(0, { value: ethers.utils.parseEther("0.5") }))
        .to.emit(investRight, "StakeAdded")
        .withArgs(0, addr1.address, false, ethers.utils.parseEther("0.5"));

      expect(await investRight.getTotalNegativeStake(0)).to.equal(ethers.utils.parseEther("0.5"));
    });
  });

  describe("Viewer fees", function () {
    beforeEach(async function () {
      await investRight.createPrediction(
        "ETH",
        "ETH will moon",
        ethers.utils.parseEther("2000"),
        ethers.utils.parseEther("0.1"),
        Math.floor(Date.now() / 1000) + 86400,
        ethers.utils.formatBytes32String("ETH-USD"),
        { value: ethers.utils.parseEther("1") }
      );
    });

    it("Should collect viewer fees", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await investRight.connect(addr1).viewerFees(0, { value: ethers.utils.parseEther("0.1") });

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("0.1"));

      expect(await investRight.getTotalFeesCollected(0)).to.equal(ethers.utils.parseEther("0.1"));
    });

    it("Should not charge the prediction owner", async function () {
      await expect(investRight.viewerFees(0))
        .to.not.be.reverted;

      expect(await investRight.getTotalFeesCollected(0)).to.equal(0);
    });
  });

  describe("Reward distribution", function () {
    beforeEach(async function () {
      const targetDate = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
      const pythPriceId = ethers.utils.formatBytes32String("ETH-USD");

      await pythMock.setPrice(pythPriceId, ethers.utils.parseEther("1900"));

      await investRight.createPrediction(
        "ETH",
        "ETH will moon",
        ethers.utils.parseEther("2000"),
        ethers.utils.parseEther("0.1"),
        targetDate,
        pythPriceId,
        { value: ethers.utils.parseEther("1") }
      );

      await investRight.connect(addr1).addPositiveStake(0, { value: ethers.utils.parseEther("0.5") });
      await investRight.connect(addr2).addNegativeStake(0, { value: ethers.utils.parseEther("0.5") });
    });

    it("Should distribute rewards correctly when prediction is correct", async function () {
      const pythPriceId = ethers.utils.formatBytes32String("ETH-USD");
      await pythMock.setPrice(pythPriceId, ethers.utils.parseEther("2100"));

      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine");

      await expect(investRight.rewardDistribution(0))
        .to.emit(investRight, "RewardDistributed")
        .withArgs(0, true, ethers.utils.parseEther("2"));

      // Check balances after distribution
      // Note: This is a simplified check and doesn't account for gas costs
      const ownerBalance = await ethers.provider.getBalance(owner.address);
      const addr1Balance = await ethers.provider.getBalance(addr1.address);
      
      expect(ownerBalance).to.be.above(ethers.utils.parseEther("101"));
      expect(addr1Balance).to.be.above(ethers.utils.parseEther("100.5"));
    });

    it("Should distribute rewards correctly when prediction is incorrect", async function () {
      const pythPriceId = ethers.utils.formatBytes32String("ETH-USD");
      await pythMock.setPrice(pythPriceId, ethers.utils.parseEther("1900"));

      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine");

      await expect(investRight.rewardDistribution(0))
        .to.emit(investRight, "RewardDistributed")
        .withArgs(0, false, ethers.utils.parseEther("2"));

      // Check balances after distribution
      // Note: This is a simplified check and doesn't account for gas costs
      const addr2Balance = await ethers.provider.getBalance(addr2.address);
      
      expect(addr2Balance).to.be.above(ethers.utils.parseEther("102"));
    });

    it("Should not allow double distribution", async function () {
      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine");

      await investRight.rewardDistribution(0);

      await expect(investRight.rewardDistribution(0))
        .to.be.revertedWith("Rewards already distributed");
    });
  });
});