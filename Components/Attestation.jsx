import React, { useState, useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useContractWrite,
} from "wagmi";
import InvestRightABI from "../Context/InvestRightABI.json";
import { ethers } from "ethers";

const Attestation = ({ titleData, createPrediction }) => {
  const { address: userAddress } = useAccount();
  const account = useAccount();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTxCompleted, setIsTxCompleted] = useState(false);
  const router = useRouter();
  const [done, setDone] = useState(false);
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
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const submitTx = async (proof) => {
    // Implement your transaction logic here
    setDone(true);
    setIsLoggedIn(true);
  };

  const [prediction, setPrediction] = useState({
    predictionId: ethers.BigNumber.from(
      ethers.utils.randomBytes(32)
    ).toString(),
    coin: "",
    reasoning: "",
    predictionPrice: "",
    stakeAmount: "",
    viewAmount: "",
    targetDate: "",
    pythPriceId: "",
  });

  return (
    <div className="relative">
      <span className=""></span>
      {/* <img
      src="https://img.freepik.com/free-vector/gradient-stock-market-concept-with-statistics_23-2149157696.jpg?semt=ais_hybrid"
      className="absolute inset-0 object-cover w-full h-full"
      alt=""
    /> */}
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
                  Predict
                </h3>
                <form>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="reason"
                      className="inline-block mb-1 font-medium"
                    >
                      Reason
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          reasoning: e.target.value,
                        })
                      }
                      placeholder="reasoning"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="reason"
                      name="reason"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="predictionPrice"
                      className="inline-block mb-1 font-medium"
                    >
                      Prediction Price
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          predictionPrice: e.target.value,
                        })
                      }
                      placeholder="target price"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="predictionPrice"
                      name="predictionPrice"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="stakeAmount"
                      className="inline-block mb-1 font-medium"
                    >
                      Stake Amount
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          stakeAmount: e.target.value,
                        })
                      }
                      placeholder="stake amount"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="stakeAmount"
                      name="stakeAmount"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="viewPrice"
                      className="inline-block mb-1 font-medium"
                    >
                      View Price
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          viewAmount: e.target.value,
                        })
                      }
                      placeholder="view amount"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="viewPrice"
                      name="viewPrice"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="deadline"
                      className="inline-block mb-1 font-medium"
                    >
                      Deadline
                    </label>
                    <input
                      onChange={(e) => {
                        const targetDate =
                          new Date(e.target.value).getTime() / 1000; // Convert to epoch
                        setPrediction({
                          ...prediction,
                          targetDate: targetDate,
                        });
                      }}
                      placeholder="target date"
                      required
                      type="date"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="deadline"
                      name="deadline"
                    />
                  </div>
                </form>
                <p className="text-xs text-gray-600 sm:text-sm">
                  Note: The current price of the Coin will be retrieved using
                  the Pyth oracle.{" "}
                </p>

                <p className="text-xs text-gray-600 sm:text-sm">
                  Create your prediction on any crypto currency you want
                </p>

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
                      signal={account.address}
                      onSuccess={submitTx}
                      // handleVerify={handleVerify}
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
                          {!hash &&
                            (isPending
                              ? "Pending, please check your wallet..."
                              : "Login with WorldID")}
                          {done && "Transaction Completed"}
                        </button>
                      )}
                    </IDKitWidget>
                  )}
                  {/* <button
                    type="submit"
                    className={`${
                      isTxCompleted
                        ? "hidden"
                        : "inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none newColor"
                    }`}
                    onClick={(e) => handleCreatePrediction(e)}
                  >
                    Make Prediction
                  </button> */}
                  {isTxCompleted && (
                    <div>
                      <label
                        htmlFor="url"
                        className="inline-block mb-1 font-medium"
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
