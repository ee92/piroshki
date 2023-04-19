import { BigNumber, BigNumberish, ethers } from "ethers";

const HEX_DECIMALS = 8;
const HEDRON_DECIMALS = 9;
const ICOSA_DECIMALS = 9;

/* 
* format tokens (string) to units (BigNumber)
*/
export function parseHex(amount: string) {
  return ethers.utils.parseUnits(amount || "0", HEX_DECIMALS);
}

export function parseHedron(amount: string) {
  return ethers.utils.parseUnits(amount || "0", HEDRON_DECIMALS);
}

export function parseIcosa(amount: string) {
  return ethers.utils.parseUnits(amount || "0", ICOSA_DECIMALS);
}

/* 
* format units (BigNumber) to tokens (string)
*/
export function formatHex(amount?: BigNumber) {
  if (!amount) {
    return "0";
  }
  return ethers.utils.formatUnits(amount, HEX_DECIMALS);
}

export function formatHedron(amount?: BigNumber) {
  if (!amount) {
    return "0";
  }
  return ethers.utils.formatUnits(amount, HEDRON_DECIMALS);
}

export function formatIcosa(amount?: BigNumber) {
  if (!amount) {
    return "0";
  }
  return ethers.utils.formatUnits(amount, ICOSA_DECIMALS);
}