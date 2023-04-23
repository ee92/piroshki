import { BigNumber } from "ethers";
import { useEffect } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { hedronABI, hedronAddress } from "../utils/hedron";
import { icosaABI, icosaAddress } from "../utils/icosa";

interface UseStakeStartParams {
  type: "HDRN" | "ICSA";
  amount: BigNumber
  enabled: boolean
}

const stakeTypes = {
  "HDRN": "hdrnStakeStart",
  "ICSA": "icsaStakeStart"
}

export function useApproveHedron({ amount, enabled }: any) {
  const { config } = usePrepareContractWrite({
    address: hedronAddress,
    abi: hedronABI,
    functionName: "approve",
    args: [icosaAddress, amount],
    enabled
  });
  return useContractWrite(config);
}

function useStakeStart({ type, amount, enabled }: UseStakeStartParams) {
  const { config } = usePrepareContractWrite({
    address: icosaAddress,
    abi: icosaABI,
    functionName: stakeTypes[type],
    args: [amount],
    enabled
  });
  return useContractWrite(config);
}

export default useStakeStart;