import "../styles/globals.css";
import type { AppProps } from "next/app";

import { WagmiConfig, createClient, useAccount, mainnet } from "wagmi";
import { hardhat } from "wagmi/chains";
import {
  ConnectKitButton,
  ConnectKitProvider,
  getDefaultClient,
} from "connectkit";
import Image from "next/image";

const client = createClient(
  getDefaultClient({
    appName: "ConnectKit Next.js demo",
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    chains: [hardhat, mainnet],
  })
);

function App({ Component, pageProps }: AppProps) {
  const { address } = useAccount();
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <header className="flex justify-between p-4">
          <div className="flex items-center gap-4">
            <Image src="/piroshki-logo.png" alt="logo" className="w-8" width={48} height={48}/>
            <div className="text-2xl">Piroshki</div>
          </div>
          <ConnectKitButton />
        </header>
        <Component {...pageProps} address={address} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
