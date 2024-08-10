import "../styles/globals.css";
import { SessionProvider } from "next-auth/react"
import Head from "next/head";
import { NavBar, Footer } from "../Components";
import { InvestRightProvider } from "../Context/InvestRight.js";
import { WagmiProvider } from "wagmi";
import { config } from "../utils/config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";

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
              <ConnectKitProvider>
                <NavBar />
                <Component {...pageProps} />
                <Footer />
              </ConnectKitProvider>
            </QueryClientProvider>
          </SessionProvider>
        </WagmiProvider>
      </InvestRightProvider>
    </div>
  );
}
