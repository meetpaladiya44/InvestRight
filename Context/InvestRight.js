import React, { useState, useEffect } from "react";
import Wenb3Modal from "web3modal";
import { ethers } from "ethers";

//INTERNAL  IMPORT
import {
  InvestRightABI,
  InvestRightAddress,
  handleNetworkSwitch,
} from "./Invest";

//---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(InvestRightAddress, InvestRightABI, signerOrProvider);

export const CryptoPredictionContext = React.createContext();

export const InvestRightProvider = ({ children }) => {
  const titleData = "Invest Right Contract";
  const [currentAccount, setCurrentAccount] = useState("");

  const getAddress = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      return accounts[0];
    } catch (error) {
      console.log("Something wrong while connecting to wallet");
    }
  };

  const createPrediction = async (prediction) => {
    const { title, description, amount, deadline } = prediction;
    const web3Modal = new Wenb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    console.log(currentAccount);
    try {
      const transaction = await contract.createPrediction(
        currentAccount, // owner
        title, // title
        description, // description
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime() // deadline,
      );

      await transaction.wait();

      console.log("contract call success", transaction);
      window.location.reload();
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getPredictions = async () => {
    try {
      const address = await checkIfWalletConnected();
      if (address) {
        const web3Modal = new Wenb3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const contract = fetchContract(provider);

        const predictions = await contract.getStakes();

        const parsedPredictions = predictions.map((prediction, i) => ({
          owner: prediction.owner,
          title: prediction.title,
          description: prediction.description,
          target: ethers.utils.formatEther(prediction.target.toString()),
          deadline: prediction.deadline.toNumber(),
          amountCollected: ethers.utils.formatEther(
            prediction.amountCollected.toString()
          ),
          pId: i,
        }));
        console.log(parsedPredictions);
        return parsedPredictions;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserPredictions = async () => {
    try {
      const address = await checkIfWalletConnected();
      if (address) {
        const web3Modal = new Wenb3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const contract = fetchContract(provider);

        const allPredictions = await contract.getStakes();

        const filteredPredictions = allPredictions.filter(
          (prediction) =>
            prediction.owner.toLowerCase() === address.toLowerCase()
        );

        const userData = filteredPredictions.map((prediction, i) => ({
          owner: prediction.owner,
          title: prediction.title,
          description: prediction.description,
          target: ethers.utils.formatEther(prediction.target.toString()),
          deadline: prediction.deadline.toNumber(),
          amountCollected: ethers.utils.formatEther(
            prediction.amountCollected.toString()
          ),
          pId: i,
        }));

        return userData;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stake = async (pId, amount) => {
    try {
      const web3Modal = new Wenb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const predictionData = await contract.stakeToPrediction(pId, {
        value: ethers.utils.parseEther(amount),
      });

      await predictionData.wait();
      window.location.reload();

      return predictionData;
    } catch (error) {
      console.log(error);
    }
  };

  const getStakes = async (pId) => {
    try {
      const web3Modal = new Wenb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const contract = fetchContract(provider);

      const stakes = await contract.getstakers(pId);
      const numberOfStakes = stakes[0].length;

      const parsedStakes = [];

      for (let i = 0; i < numberOfStakes; i++) {
        parsedStakes.push({
          staker: stakes[0][i],
          stake: ethers.utils.formatEther(stakes[1][i].toString()),
        });
      }

      return parsedStakes;
    } catch (error) {
      console.log(error);
    }
  };

  //---CHECK IF WALLET IS CONNECTD
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");
      const network = await handleNetworkSwitch();

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        return accounts[0];
      } else {
        console.log("No Account Found");
      }
    } catch (error) {
      console.log("Something wrong while connecting to wallet");
    }
  };

  //---CONNET WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error while connecting to wallet");
    }
  };

  const gasLimit = async () => {
    try {
      const web3Modal = new Wenb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      //0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
      const stakes = await contract.send(
        "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        {
          value: ethers.utils.parseEther("45"),
          gasLimit: 100000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount(null);
    setProvider(null);
  };
  return (
    <CryptoPredictionContext.Provider
      value={{
        titleData,
        currentAccount,
        createPrediction,
        getStakes,
        disconnectWallet,
        getUserPredictions,
        stake,
        getStakes,
        connectWallet,
        gasLimit,
      }}
    >
      {children}
    </CryptoPredictionContext.Provider>
  );
};
