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
    const stakerClass = parseHedron(stakeAmount).mul(1e15).div(supply);
    return stakerClass.div(maxPortionOfSupply * 1e15).toNumber() + 1;
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
      icosa allowance: {icosaAllowance?.toString()}
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
            onClick={() => setStakeAmount(formatHedron(balance))}
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
              value={`${commify(
                Math.floor(getMaxAmountPerStake() * 100) / 100
              )} ICSA`}
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
          {allowanceTooLow ? (
            <button
              className="rounded bg-emerald-400 px-4 py-2 font-bold text-black hover:bg-emerald-500"
              onClick={handleApproveHedron}
            >
              Approve HDRN
            </button>
          ) : (
            <button
              className="rounded bg-emerald-400 px-4 py-2 font-bold text-black hover:bg-emerald-500"
              onClick={handleStakeClick}
            >
              Stake
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StakeHedron;
