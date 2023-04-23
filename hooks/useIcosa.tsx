import { BigNumber } from "ethers";
import { useAccount, useContractReads } from "wagmi";
import {
  IcosaBalance,
  IcosaCurrentDay,
  IcosaSupply,
  NativeStakePayload,
  NativeStakeData,
  HdrnPayout,
  IcsaPayout,
} from "../types/TokenData";
import { icosaABI, icosaAddress } from "../utils/icosa";
import { getCurrentPayout, getStakeDaysRemaining } from "../utils/staking";

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
  currentDay: number;
  stakes: {
    hdrn: NativeStakeData;
    icsa: NativeStakeData;
  };
};
type PayoutData = [
  IcsaPayout,
  IcsaPayout,
  IcsaPayout,
  IcsaPayout,
  HdrnPayout,
  HdrnPayout
];

function useIcosaData(): IcosaData {
  const { address } = useAccount();
  const { data: stakeData = [] } = useContractReads({
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
  });

  const [balance, supply, currentDay, icsaStake, hdrnStake] =
    stakeData as IcosaPayload;

  const { data: payoutData = [] } = useContractReads({
    enabled: !!address && stakeData.length !== 0,
    contracts: [
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "hdrnPoolPayout",
        args: [currentDay],
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "hdrnPoolPayout",
        args: [hdrnStake?.capitalAdded],
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "icsaPoolPayoutHdrn",
        args: [currentDay],
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "icsaPoolPayoutHdrn",
        args: [icsaStake?.capitalAdded],
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "icsaPoolPayoutIcsa",
        args: [currentDay],
      },
      {
        address: icosaAddress,
        abi: icosaABI,
        functionName: "icsaPoolPayoutIcsa",
        args: [icsaStake?.capitalAdded],
      },
    ],
  });

  const [
    hdrnPayoutCurrent,
    hdrnPayoutStart,
    icsaPayoutHdrnCurrent,
    icsaPayoutHdrnStart,
    icsaPayoutIcsaCurrent,
    icsaPayoutIcsaStart,
  ] = payoutData as PayoutData;

  return {
    balance,
    supply,
    currentDay,
    stakes: {
      hdrn: {
        ...hdrnStake,
        stakeDaysRemaining: getStakeDaysRemaining(hdrnStake, currentDay),
        currentPayoutIcsa: getCurrentPayout(
          hdrnStake,
          hdrnPayoutStart,
          hdrnPayoutCurrent
        ),
      },
      icsa: {
        ...icsaStake,
        stakeDaysRemaining: getStakeDaysRemaining(icsaStake, currentDay),
        currentPayoutIcsa: getCurrentPayout(
          icsaStake,
          icsaPayoutIcsaStart,
          icsaPayoutIcsaCurrent
        ),
        currentPayoutHdrn: getCurrentPayout(
          icsaStake,
          icsaPayoutHdrnStart,
          icsaPayoutHdrnCurrent
        ),
      },
    },
  };
}

export default useIcosaData;
