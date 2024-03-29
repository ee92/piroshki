import App from "../components/App";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/piroshki-logo.png" />
        <title>Piroshki - Stake HEX, HDRN and ICSA</title>
      </Head>
      <App />
    </>
  );
}
