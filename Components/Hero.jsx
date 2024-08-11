import React, { useState, useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { FaCopy, FaCheck } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaHandPointLeft } from "react-icons/fa";
import { FaDollarSign, FaLock } from "react-icons/fa";

import img1 from "../public/reason.png";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import InvestRightABI from "../Context/InvestRightABI.json";
import { ethers } from "ethers";
import { signIn, signOut, useSession } from "next-auth/react";
import axios from "axios";

const Hero = ({ titleData, createPrediction }) => {
  const { address: userAddress } = useAccount();
  const [copied, setCopied] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const account = useAccount();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTxCompleted, setIsTxCompleted] = useState(false);
  const router = useRouter();
  const [done, setDone] = useState(false);
  const baseUrl = "https://frog-setup.vercel.app/api/";
  const [linkData, setLinkData] = useState({ fullLink: "", slicedLink: "" });

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
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [prediction, setPrediction] = useState({
    predictionId: ethers.BigNumber.from(
      ethers.utils.randomBytes(32)
    )
      .mod(1e8)
      .toString(),
    coin: "",
    reasoning: "",
    predictionPrice: "",
    stakeAmount: "",
    viewAmount: "",
    targetDate: "",
    pythPriceId: "",
  });

  const pythPriceIdOptions = [
    {
      value:
        "0x385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf",
      label: "OP",
    },
    {
      value:
        "0xd6835ad1f773de4a378115eb6824bd0c0e42d84d1c84d9750e853fb6b6c7794a",
      label: "WLD",
    },
    {
      value:
        "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
      label: "BTC",
    },
    {
      value:
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
      label: "ETH",
    },
    {
      value:
        "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
      label: "SOL",
    },
    {
      value:
        "0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445",
      label: "AAVE",
    },
    {
      value:
        "0x4a8e42861cabc5ecb50996f92e7cfa2bce3fd0a2423b0c44c9b423fb2bd25478",
      label: "COMP",
    },
    {
      value:
        "0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c",
      label: "DOGE",
    },
    {
      value:
        "0x0781209c28fda797616212b7f94d77af3a01f3e94a5d421760aef020cf2bcb51",
      label: "GALA",
    },
    {
      value:
        "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221",
      label: "LINK",
    },
    {
      value:
        "0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52",
      label: "MATIC",
    },
    {
      value:
        "0xc415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750",
      label: "NEAR",
    },
    {
      value:
        "0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b",
      label: "TRX",
    },
    {
      value:
        "0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8",
      label: "XRP",
    },
    {
      value:
        "0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501",
      label: "UNI",
    },
  ];

  // Make sure this is inside the component body
  const fullLink = `${baseUrl}${prediction.predictionId}`;

  // Function to truncate the link
  const truncateLink = (link) => {
    if (link.length <= 30) return link;
    return link.slice(0, 30) + "..." + link.slice(-7);
  };

  useEffect(() => {
    const fullLink = `${baseUrl}${prediction.predictionId}`;
    const slicedLink = truncateLink(fullLink);
    setLinkData({ fullLink, slicedLink });
  }, [prediction.predictionId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullLink); // Copy the full link
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  const handleVerify = async (proof) => {
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proof),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Verification failed:", errorData);
        throw new Error(`Verification failed: ${errorData.message}`);
      }

      // Verification successful
      console.log("Verification successful!");
    } catch (error) {
      console.error("Error during verification:", error);
      throw error; // Rethrow the error for the IDKitWidget to handle
    }
  };

  // console.log(prediction);

  const handleCreatePrediction = async (e) => {
    e.preventDefault();

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        "0x7ACC7E73967300a20f4f5Ba92fF9CB548b47Ea30",
        InvestRightABI,
        signer
      );

      const stakeAmount = ethers.utils.parseEther(prediction.stakeAmount);
      const viewAmount = ethers.utils.parseEther(prediction.viewAmount);

      const tx = await contract.createPrediction(
        prediction.predictionId.toString(),
        prediction.coin,
        prediction.reasoning,
        prediction.predictionPrice.toString(),
        viewAmount.toString(),
        prediction.targetDate.toString(),
        prediction.pythPriceId,
        { value: stakeAmount }
      );

      await tx.wait();
      setIsTxCompleted(true);
      console.log("Prediction created successfully!");
    } catch (error) {
      setIsTxCompleted(false);
      console.log("Error creating prediction:", error);
    }
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
              <div
                className="w-full  xl:w-5/12"
                style={{
                  maxWidth: "42rem",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="bg-white rounded shadow-2xl p-7 sm:p-10">
                  <h3
                    className="sm:text-center sm:mb-6 sm:text-2xl text-2xl font-bold mb-6 text-gray-800 border-b-2 border-[#644df4] pb-2"
                    style={{ color: "#644df6", fontWeight: "700" }}
                  >
                    Predict
                  </h3>
                  <form>
                    <div className="mb-1 sm:mb-2">
                      <label
                        htmlFor="coin"
                        className="inline-block mb-1 font-medium"
                      >
                        Coin
                      </label>
                      <div className="relative">
                        <select
                          style={{
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                            transition: "border-color 0.3s ease",
                          }}
                          onChange={(e) => {
                            const selectedCoin = pythPriceIdOptions.find(
                              (option) => option.value === e.target.value
                            );
                            setPrediction({
                              ...prediction,
                              coin: selectedCoin.label,
                              pythPriceId: selectedCoin.value,
                            });
                          }}
                          value={prediction.pythPriceId}
                          required
                          className="flex-grow w-full h-12 px-4 mb-2 pr-10 transition duration-200 bg-[#d3d3d373] border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline hover:bg-transparent hover:border hover:border-solid hover:border-[#644df4]"
                          id="coinname"
                          name="coinname"
                        >
                          <option value="">Select Coin </option>
                          {pythPriceIdOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <FaChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                          style={{ color: "#644df4" }}
                        />
                      </div>
                    </div>
                    <div className="mb-1 sm:mb-2 relative">
                      <label
                        htmlFor="reason"
                        className="inline-block mb-1 font-medium"
                      >
                        Reason
                      </label>
                      <div className="relative">
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
                          className="flex-grow w-full h-12 px-4 mb-2 pr-10 transition duration-200 bg-[#d3d3d373] border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline hover:bg-transparent hover:border hover:border-solid hover:border-[#644df4]"
                          id="reason"
                          name="reason"
                          style={{
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                            transition: "border-color 0.3s ease",
                          }}
                        />
                        <FaHandPointLeft
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                          style={{ fontSize: "20px", color: "#644df4" }} // Adjust size as needed
                        />
                      </div>
                    </div>
                    {/* <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="currentPrice"
                      className="inline-block mb-1 font-medium"
                    >
                      Current Price
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          currentPrice: e.target.value,
                        })
                      }
                      placeholder="current price"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="currentPrice"
                      name="currentPrice"
                    />
                  </div> */}
                    <div className="mb-1 sm:mb-2">
                      <label
                        htmlFor="predictionPrice"
                        className="inline-block mb-1 font-medium"
                      >
                        Prediction Price
                      </label>
                      <div style={{ position: "relative" }}>
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
                          className="flex-grow w-full h-12 px-4 mb-2 pr-10 transition duration-200 bg-[#d3d3d373] border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline hover:bg-transparent hover:border hover:border-solid hover:border-[#644df4]"
                          id="predictionPrice"
                          name="predictionPrice"
                          style={{
                            // background:"#d3d3d373",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                            transition: "border-color 0.3s ease",
                          }}
                        />
                        <FaDollarSign
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                          style={{ fontSize: "20px", color: "#644df4" }} // Adjust size as needed
                        />
                      </div>
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <label
                        htmlFor="stakeAmount"
                        className="inline-block mb-1 font-medium"
                      >
                        Stake Amount
                      </label>
                      <div style={{ position: "relative" }}>
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
                          className="flex-grow w-full h-12 px-4 mb-2 pr-10 transition duration-200 bg-[#d3d3d373] border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline hover:bg-transparent hover:border hover:border-solid hover:border-[#644df4]"
                          id="stakeAmount"
                          name="stakeAmount"
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
                    <div className="mb-1 sm:mb-2">
                      <label
                        htmlFor="viewPrice"
                        className="inline-block mb-1 font-medium"
                      >
                        View Fees
                      </label>
                      <div style={{ position: "relative" }}>
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
                          className="flex-grow w-full h-12 px-4 mb-2 pr-10 transition duration-200 bg-[#d3d3d373] border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline hover:bg-transparent hover:border hover:border-solid hover:border-[#644df4]"
                          id="viewPrice"
                          name="viewPrice"
                          style={{
                            // background:"#d3d3d373",

                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                            transition: "border-color 0.3s ease",
                          }}
                        />
                        <FaDollarSign
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                          style={{ fontSize: "20px", color: "#644df4" }} // Adjust size as needed
                        />
                      </div>
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
                        className="flex-grow w-full h-12 px-4 mb-2 pr-10 transition duration-200 bg-[#d3d3d373] border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline hover:bg-transparent hover:border hover:border-solid hover:border-[#644df4]"
                        id="deadline"
                        name="deadline"
                        style={{
                          // background:"#d3d3d373",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                          transition: "border-color 0.3s ease",
                        }}
                      />
                    </div>
                    {/* <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="pythPriceId"
                      className="inline-block mb-1 font-medium"
                    >
                      Crypto Price Pair
                    </label>
                    <select
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          pythPriceId: e.target.value,
                        })
                      }
                      value={prediction.pythPriceId}
                      required
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="pythPriceId"
                      name="pythPriceId"
                    >
                      <option value="">Available Crypto Pairs</option>
                      {pythPriceIdOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div> */}
                  </form>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Note: The current price of the Coin will be retrieved using
                    the Pyth oracle.{" "}
                  </p>

                  <p className="text-xs text-gray-600 sm:text-sm">
                    Create your prediction on any crypto currency you want
                  </p>

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
                      <div>
                        <button
                          type="submit"
                          className="ease-in-out transform hover:-translate-y-1 hover:shadow-lg mb-4 inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none newColor"
                          onClick={(e) => handleCreatePrediction(e)}
                        >
                          Make Prediction
                        </button>
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
                      </div>
                    ) : null}
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
                          className="inline-block mb-1 font-medium py-4"
                          style={{ fontSize: "18px" }}
                        >
                          Link for Farcaster
                        </label>
                        <div
                          id="url"
                          className="p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 overflow-x-auto whitespace-nowrap"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <a
                            href={linkData.fullLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "blue" }}
                          >
                            {linkData.slicedLink}
                          </a>
                          <button
                            onClick={copyToClipboard}
                            className="text-[#644df4] hover:text-[#4e3ac2] focus:outline-none transition-colors duration-200"
                            style={{
                              marginLeft: "10px",
                              animation: "pulse 1.5s infinite",
                            }}
                            title={copied ? "Copied!" : "Copy to clipboard"}
                          >
                            {copied ? (
                              <FaCheck className="h-6 w-6" />
                            ) : (
                              <FaCopy className="h-6 w-6" />
                            )}
                          </button>
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
    </div>
  );
};

export default Hero;
