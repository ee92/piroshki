import { ethers } from "ethers";
import { useAccount, useContractReads } from "wagmi";
import {
  IcosaBalance,
  IcosaCurrentDay,
  IcosaDecimals,
  IcosaSupply,
  NativeStakeData,
  NativeStakeDisplayData,
} from "../types/TokenData";
import { icosaABI, icosaAddress } from "../utils/icosa";
import { getStakeDaysRemaining } from "../utils/staking";

type IcosaPayload = [
  IcosaBalance,
  IcosaDecimals,
  IcosaSupply,
  IcosaCurrentDay,
  NativeStakeData,
  NativeStakeData
];
type IcosaData = {
  supply: number;
  balance: number;
  stakes: {
    hdrn: NativeStakeDisplayData;
    icsa: NativeStakeDisplayData;
  };
};

const TRILLION_DECIMALS = 12;

function useIcosaData() {
  const { address } = useAccount();
  return useContractReads({
    enabled: !!address,
    contracts: [
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "decimals",
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "totalSupply",
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "currentDay",
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "icsaStakes",
        args: [address],
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "hdrnStakes",
        args: [address],
      },
    ],
    select: (data): IcosaData => {
      const [balance, decimals, supply, currentDay, icsaStake, hdrnStake] =
        data as IcosaPayload;
      return {
        balance: Number(ethers.utils.formatUnits(balance, decimals)),
        supply: Number(ethers.utils.formatUnits(supply, decimals)),
        stakes: {
          hdrn: {
            isActive: hdrnStake.isActive,
            minStakeLength: hdrnStake.minStakeLength,
            stakeAmount: Number(
              ethers.utils.formatUnits(hdrnStake.stakeAmount, decimals)
            ),
            stakeDaysRemaining: getStakeDaysRemaining(hdrnStake, currentDay),
            stakePoints: Number(
              ethers.utils.formatUnits(hdrnStake.stakePoints, TRILLION_DECIMALS)
            ),
          },
          icsa: {
            isActive: icsaStake.isActive,
            minStakeLength: icsaStake.minStakeLength,
            stakeAmount: Number(
              ethers.utils.formatUnits(icsaStake.stakeAmount, decimals)
            ),
            stakeDaysRemaining: getStakeDaysRemaining(icsaStake, currentDay),
            stakePoints: Number(
              ethers.utils.formatUnits(icsaStake.stakePoints, TRILLION_DECIMALS)
            ),
          },
        },
      };
    },
  });
}

export default useIcosaData;
