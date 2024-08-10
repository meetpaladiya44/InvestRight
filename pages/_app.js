import "../styles/globals.css";
import { SessionProvider } from "next-auth/react"
import Head from "next/head";
import { NavBar, Footer } from "../Components";
import { InvestRightProvider } from "../Context/InvestRight.js";
import { ConnectKitProvider } from "connectkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const myCustomTheme = {
  blurs: {
    modalOverlay: "blur(5px)",
  },
  colors: {
    accentColor: "#644df6",
    accentColorForeground: "white",
    actionButtonBorder: "rgba(255, 255, 255, 0.15)",
    actionButtonBorderMobile: "rgba(255, 255, 255, 0.25)",
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.25)",
    closeButton: "rgba(224, 232, 255, 0.8)",
    closeButtonBackground: "rgba(255, 255, 255, 0.25)",
    connectButtonBackground: "#644df6",
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "#644df6",
    connectButtonText: "#FFF",
    connectButtonTextError: "#FFF",
    connectionIndicator: "#30E000",
    downloadBottomCardBackground:
      "linear-gradient(126deg, rgba(0, 0, 0, 0.3) 9.49%, rgba(120, 120, 120, 0.4) 71.04%), #1A1B1F",
    downloadTopCardBackground:
      "linear-gradient(126deg, rgba(120, 120, 120, 0.4) 9.49%, rgba(0, 0, 0, 0.3) 71.04%), #1A1B1F",
    error: "#FF494A",
    generalBorder: "rgba(255, 255, 255, 0.25)",
    generalBorderDim: "rgba(255, 255, 255, 0.15)",
    menuItemBackground: "rgba(224, 232, 255, 0.3)",
    modalBackdrop: "rgba(0, 0, 0, 0.7)",
    modalBackground: "rgba(100, 77, 246, 0.2)",
    modalBorder: "#644df6",
    modalText: "#FFF",
    modalTextDim: "rgba(224, 232, 255, 0.5)",
    modalTextSecondary: "rgba(255, 255, 255, 0.8)",
    profileAction: "rgba(224, 232, 255, 0.3)",
    profileActionHover: "rgba(224, 232, 255, 0.4)",
    profileForeground: "rgba(100, 77, 246, 0.2)",
    selectedOptionBorder: "rgba(224, 232, 255, 0.3)",
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
    connectButton: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.5)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.2)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.4)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.4)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.3)",
  },
};

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "f8a6524307e28135845a9fe5811fcaa2",
  chains: [sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <div>
      <Head>
        <title>InvestRight</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <InvestRightProvider>
        <WagmiProvider config={config}>
          <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider theme={myCustomTheme}>
                <ConnectKitProvider>
                  <NavBar />
                  <Component {...pageProps} />
                  <Footer />
                </ConnectKitProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </SessionProvider>
        </WagmiProvider>
      </InvestRightProvider>
    </div>
  );
}
