import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { WagmiConfig, createClient, useAccount, mainnet } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { ConnectKitButton, ConnectKitProvider, getDefaultClient } from 'connectkit';

const client = createClient(
  getDefaultClient({
    appName: 'ConnectKit Next.js demo',
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    chains: [hardhat, mainnet]
  }),
);

function App({ Component, pageProps }: AppProps) {
  const { address } = useAccount();
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <section>
          <ConnectKitButton />
        </section>
        <Component {...pageProps} address={address} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;