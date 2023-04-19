import { BigNumber, ethers } from "ethers";
import { useAccount, useContractReads } from "wagmi";
import { HedronBalance, HedronSupply } from "../types/TokenData";
import { hedronABI, hedronAddress } from "../utils/hedron";

type HedronPayload = [HedronBalance, HedronSupply];
type HedronData = {
  supply: BigNumber;
  balance: BigNumber;
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
    ],
    select: (data): HedronData => {
      const [balance, supply] = data as HedronPayload;
      return { balance, supply };
    },
  });
}

export default useHedronData;
