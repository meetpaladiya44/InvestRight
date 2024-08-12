  import React, { useEffect, useState } from "react";
  import { useRouter } from "next-nprogress-bar";
  import { IDKitWidget } from "@worldcoin/idkit";
  import { FaChevronDown, FaLock } from "react-icons/fa";
  import {
    useAccount,
    useWalletClient,
    useWriteContract,
    useWaitForTransactionReceipt,
  } from "wagmi";
  import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
  import InvestRightABI from "../Context/InvestRightABI.json";
  import { signIn, signOut, useSession } from "next-auth/react";
  import { ethers } from "ethers";
  import AttestationComponent from "../attest/components/AttestationComponent"

  const Attestation = ({ id }) => {
    const { address: userAddress, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const { openConnectModal } = useConnectModal();
    const [selectedAttestationType, setSelectedAttestationType] = useState("");
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const router = useRouter();
    const [isPositive, setIsPositive] = useState(false);
    const [stakeData, setStakeData] = useState({});
    const [attestationCompleted, setAttestationCompleted] = useState(false);
    const [signer, setSigner] = useState(null);

    console.log("iddddddddddddddddddd", typeof id?.toString());
    console.log("sessionnnnnnnnnn", session, status);

    const [isTxCompleted, setIsTxCompleted] = useState(false);

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

    useEffect(() => {
      setPrediction((prev) => ({ ...prev, predictionId: id?.toString() }));
    }, [id]);

    // Attestation states
    const [attestationType, setAttestationType] = useState("");
    const {
      data: hash,
      isPending,
      error,
      writeContractAsync,
    } = useWriteContract({
      address: "0x7ACC7E73967300a20f4f5Ba92fF9CB548b47Ea30",
      abi: InvestRightABI,
      functionName: "createPrediction",
    });

    const handleStake = async (e) => {
      e.preventDefault();

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
        const contract = new ethers.Contract(
          "0x7ACC7E73967300a20f4f5Ba92fF9CB548b47Ea30",
          InvestRightABI,
          signer
        );

        // Ensure stakeAmount is a valid number
        if (
          !prediction.stakeAmount ||
          isNaN(parseFloat(prediction.stakeAmount))
        ) {
          throw new Error("Invalid stake amount");
        }

        // Convert the stake amount to wei
        const stakeAmount = ethers.utils.parseEther(
          prediction.stakeAmount.toString()
        );

        // Handle predictionId
        let predictionId;
        try {
          predictionId = ethers.BigNumber.from(prediction.predictionId);
          console.log("Prediction ID (BigNumber):", predictionId.toString());
        } catch (error) {
          console.error("Error converting prediction ID to BigNumber:", error);
          throw new Error("Invalid prediction ID");
        }

        console.log("Sending transaction with:", {
          predictionId: predictionId.toString(),
          isPositive,
          stakeAmount: stakeAmount.toString(),
        });

        const tx = await contract.addStake(predictionId, isPositive, {
          value: stakeAmount,
        });

        await tx.wait();
        setIsTxCompleted(true);
        console.log("Stake added successfully!");

        setStakeData({
          predictionID: prediction.predictionId,
          worldID: session?.user?.name || session?.user?.email,
          yourView: isPositive ? "Positive" : "Negative",
          stakeAmount: prediction.stakeAmount,
        });

      } catch (error) {
        setIsTxCompleted(false);
        console.error("Error adding stake:", error);
      }
    };

    const handleStakeTypeChange = (e) => {
      const selectedValue = e.target.value;
      setSelectedAttestationType(selectedValue);
      setIsPositive(selectedValue === "positive");
    };

    const handleAttestationComplete = () => {
      setAttestationCompleted(true);
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
          <div
            className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-10 lg:py-20"
            style={{ minHeight: "80vh" }}
          >
            <div className="flex flex-col items-center justify-center xl:flex-row">
              <div className="flex flex-col items-center justify-center xl:flex-row">
                <div className="w-full  mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
                  <h3
                    className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none"
                    style={{
                      fontSize: "2.5rem",
                      color: "#fff",
                      animation: "pulseGlow 5s infinite",
                    }}
                  >
                    Invest Right : <br className="hidden md:block" />
                  </h3>
                  <h2
                    className="font-semibold  mb-4 text-base text-gray-200 md:text-lg"
                    style={{
                      fontSize: "1.5rem",
                      color: "#fff",
                      // overflow: "hidden",
                      // whiteSpace: "nowrap",
                      // animation: "typing 4s steps(40, end) 4s infinite",
                    }}
                  >
                    Predict the price of different crypto currencies...
                  </h2>
                  <p
                    className="font-normal max-w-xl mb-4 text-base text-gray-200 md:text-lg"
                    style={{ fontWeight: "300" }}
                  >
                    Predict cryptocurrency prices and share your insights in
                    interactive frames. Users can also attest to predictions with
                    positive, negative, or not useful votes.
                  </p>
                </div>
                <div className="w-full  xl:w-5/12" style={{ maxWidth: "42rem" }}>
                  <div className="bg-white rounded shadow-2xl p-7 sm:p-10">
                    <h3
                      className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl text-gray-800 border-b-2 border-[#644df4] pb-2"
                      style={{ color: "#644df6", fontWeight: "700" }}
                    >
                      Challenge The Prediction
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
                          style={{
                            padding: "10px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                            transition: "border-color 0.3s ease",
                            background: "#d3d3d373",
                          }}
                        >
                          {id}
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
                          style={{
                            padding: "10px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                            transition: "border-color 0.3s ease",
                            background: "#d3d3d373",
                          }}
                        >
                          {session
                            ? session?.user?.email
                              ? `${session.user.email.slice(
                                0,
                                6
                              )}...${session.user.email.slice(-4)}`
                              : `${session.user.name.slice(
                                0,
                                6
                              )}...${session.user.name.slice(-4)}`
                            : "SignIn with World ID"}
                        </div>
                      </div>

                      <div className="mb-1 sm:mb-2">
                        <label
                          htmlFor="coin"
                          className="inline-block mb-1 font-medium"
                        >
                          Your View
                        </label>
                        <div className="relative">
                          <select
                            required
                            className="flex-grow w-full h-12 px-4 mb-2 pr-10 transition duration-200 bg-[#d3d3d373] border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline hover:bg-transparent hover:border hover:border-solid hover:border-[#644df4]"
                            id="coinname"
                            name="coinname"
                            onChange={handleStakeTypeChange}
                            value={selectedAttestationType}
                            style={{
                              // background:"#d3d3d373",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                              transition: "border-color 0.3s ease",
                            }}
                          >
                            <option value="">Select View</option>
                            <option value="positive">Positive Stake</option>
                            <option value="negative">Negative Stake</option>
                          </select>
                          <FaChevronDown
                            style={{ color: "#644df4" }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>
                      <div className="mb-1 sm:mb-2">
                        <label
                          htmlFor="predictionPrice"
                          className="inline-block mb-1 font-medium"
                        >
                          Stack Amount
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            placeholder="Stack Amount"
                            required
                            type="text"
                            className="flex-grow w-full h-12 px-4 mb-2 pr-10 transition duration-200 bg-[#d3d3d373] border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline hover:bg-transparent hover:border hover:border-solid hover:border-[#644df4]"
                            id="stackamount"
                            name="stackamount"
                            onChange={(e) =>
                              setPrediction({
                                ...prediction,
                                stakeAmount: e.target.value,
                              })
                            }
                            style={{
                              // background:"#d3d3d373",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                              transition: "border-color 0.3s ease",
                            }}
                          />
                          <FaLock
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            style={{ fontSize: "20px", color: "#644df4" }} // Adjust size as needed
                          />
                        </div>
                      </div>
                    </form>

                    <div className="mt-4 mb-2 sm:mb-4">
                      {!session && !loading ? (
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 transition-all duration-300 hover:shadow-md">
                          <span className="block text-gray-600 text-center mb-4">
                            You are not signed in
                          </span>
                          <button
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600  text-white font-semibold px-6 py-3 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
                            onClick={() => signIn("worldcoin")}
                          >
                            Sign in with World ID
                          </button>
                        </div>
                      ) : session?.user ? (
                        <>
                          <div className="mb-6 space-y-4">
                            {selectedAttestationType === "positive" && (
                              <button
                                onClick={(e) => handleStake(e)}
                                className="ease-in-out transform hover:-translate-y-1 hover:shadow-lg mb-4 inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none newColor"
                              >
                                Positive Stake
                              </button>
                            )}
                            {selectedAttestationType === "negative" && (
                              <button
                                onClick={(e) => handleStake(e)}
                                className="ease-in-out transform hover:-translate-y-1 hover:shadow-lg mb-4 inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none newColor"
                              >
                                Negative Stake
                              </button>
                            )}
                          </div>
                          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 transition-all duration-300 hover:shadow-md">
                            <div className="flex items-center justify-center space-x-4 mb-4">
                              {session.user.image && (
                                <img
                                  src={session.user.image}
                                  alt="User Avatar"
                                  className="w-16 h-16 rounded-full border-2 border-green-400 shadow-lg"
                                />
                              )}
                              <div className="text-center">
                                <small className="block text-gray-500">
                                  Signed in as
                                </small>
                                <strong className="text-xl text-gray-800">
                                  {session.user.email
                                    ? `${session.user.email.slice(
                                      0,
                                      6
                                    )}...${session.user.email.slice(-4)}`
                                    : `${session.user.name.slice(
                                      0,
                                      6
                                    )}...${session.user.name.slice(-4)}`}
                                </strong>
                              </div>
                            </div>
                            <button
                              className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                              onClick={() => signOut()}
                            >
                              Sign out
                            </button>
                          </div>
                        </>
                      ) : null}
                      {isTxCompleted && stakeData && (
                        <AttestationComponent
                          stakeData={stakeData}
                          signer={signer}
                          onAttestationComplete={handleAttestationComplete}
                        />
                      )}
                      {/* {attestationCompleted && (
                        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                          Attestation completed successfully!
                        </div>
                      )} */}
                    </div>
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
