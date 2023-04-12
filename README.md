## Getting Started

Prerequisites:
- create Infura or Alchemy account and get API key
- create .env file in the project root with `ETH_API_PROVIDER_KEY="<your-api-key>"`
- download Metamask
- add local dev network to Metamask
  - Network Name: `Hardhat`
  - RPC URL: `http://127.0.0.1:8545/`
  - Chain ID: `31337`
  - Currency Symbol: `HardhatETH`

Install deps

```bash
npm install
```

Start hardhat node

```bash
npm run hardhat
```

Start next dev server

```bash
npm run dev
```

Fund account (uses Uniswap to buy Hex, Hedron, Icosa tokens with your HardhatETH)

```bash
npm run fund
```