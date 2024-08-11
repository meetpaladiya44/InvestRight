import { ethers } from "ethers";
import Web3Modal from "web3modal";
import InvestRight from "./InvestRight.json";

//------------SEPOLIA NETWORK
export const InvestRightAddress = "0x7ACC7E73967300a20f4f5Ba92fF9CB548b47Ea30";

export const InvestRightABI = InvestRight.abi;

//NETWORK
const networks = {
  sepolia_testnet: {
    chainId: `0x${Number(11155111).toString(16)}`,
    chainName: "Sepolia Testnet",
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "SETH",
      decimals: 18,
    },
    rpcUrls: process.env.RPC_URL,
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
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