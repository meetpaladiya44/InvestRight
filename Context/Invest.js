import { ethers } from "ethers";
import Web3Modal from "web3modal";
import InvestRight from "./InvestRight.json";

//------------MODE NETWORK
export const InvestRightAddress = "0xb2de1C37805cd87edDcb4ce5deb0a4043A3561ba";

export const InvestRightABI = InvestRight.abi;

//NETWORK
const networks = {
  mode_testnet: {
    chainId: `0x${Number(919).toString(16)}`,
    chainName: "Mode Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.mode.network/"],
    blockExplorerUrls: ["https://sepolia.explorer.mode.network/"],
  },
  localhost: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "localhost",
    nativeCurrency: {
      name: "GO",
      symbol: "GO",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
};

const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networks[networkName],
        },
      ],
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const handleNetworkSwitch = async () => {
  const networkName = "mode_testnet";
  await changeNetwork({ networkName });
};