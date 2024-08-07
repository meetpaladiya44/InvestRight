import "../styles/globals.css";

import Head from "next/head";
import { NavBar, Footer } from "../Components";
import { CryptoPredictionProvider } from "../Context/CryptoPredictor.js";
import { WagmiProvider } from "wagmi";
import { config } from "../utils/config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>InvestRight</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CryptoPredictionProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider>
              <NavBar />
              <Component {...pageProps} />
              <Footer />
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </CryptoPredictionProvider>
    </div>
  );
}
