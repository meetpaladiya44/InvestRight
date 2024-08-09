const hre = require("hardhat");

async function main() {
  const InvestRight = await hre.ethers.getContractFactory("InvestRight");
  const investRight = await InvestRight.deploy();

  await investRight.deployed();

  console.log(`investRight deployed to ${investRight.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//npx hardhat run scripts/deploy.js --network mode
//npx hardhat run scripts/deploy.js --network localhost