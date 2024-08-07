require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const NEXT_PUBLIC_MODE_RPC = "https://rpc-amoy.polygon.technology/";
const NEXT_PUBLIC_PRIVATE_KEY =
  "914da5698898a53e6b5d2490f3ad1081fcb0ea1466e5992a8fa1da3b73accd91";
module.exports = {
  solidity: "^0.8.9",
  defaultNetwork: "mode",
  networks: {
    hardhat: {},
    polygon_amoy: {
      url: NEXT_PUBLIC_MODE_RPC,
      accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
    },
  },
};