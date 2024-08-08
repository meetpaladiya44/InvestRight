require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const NEXT_PUBLIC_MODE_RPC = "https://rpc-amoy.polygon.technology/";
const NEXT_PUBLIC_PRIVATE_KEY = "914da5698898a53e6b5d2490f3ad1081fcb0ea1466e5992a8fa1da3b73accd91"; // Add your private key here

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
