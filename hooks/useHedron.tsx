import { ethers } from 'ethers';
import { useAccount, useContractReads } from 'wagmi'
import { HedronBalance, HedronDecimals, HedronSupply, NativeStakeData } from '../types/TokenData';
import { hedronABI, hedronAddress } from '../utils/hedron';

type HedronPayload = [HedronBalance, HedronDecimals, HedronSupply];
type HedronData = {
  supply: number;
  balance: number;
}

function useHedronData() {
  const { address } = useAccount();
  return useContractReads({
    enabled: !!address,
    contracts: [
      {
        address: hedronAddress,
        abi: hedronABI,
        functionName: 'balanceOf',
        args: [address]
      },
      {
        address: hedronAddress,
        abi: hedronABI,
        functionName: 'decimals',
      },
      {
        address: hedronAddress,
        abi: hedronABI,
        functionName: 'totalSupply',
      }
    ],
    select: (data): HedronData => {
      const [balance, decimals, supply] = data as HedronPayload;
      return {
        balance: Number(ethers.utils.formatUnits(balance, decimals)),
        supply: Number(ethers.utils.formatUnits(supply, decimals))
      };
    }
  });
}

export default useHedronData;