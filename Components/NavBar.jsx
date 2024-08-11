import React, { useState, useContext } from "react";
import { CryptoPredictionContext } from "../Context/InvestRight.js";
import { Logo, Menu } from "../Components/index";
import styles from "../css/BtnShine.module.css";
import Image from "next/image";
import Hero from "../assets/images/InvestRight.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NavBar = () => {
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
              <Image src={Hero} alt="My Image" style={{ width: "25px" }} />
              <div className="ml-2 text-[26px] font-bold tracking-wide logo" style={{animation: "typing 4s steps(40, end) 4s infinite", overflow:"hidden", whiteSpace:"nowrap"}}>
                InvestRight
              </div>
            </a>
          </div>
          <ul className="items-center hidden space-x-8 lg:flex">
            <ConnectButton />
          </ul>

          {/* ... (rest of the component remains the same) ... */}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
