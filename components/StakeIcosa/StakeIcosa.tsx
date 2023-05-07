import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useIcosaData from "../../hooks/useIcosa";
import { formatIcosa, parseIcosa } from "../../utils/format";
import {
  stakeLengthToClassEmoji,
  stakeLengthToMaxPortionOfSupply,
} from "../../utils/staking";
import useStakeStart from "../../hooks/useStakeStart";

function StakeIcosa() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeLength, setStakeLength] = useState(30);
  const [stakeCount, setStakeCount] = useState(0);
  const { balance, supply } = useIcosaData();

  const getMinNumStakes = useCallback(() => {
    if (!stakeAmount || !stakeLength || !supply) {
      return 0;
    }
    const maxPortionOfSupply = stakeLengthToMaxPortionOfSupply.get(stakeLength);
    if (!maxPortionOfSupply) {
      return 0;
    }
    const stakerClass = parseIcosa(stakeAmount).mul(1e15).div(supply);
    return stakerClass.div(maxPortionOfSupply * 1e15).toNumber() + 1;
  }, [stakeAmount, stakeLength, supply]);

  const getMaxAmountPerStake = () => {
    if (!supply) {
      return 0;
    }
    const maxPortionOfSupply = stakeLengthToMaxPortionOfSupply.get(stakeLength);
    if (!maxPortionOfSupply) {
      return 0;
    }
    return Number(formatIcosa(supply)) * maxPortionOfSupply;
  };

  useEffect(() => {
    setStakeCount(getMinNumStakes());
  }, [getMinNumStakes]);

  const writeHookEnabled =
    balance &&
    parseIcosa(stakeAmount).lte(balance) &&
    parseIcosa(stakeAmount).gt(0);

  const {
    // isLoading: stakeIcosaLoading,
    // isSuccess: stakeIcosaSuccess,
    write: stakeIcosa,
  } = useStakeStart({
    type: "ICSA",
    amount: parseIcosa(stakeAmount),
    enabled: !!writeHookEnabled,
  });

  const handleStakeClick = () => {
    if (stakeIcosa) {
      stakeIcosa();
    }
  };

  const handleAmountInput = (e: ChangeEvent<HTMLInputElement>) => {
    const cleanedInput = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    setStakeAmount(cleanedInput);
  };

  return (
    <div>
      <div className="py-2">
        <p className="py-2 font-medium text-slate-600">Staking amount</p>
        <div className="flex">
          <input
            value={stakeAmount || ""}
            onChange={handleAmountInput}
            className="flex-grow rounded bg-white px-4 py-2 border border-slate-400 font-bold text-black hover:bg-zinc-100 mr-4"
          />
          <button
            onClick={() => setStakeAmount(formatIcosa(balance))}
            className="rounded bg-purple-700 px-4 py-2 font-semibold text-white hover:bg-purple-800"
          >
            Max
          </button>
        </div>
      </div>
      <div className="py-2">
        <p className="py-2 font-medium text-slate-600">Staking Length</p>
          <select
            value={stakeLength}
            onChange={(e) => setStakeLength(Number(e.target.value))}
            className="h-full w-full rounded bg-white p-2 border border-slate-400 font-bold text-black hover:bg-zinc-100"
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={270}>270 days</option>
          </select>
      </div>
      <div className="py-2 flex justify-between items-center">
        <div className="w-full">
          <p className="py-2 font-medium text-slate-600">Max Stake</p>
          <input
            value={`${Math.floor(getMaxAmountPerStake() * 100) / 100} ICSA`}
            readOnly
            disabled
            className="w-full rounded bg-gray-200 px-4 py-2 font-bold text-black"
          />
        </div>
        <div className="ml-6">
          <p className="py-2 font-medium text-slate-600">Rank</p>
          <div className="text-3xl">
            {stakeLengthToClassEmoji.get(stakeLength)}
        </div>
      </div>
      </div>
      <div className="py-2">
        <p className="py-2 font-medium text-slate-600">Number of stakes</p>
        <div className="flex">
          <input
            value={stakeCount}
            readOnly
            disabled
            className="flex-grow rounded bg-gray-200 px-4 py-2 font-bold text-black"
          />
        </div>
      </div>
      <div className="flex justify-end border-t border-slate-400 pt-4 mt-8">
        <button
          className="rounded px-4 py-2 font-medium text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 hover:from-purple-500 hover:to-pink-600"
          onClick={handleStakeClick}
        >
          Stake
        </button>
      </div>
    </div>
  );
}

export default StakeIcosa;
