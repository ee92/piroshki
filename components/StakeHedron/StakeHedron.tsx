import { BigNumber } from "ethers";
import { commify } from "ethers/lib/utils.js";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import useHedronData from "../../hooks/useHedron";
import useStakeStart, { useApproveHedron } from "../../hooks/useStakeStart";
import { formatHedron, parseHedron } from "../../utils/format";
import { icosaABI, icosaAddress } from "../../utils/icosa";
import {
  stakeLengthToClassEmoji,
  stakeLengthToMaxPortionOfSupply,
} from "../../utils/staking";

function StakeHedron() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeLength, setStakeLength] = useState(30);
  const [stakeCount, setStakeCount] = useState(0);
  const { data } = useHedronData();
  const { balance, supply, icosaAllowance } = data || {};

  const allowanceTooLow = parseHedron(stakeAmount).gt(icosaAllowance || 0);

  const stakeHedronEnabled =
    balance &&
    !allowanceTooLow &&
    parseHedron(stakeAmount).lte(balance) &&
    parseHedron(stakeAmount).gt(0);

  const getMinNumStakes = useCallback(() => {
    if (!stakeAmount || !stakeLength || !supply) {
      return 0;
    }
    const maxPortionOfSupply = stakeLengthToMaxPortionOfSupply.get(stakeLength);
    if (!maxPortionOfSupply) {
      return 0;
    }

    const totalAmountToStake = parseHedron(stakeAmount);
    const maxTokensPerStake = supply
      .mul(BigNumber.from((maxPortionOfSupply * 1e18).toFixed(0)))
      .div(BigNumber.from((1e18).toString()));
    const numberOfStakes = totalAmountToStake
      .div(maxTokensPerStake)
      .add(
        totalAmountToStake.mod(maxTokensPerStake).isZero()
          ? BigNumber.from(0)
          : BigNumber.from(1)
      );

    return numberOfStakes.toNumber();
  }, [stakeAmount, stakeLength, supply]);

  const getMaxAmountPerStake = (): number => {
    if (!supply) {
      return 0;
    }
    const maxPortionOfSupply = stakeLengthToMaxPortionOfSupply.get(stakeLength);
    if (!maxPortionOfSupply) {
      return 0;
    }
    return Number(formatHedron(supply)) * maxPortionOfSupply;
  };

  const handleAmountInput = (e: ChangeEvent<HTMLInputElement>) => {
    const cleanedInput = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    setStakeAmount(cleanedInput);
  };

  useEffect(() => {
    setStakeCount(getMinNumStakes());
  }, [getMinNumStakes]);

  const {
    // isLoading: stakeIcosaLoading,
    // isSuccess: stakeIcosaSuccess,
    write: stakeHedron,
  } = useStakeStart({
    type: "HDRN",
    amount: parseHedron(stakeAmount),
    enabled: !!stakeHedronEnabled,
  });

  const { write: approveHedron } = useApproveHedron({
    amount: parseHedron(stakeAmount),
    enabled: !!allowanceTooLow,
  });

  const handleStakeClick = () => {
    if (stakeHedron) {
      stakeHedron();
    }
  };

  const handleApproveHedron = () => {
    if (approveHedron) {
      approveHedron();
    }
  };

  return (
    <div>
      <p className="text-lg">Icosa allowance: <span className="font-semibold">{icosaAllowance?.toString()}</span></p>
      <div className="py-2">
        <p className="py-2 font-medium text-slate-600">Staking amount:</p>
        <div className="flex">
          <input
            type="text"
            pattern="[0-9]*"
            value={stakeAmount || ""}
            onChange={handleAmountInput}
            className="flex-grow rounded bg-white px-4 py-2 border border-slate-400 font-bold text-black hover:bg-zinc-100 mr-4"
          />
          <button
            onClick={() => setStakeAmount(formatHedron(balance))}
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
          className="h-full w-full rounded bg-white px-4 py-2 border border-slate-400 font-bold text-black hover:bg-zinc-100"
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
            value={`${commify(
              Math.floor(getMaxAmountPerStake() * 100) / 100
            )} ICSA`}
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
        {allowanceTooLow ? (
          <button
            className="rounded px-4 py-2 font-medium text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 hover:from-purple-500 hover:to-pink-600"
            onClick={handleApproveHedron}
          >
            Approve HDRN
          </button>
        ) : (
          <button
            className="rounded px-4 py-2 font-medium text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 hover:from-purple-500 hover:to-pink-600"
            onClick={handleStakeClick}
          >
            Stake
          </button>
        )}
      </div>
    </div>
  );
}

export default StakeHedron;
