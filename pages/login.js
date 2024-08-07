import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

export default function Login() {
  const account = useAccount();
  const [done, setDone] = useState(false);
  const {
    data: hash,
    isPending,
    error,
    writeContractAsync,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const submitTx = async (proof) => {
    // Implement your transaction logic here
    setDone(true);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-green-500 to-blue-500"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-14 -mt-1 text-center text-white">
            Verify Your World ID
          </h1>

          <div className="relative mt-8 mb-8 p-6 border-2 border-yellow-400 rounded-lg bg-white shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full border-4 border-yellow-300 flex items-center justify-center overflow-hidden">
              <img
                src="https://pbs.twimg.com/profile_images/1683371529269137409/1VQdZPHJ_400x400.jpg"
                alt="Worldcoin"
                className="w-20 h-20 object-cover transform hover:scale-110 transition-transform duration-300"
              />
            </div>
            <p className="text-lg text-gray-700 mt-8 text-center">
              Authenticate with World ID to make predictions and provide
              attestations. This verification step ensures only real users
              contribute, fostering a trustworthy environment
            </p>
          </div>

          <div className="mb-6 flex justify-center">
            <ConnectKitButton />
          </div>

          {account.isConnected && (
            <div className="space-y-4">
              <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_APP_ID}
                action={process.env.NEXT_PUBLIC_ACTION}
                signal={account.address}
                onSuccess={submitTx}
                autoClose
              >
                {({ open }) => (
                  <button
                    onClick={() => !done && open()}
                    className={`w-full py-4 px-6 rounded-full text-white font-semibold text-lg transition-all ${
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
                        : "Verify and Execute Transaction")}
                    {done && "Transaction Completed"}
                  </button>
                )}
              </IDKitWidget>

              {hash && (
                <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Transaction Hash:</span>
                    <span className="break-all">{hash}</span>
                  </p>
                </div>
              )}
              {isConfirming && (
                <p className="text-yellow-600 text-center">
                  Waiting for confirmation...
                </p>
              )}
              {isConfirmed && (
                <p className="text-green-600 text-center font-semibold">
                  Transaction confirmed!
                </p>
              )}
              {error && (
                <div
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
                  role="alert"
                >
                  <p className="font-bold">Error</p>
                  <p>{error.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
