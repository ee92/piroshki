import { BigNumber } from "ethers";
import { useAccount, useContractReads } from "wagmi";
import { HexBalance, HexSupply } from "../types/TokenData";
import { hexABI, hexAddress } from "../utils/hex";

type hexPayload = [HexBalance, HexSupply];
type hexData = {
  supply: BigNumber;
  balance: BigNumber;
};

function usehexData() {
  const { address } = useAccount();
  return useContractReads({
    enabled: !!address,
    contracts: [
      {
        address: hexAddress,
        abi: hexABI,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: hexAddress,
        abi: hexABI,
        functionName: "totalSupply",
      },
    ],
    select: (data): hexData => {
      const [balance, supply] = data as hexPayload;
      return { balance, supply };
    },
  });
}

export default usehexData;
