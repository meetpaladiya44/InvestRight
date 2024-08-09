require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const NEXT_PUBLIC_SEPOLIA_RPC = "https://rpc.sepolia.org";
const NEXT_PUBLIC_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
    ]
  },
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: NEXT_PUBLIC_SEPOLIA_RPC,
      accounts: NEXT_PUBLIC_PRIVATE_KEY,
      gas: 12000000,
      gasPrice: 25000000000 // 25 gwei
    },
  },
  mocha: {
    timeout: 60000 // Increase timeout to 60 seconds
  }
};
