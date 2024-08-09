require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const NEXT_PUBLIC_MODE_RPC = "https://sepolia.mode.network/";
const NEXT_PUBLIC_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
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
  defaultNetwork: "mode",
  networks: {
    hardhat: {},
    mode: {
      url: NEXT_PUBLIC_MODE_RPC,
      accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
      gas: 12000000,
      gasPrice: 25000000000 // 25 gwei
    },
  },
  mocha: {
    timeout: 60000 // Increase timeout to 60 seconds
  }
};
