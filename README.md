<img src="./public/piroshki-logo.png" width="100" />

# Piroshki 

## Getting Started

Prerequisites:
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
