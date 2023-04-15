import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useIcosaData from "../../hooks/useIcosa";
import {
  stakeLengthToClassEmoji,
  stakeLengthToMaxPortionOfSupply,
} from "../../utils/staking";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { icosaABI, icosaAddress } from "../../utils/icosa";

function StakeIcosa() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeLength, setStakeLength] = useState(30);
  const [stakeCount, setStakeCount] = useState(0);
  const { data } = useIcosaData();
  const { balance = 0, supply = 0 } = data || {};

  const getMinNumStakes = useCallback(() => {
    if (!stakeAmount || !stakeLength || !supply) {
      return 0;
    }
    const portionOfSupply = Number(stakeAmount) / supply;
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
    return supply * maxPortionOfSupply;
  };

  useEffect(() => {
    setStakeCount(getMinNumStakes());
  }, [getMinNumStakes]);

  const { config } = usePrepareContractWrite({
    address: icosaAddress,
    abi: icosaABI,
    functionName: "icsaStakeStart",
    args: [Number(stakeAmount) * 1000000000],
    enabled: Number(stakeAmount) > 0 && Number(stakeAmount) <= balance,
  });
  const { isLoading, isSuccess, write } = useContractWrite(config);

  const handleAmountInput = (e: ChangeEvent<HTMLInputElement>) => {
    const cleanedInput = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    setStakeAmount(cleanedInput);
  };

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
            value={stakeAmount || ""}
            onChange={handleAmountInput}
            className="flex-grow rounded bg-white px-4 py-2 font-bold text-black hover:bg-gray-100"
          />
          <button
            onClick={() => setStakeAmount(balance.toString())}
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
              value={`${Math.floor(getMaxAmountPerStake() * 100) / 100} ICSA`}
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
            disabled={isLoading}
          >
            Stake
          </button>
        </div>
      </div>
    </div>
  );
}

export default StakeIcosa;
