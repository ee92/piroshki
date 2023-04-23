import { BigNumber } from "ethers";
import { useAccount, useContractReads } from "wagmi";
import { HedronBalance, HedronSupply } from "../types/TokenData";
import { hedronABI, hedronAddress } from "../utils/hedron";
import { icosaAddress } from "../utils/icosa";

type IcosaAllowance = BigNumber;

type HedronPayload = [HedronBalance, HedronSupply, IcosaAllowance];
type HedronData = {
  supply: BigNumber;
  balance: BigNumber;
  icosaAllowance: BigNumber;
};

function useHedronData() {
  const { address } = useAccount();
  return useContractReads({
    enabled: !!address,
    contracts: [
      {
        address: hedronAddress,
        abi: hedronABI,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: hedronAddress,
        abi: hedronABI,
        functionName: "totalSupply",
      },
      {
        address: hedronAddress,
        abi: hedronABI,
        functionName: "allowance",
        args: [address, icosaAddress],
      },
    ],
    select: (data): HedronData => {
      const [balance, supply, icosaAllowance] = data as HedronPayload;
      return { balance, supply, icosaAllowance };
    },
  });
}

export default useHedronData;
