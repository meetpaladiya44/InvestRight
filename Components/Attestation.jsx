import React, { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { IDKitWidget } from "@worldcoin/idkit";
import { FaChevronDown } from "react-icons/fa";
import {
  useAccount,
  useWalletClient,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import InvestRightABI from "../Context/InvestRightABI.json";

const EAS_CONTRACT_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const SCHEMA_UID_FEEDBACK =
  "0xf96cba05e00404771493fc70715f5afa43f784d8bd464954358f216fc014e090";
const SCHEMA_UID_NOT_USEFUL =
  "0x74e3a8fc864bea385b06b01eae46dc3252332350946fd1a454464b40e08c549f";

const Attestation = ({ titleData, createPrediction }) => {
  const { address: userAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { openConnectModal } = useConnectModal();
  const [selectedAttestationType, setSelectedAttestationType] = useState("");
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
  const {
    data: hash,
    isPending,
    error,
    writeContractAsync,
  } = useWriteContract({
    address: "0xD6f3d80FD0952C8Fd0764D7011d7475DF555cA42",
    abi: InvestRightABI,
    functionName: "createPrediction",
  });
  const submitTx = async (proof) => {
    setDone(true);
    setIsLoggedIn(true);
  };
  useWaitForTransactionReceipt({
    hash,
  });
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
          {
            name: "notUseful",
            value: attestationData.notUseful,
            type: "string",
          },
        ]);
        schemaUID = SCHEMA_UID_NOT_USEFUL;
      } else {
        schemaEncoder = new SchemaEncoder(
          "uint256 id, string buttonName, uint256 amount"
        );
        encodedData = schemaEncoder.encodeData([
          { name: "id", value: parseInt(attestationData.id), type: "uint256" },
          {
            name: "buttonName",
            value: attestationData.buttonName,
            type: "string",
          },
          {
            name: "amount",
            value: attestationData.amount
              ? parseInt(attestationData.amount)
              : 0,
            type: "uint256",
          },
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
      setAttestationResult(
        `Attestation created successfully. UID: ${newAttestationUID}`
      );
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
          className="absolute inset-x-0 bottom-[-2px] text-white"
          viewBox="0 0 1160 163"
        >
          <path
            fill="currentColor"
            d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V162.5H1216C1156 162.5 1036 162.5 916 162.5C796 162.5 676 162.5 556 162.5C436 162.5 316 162.5 196 162.5C76 162.5 -44 162.5 -104 162.5H-164V13Z"
          />
        </svg>
        <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-10 lg:py-20">
          <div className="flex flex-col items-center justify-center xl:flex-row">
            <div className="flex flex-col items-center justify-center xl:flex-row">
              <div className="w-full  mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
                <h3
                  className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none"
                  style={{ fontWeight: "700" }}
                >
                  Invest Right : <br className="hidden md:block" />
                </h3>
                <h2
                  className="font-semibold  mb-4 text-base text-gray-200 md:text-lg"
                  style={{
                    fontSize: "2rem",
                    lineHeight: "37px",
                    fontWeight: "700",
                  }}
                >
                  Predict the price of different crypto currencies
                </h2>
                <p className="font-semibold max-w-xl mb-4 text-base text-gray-200 md:text-lg">
                  Predict cryptocurrency prices and share your insights in
                  interactive frames. Users can also attest to predictions with
                  positive, negative, or not useful votes.
                </p>
              </div>
              <div className="w-full  xl:w-5/12" style={{ maxWidth: "42rem" }}>
                <div className="bg-white rounded shadow-2xl p-7 sm:p-10">
                  <h3
                    className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl"
                    style={{ color: "#644df6", fontWeight: "700" }}
                  >
                    Attestation
                  </h3>
                  <form>
                    <div className="mb-1 sm:mb-2">
                      <label
                        htmlFor="predictionPrice"
                        className="inline-block mb-1 font-medium"
                      >
                        Prediction Id
                      </label>
                      <div
                        disabled
                        type="text"
                        className="flex-grow w-full px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                        id="prediction-id"
                        name="prediction-id"
                        style={{ padding: "10px" }}
                      >
                        5
                      </div>
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <label
                        htmlFor="predictionPrice"
                        className="inline-block mb-1 font-medium"
                      >
                        World Id
                      </label>
                      <div
                        disabled
                        type="text"
                        className="flex-grow w-full px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                        id="prediction-id"
                        name="prediction-id"
                        style={{ padding: "10px" }}
                      >
                        6868
                      </div>
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <label
                        htmlFor="coin"
                        className="inline-block mb-1 font-medium"
                      >
                        Coin
                      </label>
                      <div className="relative">
                        <select
                          required
                          className="flex-grow w-full h-12 px-4 pr-10 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                          id="coinname"
                          name="coinname"
                          onChange={(e) =>
                            setSelectedAttestationType(e.target.value)
                          }
                          value={selectedAttestationType}
                        >
                          <option value="">Select View</option>
                          <option value="positive">Positive Stake</option>
                          <option value="negative">Negative Stake</option>
                        </select>
                        <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <label
                        htmlFor="predictionPrice"
                        className="inline-block mb-1 font-medium"
                      >
                        Stack Amount
                      </label>
                      <input
                        placeholder="Stack Amount"
                        required
                        type="text"
                        className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                        id="stackamount"
                        name="stackamount"
                      />
                    </div>
                  </form>

                  <div className="mt-4 mb-2 sm:mb-4">
                    {!isConnected ? (
                      <ConnectButton />
                    ) : !isLoggedIn ? (
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
                              !hash && !isPending
                                ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                                : isPending
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-500 hover:bg-green-600"
                            } ${
                              done ? "opacity-50 cursor-not-allowed" : ""
                            } transform hover:scale-105`}
                            disabled={done}
                          >
                            Login with WorldID
                            {done && " - Transaction Completed"}
                          </button>
                        )}
                      </IDKitWidget>
                    ) : (
                      <div className="mt-8 space-y-4">
                        {selectedAttestationType === "positive" && (
                          <button
                            onClick={() =>
                              handleAttestationButtonClick("positive")
                            }
                            className="transition-all transform hover:scale-105 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 w-full py-4 px-6 rounded text-white font-semibold text-lg"
                          >
                            Positive Stake
                          </button>
                        )}
                        {selectedAttestationType === "negative" && (
                          <button
                            onClick={() =>
                              handleAttestationButtonClick("negative")
                            }
                            className="transition-all transform hover:scale-105 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 w-full py-4 px-6 rounded text-white font-semibold text-lg"
                          >
                            Negative Stake
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {attestationResult && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                      {attestationResult}
                    </div>
                  )}

                  {isTxCompleted && (
                    <div className="mt-4">
                      <label
                        htmlFor="url"
                        className="block text-gray-700 font-bold mb-2"
                      >
                        URL
                      </label>
                      <div
                        id="url"
                        style={{ padding: "8px 0", fontSize: "1rem" }}
                      >
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
    </div>
  );
};

export default Attestation;
