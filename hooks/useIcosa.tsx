import { BigNumber } from "ethers";
import { useAccount, useContractReads } from "wagmi";
import {
  IcosaBalance,
  IcosaCurrentDay,
  IcosaSupply,
  NativeStakePayload,
  NativeStakeData,
} from "../types/TokenData";
import { icosaABI, icosaAddress } from "../utils/icosa";
import { getStakeDaysRemaining } from "../utils/staking";

type IcosaPayload = [
  IcosaBalance,
  IcosaSupply,
  IcosaCurrentDay,
  NativeStakePayload,
  NativeStakePayload
];
type IcosaData = {
  supply: BigNumber;
  balance: BigNumber;
  stakes: {
    hdrn: NativeStakeData;
    icsa: NativeStakeData;
  };
};

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
      const [balance, supply, currentDay, icsaStake, hdrnStake] =
        data as IcosaPayload;
      return {
        balance,
        supply,
        stakes: {
          hdrn: {
            ...hdrnStake,
            stakeDaysRemaining: getStakeDaysRemaining(hdrnStake, currentDay),
          },
          icsa: {
            ...icsaStake,
            stakeDaysRemaining: getStakeDaysRemaining(icsaStake, currentDay),
          },
        },
      };
    },
  });
}

export default useIcosaData;
