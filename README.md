<img src="./public/piroshki-logo.png" width="100" />

# Piroshki

## Project

An app for managing [Hex](https://etherscan.io/token/0x2b591e99afe9f32eaa6214f7b7629768c40eeb39#code), [Hedron](https://etherscan.io/token/0x3819f64f282bf135d62168c1e513280daf905e06#code), and [Icosa](https://etherscan.io/address/0xfc4913214444aF5c715cc9F7b52655e788A569ed#code) stakes. 
Extending the functionality of these contracts by adding a layer on top of them. Piroshki lets you create multiple stakes in the base protocols using a single account and lets you manage these stakes, as well as convert them to NFTs to make them transferable.

## Getting Started

Prerequisites:

- node version 16+
- create Infura or Alchemy account and get API key
- create .env file in the project root with `ETH_API_PROVIDER_KEY="<your-api-key>"`
- download Metamask
- add local dev network to Metamask ([guide](https://medium.com/@kaishinaw/connecting-metamask-with-a-local-hardhat-network-7d8cea604dc6))
  - Network Name: `Hardhat`
  - RPC URL: `http://127.0.0.1:8545/`
  - Chain ID: `31337`
  - Currency Symbol: `HardhatETH`

Install deps

```bash
npm install
```

Start Hardhat node (fork of Ethereum mainnet)

```bash
npm run hardhat
```

Fund account (uses Uniswap to buy Hex, Hedron, Icosa tokens with your HardhatETH) - run multiple times to increase token balances

```bash
npm run fund
```

Start Next.js dev server

```bash
npm run dev
```
