import { BigNumber } from 'ethers';

export function formatTokenCount(amount: BigNumber | null, decimals: number): number {
  if (!amount) {
    return 0;
  }
  return amount.div(Math.pow(10, decimals)).toNumber();
}
