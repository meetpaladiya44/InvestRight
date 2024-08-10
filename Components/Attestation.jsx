import React, { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { IDKitWidget } from "@worldcoin/idkit";
import { useAccount, useWalletClient } from "wagmi";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const EAS_CONTRACT_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const SCHEMA_UID_FEEDBACK = "0xf96cba05e00404771493fc70715f5afa43f784d8bd464954358f216fc014e090";
const SCHEMA_UID_NOT_USEFUL = "0x74e3a8fc864bea385b06b01eae46dc3252332350946fd1a454464b40e08c549f";

const Attestation = ({ titleData, createPrediction }) => {
  const { address: userAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTxCompleted, setIsTxCompleted] = useState(false);
  const [done, setDone] = useState(false);

  const [prediction, setPrediction] = useState({
    predictionId: "",
    coin: "",
    reasoning: "",
    predictionPrice: "",
    stakeAmount: "",
    viewAmount: "",
    targetDate: "",
    pythPriceId: "",
  });

  // Attestation states
  const [showAttestationForm, setShowAttestationForm] = useState(false);
  const [attestationType, setAttestationType] = useState("");
  const [attestationData, setAttestationData] = useState({
    id: "",
    buttonName: "",
    amount: "",
    notUseful: "",
  });
  const [attestationResult, setAttestationResult] = useState("");

  const submitTx = async (proof) => {
    setDone(true);
    setIsLoggedIn(true);
  };

  const handleCreatePrediction = (e) => {
    e.preventDefault();
    // Implement your create prediction logic here
  };

  const handleAttestationButtonClick = (type) => {
    if (!isConnected) {
      openConnectModal();
      return;
    }
    setAttestationType(type);
    setShowAttestationForm(true);
    setAttestationData({ id: "", buttonName: "", amount: "", notUseful: "" });
  };

  const handleAttestationInputChange = (e) => {
    const { name, value } = e.target;
    setAttestationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const createAttestation = async () => {
    try {
      if (!walletClient) {
        throw new Error("Wallet not connected");
      }

      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      eas.connect(walletClient);

      let schemaEncoder, encodedData, schemaUID;

      if (attestationType === "notUseful") {
        schemaEncoder = new SchemaEncoder("uint256 id, string notUseful");
        encodedData = schemaEncoder.encodeData([
          { name: "id", value: parseInt(attestationData.id), type: "uint256" },
          { name: "notUseful", value: attestationData.notUseful, type: "string" },
        ]);
        schemaUID = SCHEMA_UID_NOT_USEFUL;
      } else {
        schemaEncoder = new SchemaEncoder("uint256 id, string buttonName, uint256 amount");
        encodedData = schemaEncoder.encodeData([
          { name: "id", value: parseInt(attestationData.id), type: "uint256" },
          { name: "buttonName", value: attestationData.buttonName, type: "string" },
          { name: "amount", value: attestationData.amount ? parseInt(attestationData.amount) : 0, type: "uint256" },
        ]);
        schemaUID = SCHEMA_UID_FEEDBACK;
      }

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: userAddress,
          expirationTime: 0,
          revocable: false,
          data: encodedData,
        },
        gasLimit: 500000,
      });

      const newAttestationUID = await tx.wait();
      setAttestationResult(`Attestation created successfully. UID: ${newAttestationUID}`);
    } catch (error) {
      console.error("Error creating attestation:", error);
      setAttestationResult(`Error creating attestation: ${error.message}`);
    }
  };

  const handleAttestationSubmit = (e) => {
    e.preventDefault();
    createAttestation();
    setShowAttestationForm(false);
  };

  return (
    <div className="relative">
      <div className="relative bg-[#644DF6]">
        <svg
          className="absolute inset-x-0 bottom-0 text-white"
          viewBox="0 0 1160 163"
        >
          <path
            fill="currentColor"
            d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V162.5H1216C1156 162.5 1036 162.5 916 162.5C796 162.5 676 162.5 556 162.5C436 162.5 316 162.5 196 162.5C76 162.5 -44 162.5 -104 162.5H-164V13Z"
          />
        </svg>
        <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-10 lg:py-20">
          <div className="flex flex-col items-center justify-center xl:flex-row">
            <div className="w-full  xl:w-5/12" style={{ maxWidth: "42rem" }}>
              <div className="bg-white rounded shadow-2xl p-7 sm:p-10">
                <h3
                  className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl"
                  style={{ color: "#644df6", fontWeight: "700" }}
                >
                  Attestation
                </h3>
                <form>
                  {/* Existing form fields */}
                  {/* ... */}
                </form>

                <div className="mt-4 mb-2 sm:mb-4">
                  {isLoggedIn ? (
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none newColor"
                      onClick={(e) => handleCreatePrediction(e)}
                    >
                      Make Prediction
                    </button>
                  ) : (
                    <IDKitWidget
                      app_id={process.env.NEXT_PUBLIC_APP_ID}
                      action={process.env.NEXT_PUBLIC_ACTION}
                      signal={userAddress}
                      onSuccess={submitTx}
                      autoClose
                    >
                      {({ open }) => (
                        <button
                          onClick={() => !done && open()}
                          className={`w-full py-4 px-6 rounded text-white font-semibold text-lg transition-all ${
                            !isConnected
                              ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                              : "bg-green-500 hover:bg-green-600"
                          } ${done ? "opacity-50 cursor-not-allowed" : ""} transform hover:scale-105`}
                          disabled={done}
                        >
                          {!isConnected ? "Connect Wallet" : "Login with WorldID"}
                          {done && "Transaction Completed"}
                        </button>
                      )}
                    </IDKitWidget>
                  )}
                </div>

                {/* Attestation buttons */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => handleAttestationButtonClick("positive")}
                    className="w-full px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
                  >
                    Positive Attestation
                  </button>
                  <button
                    onClick={() => handleAttestationButtonClick("negative")}
                    className="w-full px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
                  >
                    Negative Attestation
                  </button>
                  <button
                    onClick={() => handleAttestationButtonClick("notUseful")}
                    className="w-full px-6 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-200"
                  >
                    Not Useful Attestation
                  </button>
                </div>

                {/* Attestation form */}
                {showAttestationForm && (
                  <form onSubmit={handleAttestationSubmit} className="mt-8">
                    <div className="mb-4">
                      <label htmlFor="id" className="block text-gray-700 font-bold mb-2">
                        ID
                      </label>
                      <input
                        type="text"
                        id="id"
                        name="id"
                        value={attestationData.id}
                        onChange={handleAttestationInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                      />
                    </div>

                    {attestationType !== "notUseful" ? (
                      <>
                        <div className="mb-4">
                          <label htmlFor="buttonName" className="block text-gray-700 font-bold mb-2">
                            View
                          </label>
                          <input
                            type="text"
                            id="buttonName"
                            name="buttonName"
                            value={attestationData.buttonName}
                            onChange={handleAttestationInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
                            Amount
                          </label>
                          <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={attestationData.amount}
                            onChange={handleAttestationInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <div className="mb-4">
                        <label htmlFor="notUseful" className="block text-gray-700 font-bold mb-2">
                          View
                        </label>
                        <input
                          type="text"
                          id="notUseful"
                          name="notUseful"
                          value={attestationData.notUseful}
                          onChange={handleAttestationInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          required
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    >
                      Submit and Create Attestation
                    </button>
                  </form>
                )}

                {attestationResult && (
                  <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                    {attestationResult}
                  </div>
                )}

                {isTxCompleted && (
                  <div className="mt-4">
                    <label htmlFor="url" className="block text-gray-700 font-bold mb-2">
                      URL
                    </label>
                    <div id="url" style={{ padding: "8px 0", fontSize: "1rem" }}>
                      {`https://frog-setup.vercel.app/${prediction.predictionId}`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attestation;