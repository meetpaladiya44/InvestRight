import React, { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

const EAS_CONTRACT_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const SCHEMA_UID = "0x3a2e12a15e7e22546834f0b96bcce7f0596cedfa952b1e6b43d3569f682eb6e8";

const AttestationForm = ({ initialData, onAttestationComplete }) => {
  const [formData, setFormData] = useState({
    predictionID: "",
    worldID: "",
    yourView: "",
    stakeAmount: "",
  });
  const [attestationResult, setAttestationResult] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const createAttestation = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      if (!window.ethereum) {
        throw new Error(
          "Ethereum provider is not available. Please install MetaMask."
        );
      }

      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const senderAddress = await signer.getAddress();

      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      eas.connect(signer);

      const schemaEncoder = new SchemaEncoder("uint256 predictionID,string worldID,string yourView,uint128 stakeAmount");
      const encodedData = schemaEncoder.encodeData([
        { name: "predictionID", value: parseInt(formData.predictionID), type: "uint256" },
        { name: "worldID", value: formData.worldID, type: "string" },
        { name: "yourView", value: formData.yourView, type: "string" },
        { name: "stakeAmount", value: ethers.utils.parseUnits(formData.stakeAmount, 'ether').toString(), type: "uint128" },
      ]);

      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: senderAddress,
          expirationTime: 0,
          revocable: false,
          data: encodedData,
        },
        gasLimit: 500000,
      });

      const newAttestationUID = await tx.wait();

      setAttestationResult(
        `Attestation created successfully. UID: ${newAttestationUID}`
      );
      if (onAttestationComplete) onAttestationComplete();
    } catch (error) {
      console.error("Error creating attestation:", error);
      setAttestationResult(`Error creating attestation: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Confirm Attestation</h2>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <p><strong>Prediction ID:</strong> {formData.predictionID}</p>
        <p><strong>World ID:</strong> {formData.worldID}</p>
        <p><strong>Your View:</strong> {formData.yourView}</p>
        <p><strong>Stake Amount:</strong> {formData.stakeAmount} ETH</p>
        <button
          onClick={createAttestation}
          className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Create Attestation
        </button>
      </div>
      {attestationResult && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          {attestationResult}
        </div>
      )}
    </div>
  );
};

export default AttestationForm;