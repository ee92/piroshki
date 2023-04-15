import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import useHedronData from "../../hooks/useHedron";
import { icosaABI, icosaAddress } from "../../utils/icosa";
import {
  stakeLengthToClassEmoji,
  stakeLengthToMaxPortionOfSupply,
} from "../../utils/staking";
import styles from "./StakeHedron.module.css";

function StakeHedron() {
  const [stakeAmount, setStakeAmount] = useState(0);
  const [stakeLength, setStakeLength] = useState(30);
  const [stakeCount, setStakeCount] = useState(0);
  const { data } = useHedronData();
  const { balance = 0, supply = 0 } = data || {};

  const getMinNumStakes = useCallback(() => {
    if (!stakeAmount || !stakeLength || !supply) {
      return 0;
    }
    const portionOfSupply = stakeAmount / supply;
    const maxPortionOfSupply = stakeLengthToMaxPortionOfSupply.get(stakeLength);
    if (!maxPortionOfSupply) {
      return 0;
    }
    return Math.ceil(portionOfSupply / maxPortionOfSupply);
  }, [stakeAmount, stakeLength, supply]);

  const getMaxAmountPerStake = () => {
    if (!supply) {
      return 0;
    }
    const maxPortionOfSupply = stakeLengthToMaxPortionOfSupply.get(stakeLength);
    if (!maxPortionOfSupply) {
      return 0;
    }
    return supply * maxPortionOfSupply - 1;
  };

  const handleAmountInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.validity.valid && setStakeAmount(Number(e.target.value));
  };

  useEffect(() => {
    setStakeCount(getMinNumStakes());
  }, [getMinNumStakes]);

  const { config } = usePrepareContractWrite({
    address: icosaAddress,
    abi: icosaABI,
    functionName: "hdrnStakeStart",
    args: [Number(stakeAmount) * 1000000000],
    enabled: Number(stakeAmount) > 0 && Number(stakeAmount) <= balance,
  });
  const { isLoading, isSuccess, write } = useContractWrite(config);

  const handleStakeClick = () => {
    if (write) {
      write();
    }
  };

  return (
    <div>
      <div className="pb-4">
        <div>Amount to stake</div>
        <div className="flex">
          <input
            type="text"
            pattern="[0-9]*"
            value={stakeAmount || ""}
            onChange={handleAmountInput}
            className="flex-grow rounded bg-white px-4 py-2 font-bold text-black hover:bg-gray-100"
          />
          <button
            onClick={() => setStakeAmount(balance)}
            className="rounded bg-gray-400 px-4 py-2 font-bold text-black hover:bg-gray-500"
          >
            Max
          </button>
        </div>
      </div>
      <div className="pb-4">
        <div className="flex justify-between gap-4">
          <div className="flex w-full flex-col">
            <div>Length</div>
            <select
              value={stakeLength}
              onChange={(e) => setStakeLength(Number(e.target.value))}
              className="h-full w-full rounded bg-white px-4 py-2 font-bold text-black hover:bg-gray-100"
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={270}>270 days</option>
            </select>
          </div>
          <div className="w-full">
            <div>Max Stake</div>
            <input
              value={getMaxAmountPerStake().toLocaleString()}
              readOnly
              disabled
              className="w-full rounded bg-gray-200 px-4 py-2 font-bold text-black"
            />
          </div>
          <div>
            <div>Rank</div>
            <div className="text-3xl">
              {stakeLengthToClassEmoji.get(stakeLength)}
            </div>
          </div>
        </div>
      </div>
      <div className="pb-4">
        <div>Number of stakes</div>
        <div className="flex">
          <input
            value={stakeCount}
            readOnly
            disabled
            className="flex-grow rounded bg-gray-200 px-4 py-2 font-bold text-black"
          />
          <button
            className="rounded bg-emerald-400 px-4 py-2 font-bold text-black hover:bg-emerald-500"
            onClick={handleStakeClick}
          >
            Stake
          </button>
        </div>
      </div>
    </div>
  );
}

export default StakeHedron;
