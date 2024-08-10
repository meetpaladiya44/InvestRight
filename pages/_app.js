import "../styles/globals.css";

import Head from "next/head";
import { NavBar, Footer } from "../Components";
import { InvestRightProvider } from "../Context/InvestRight.js";
import { ConnectKitProvider } from "connectkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const myCustomTheme = {
  blurs: {
    modalOverlay: " blur(10px)",
  },
  colors: {
    accentColor: "#644df6",
    accentColorForeground: "white",
    actionButtonBorder: "rgba(255, 255, 255, 0.04)",
    actionButtonBorderMobile: " rgba(255, 255, 255, 0.08)",
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.08)",
    closeButton: "rgba(224, 232, 255, 0.6)",
    closeButtonBackground: " rgba(255, 255, 255, 0.08)",
    connectButtonBackground: "#644df6",
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "#644df6",
    connectButtonText: "#FFF",
    connectButtonTextError: "#FFF",
    connectionIndicator: "#30E000",
    downloadBottomCardBackground:
      "linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.2) 71.04%), #1A1B1F",
    downloadTopCardBackground:
      "linear-gradient(126deg, rgba(120, 120, 120, 0.2) 9.49%, rgba(0, 0, 0, 0) 71.04%), #1A1B1F",
    error: "#FF494A",
    generalBorder: "rgba(255, 255, 255, 0.08)",
    generalBorderDim: "rgba(255, 255, 255, 0.04)",
    menuItemBackground: "rgba(224, 232, 255, 0.1)",
    modalBackdrop: "rgba(0, 0, 0, 0.5)",
    modalBackground:
      "linear-gradient(94.24deg, rgba(146, 114, 247, 0.07) 2.41%, rgba(159, 83, 255, 0.07) 98.65%)",
    modalBorder: "#00FFFF",
    modalText: "#FFF",
    modalTextDim: "rgba(224, 232, 255, 0.3)",
    modalTextSecondary: "rgba(255, 255, 255, 0.6)",
    profileAction: "rgba(224, 232, 255, 0.1)",
    profileActionHover: "rgba(224, 232, 255, 0.2)",
    profileForeground: "rgba(224, 232, 255, 0.05)",
    selectedOptionBorder: "rgba(224, 232, 255, 0.1)",
    standby: "#FFD641",
  },
  fonts: {
    body: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
  },
  radii: {
    actionButton: "4px",
    connectButton: "4px",
    menuButton: "4px",
    modal: "8px",
    modalMobile: "8px",
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)",
  },
};

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "f8a6524307e28135845a9fe5811fcaa2",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>InvestRight</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={myCustomTheme}>
            <NavBar />
            <Component {...pageProps} />
            <Footer />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
