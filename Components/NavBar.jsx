import React, { useState, useContext } from "react";
import { CryptoPredictionContext } from "../Context/InvestRight.js";
import { Logo, Menu } from "../Components/index";
import styles from "../css/BtnShine.module.css";
import Image from "next/image";
import Hero from "../assets/images/Hero.png";

const NavBar = () => {
  const { currentAccount, connectWallet, disconnectWallet } = useContext(
    CryptoPredictionContext
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-[#FFFFFF]">
      <div className="px-[60px] py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <a
              href="/"
              aria-label="InvestRight"
              title="InvestRight"
              className="inline-flex items-center mr-8"
            >
              <Image src={Hero} alt="My Image" width={53} height={30} />
              <div className="ml-2 text-[26px] font-bold tracking-wide logo">
                InvestRight
              </div>
            </a>
          </div>
          <ul className="items-center hidden space-x-8 lg:flex">
            {!currentAccount ? (
              <li>
                <button
                  onClick={() => connectWallet()}
                  className={`inline-flex items-center justify-center py-2 px-4 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none background ${styles.btnShine}`}
                  aria-label="Connect Wallet"
                  title="Connect Wallet"
                >
                  Connect Wallet
                </button>
              </li>
            ) : (
              <>
                <li>
                  <span
                    className={`inline-flex items-center justify-center py-2 px-4 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none background ${styles.btnShine}`}
                  >
                    {truncateAddress(currentAccount)}
                  </span>
                </li>
                {/* <li>
                  <button
                    onClick={() => disconnectWallet()}
                    className={`inline-flex items-center justify-center py-2 px-4 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-red-500 hover:bg-red-600 focus:shadow-outline focus:outline-none`}
                    aria-label="Disconnect Wallet"
                    title="Disconnect Wallet"
                  >
                    Disconnect
                  </button>
                </li> */}
              </>
            )}
          </ul>

          {/* ... (rest of the component remains the same) ... */}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
