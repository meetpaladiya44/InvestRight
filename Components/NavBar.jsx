import React, { useState, useContext } from "react";

import { CryptoPredictionContext } from "../Context/CryptoPredictor.js";
import { Logo, Menu } from "../Components/index";
import styles from "../css/BtnShine.module.css";
import Image from "next/image";
import Hero from "../assets/images/Hero.png";

const NavBar = () => {
  const { currentAccount, connectWallet } = useContext(CryptoPredictionContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div class=" bg-[#000000cf]">
      <div class="px-[60px] py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div class="relative flex items-center justify-between">
          <div class="flex items-center">
            <a
              href="/"
              aria-label="InvestRight"
              title="InvestRight"
              class="inline-flex items-center mr-8"
            >
              <Image src={Hero} alt="My Image" width={53} height={30} />
              <div class="ml-2 text-[26px] font-bold tracking-wide text-gray-100">
                InvestRight
              </div>
            </a>
          </div>
          {!currentAccount && (
            <ul class="items-center hidden space-x-8 lg:flex">
              <li>
                <button
                  onClick={() => connectWallet()}
                  class={`inline-flex items-center justify-center py-2 px-4 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none background ${styles.btnShine}`}
                  aria-label="Sign up"
                  title="Sign up"
                >
                  Connect Wallet
                </button>
              </li>
            </ul>
          )}

          <div class="lg:hidden z-40">
            <button
              aria-label="Open Menu"
              title="Open Menu"
              class="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setIsMenuOpen(true)}
            >
            </button>
            {isMenuOpen && (
              <div class="absolute top-0 left-0 w-full">
                <div class="p-5 bg-white border rounded shadow-sm">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <a
                        href="/"
                        aria-label="InvestRight"
                        title="InvestRight"
                        class="inline-flex items-center"
                      >
                        <Logo color="text-black" />
                        <span class="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">
                          InvestRight 
                        </span>
                      </a>
                    </div>
                    <div>
                      <button
                        aria-label="Close Menu"
                        title="Close Menu"
                        class="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg class="w-5 text-gray-600" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
