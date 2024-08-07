import React, { useState } from "react";
import { useRouter } from  "next-nprogress-bar";

const Hero = ({ titleData, createPrediction }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const [prediction, setPrediction] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
  });

  const handleWorldIDLogin = () => {
    router.push('/login');
  }

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
            <div className="w-full max-w-xl mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
              <h3 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
                Invest Right: <br className="hidden md:block" />
                Predict the price of different crypto currencies
              </h3>
              <p className="font-semibold max-w-xl mb-4 text-base text-gray-200 md:text-lg">
              Predict cryptocurrency prices and share your insights in interactive frames. Users can also attest to predictions with positive, negative, or not useful votes.
              </p>
            </div>
            <div className="w-full max-w-xl xl:w-5/12">
              <div className="bg-white rounded shadow-2xl p-7 sm:p-10">
                <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
                  Predict
                </h3>
                <form>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="firstName"
                      className="inline-block mb-1 font-medium"
                    >
                      Coin
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          title: e.target.value,
                        })
                      }
                      placeholder="coin"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="firstName"
                      name="firstName"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="lastName"
                      className="inline-block mb-1 font-medium"
                    >
                      Reason
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          description: e.target.value,
                        })
                      }
                      placeholder="description"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="lastName"
                      name="lastName"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="email"
                      className="inline-block mb-1 font-medium"
                    >
                      Current Price
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          amount: e.target.value,
                        })
                      }
                      placeholder="amount"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="email"
                      name="email"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="email"
                      className="inline-block mb-1 font-medium"
                    >
                      Prediction Price
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          amount: e.target.value,
                        })
                      }
                      placeholder="target price"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="email"
                      name="email"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="email"
                      className="inline-block mb-1 font-medium"
                    >
                      Stake Amount
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          amount: e.target.value,
                        })
                      }
                      placeholder="stake amount"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="email"
                      name="email"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="email"
                      className="inline-block mb-1 font-medium"
                    >
                      View Price
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          amount: e.target.value,
                        })
                      }
                      placeholder="view amount"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="email"
                      name="email"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="email"
                      className="inline-block mb-1 font-medium"
                    >
                      Deadline
                    </label>
                    <input
                      onChange={(e) =>
                        setPrediction({
                          ...prediction,
                          deadline: e.target.value,
                        })
                      }
                      placeholder="target date"
                      required
                      type="date"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      id="email"
                      name="email"
                    />
                  </div>
                  <div className="mt-4 mb-2 sm:mb-4">
                    {isLoggedIn ? (
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none newColor"
                      >
                        Make Prediction
                      </button>
                    ) : (
                      <button
                        onClick={handleWorldIDLogin}
                        type="submit"
                        className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none newColor"
                      >
                        <span>Login With WorldID</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Create your prediction on any crypto currency you want
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
