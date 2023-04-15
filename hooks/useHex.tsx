import { ethers } from "ethers";
import { useAccount, useContractReads } from "wagmi";
import { HexBalance, HexDecimals, HexSupply } from "../types/TokenData";
import { hexABI, hexAddress } from "../utils/hex";

type hexPayload = [HexBalance, HexDecimals, HexSupply];
type hexData = {
  supply: number;
  balance: number;
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
        functionName: "decimals",
      },
      {
        address: hexAddress,
        abi: hexABI,
        functionName: "totalSupply",
      },
    ],
    select: (data): hexData => {
      const [balance, decimals, supply] = data as hexPayload;
      return {
        balance: Number(ethers.utils.formatUnits(balance, decimals)),
        supply: Number(ethers.utils.formatUnits(supply, decimals)),
      };
    },
  });
}

export default usehexData;
