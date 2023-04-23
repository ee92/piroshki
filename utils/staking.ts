import { ethers } from "ethers";
import { HdrnPayout, IcsaPayout, NativeStakePayload } from "../types/TokenData";
import { DECIMAL_RESOLUTION } from "./format";

export const stakeLengthToMaxPortionOfSupply = new Map([
  [360, 1],
  [270, 0.01],
  [180, 0.001],
  [90, 0.0001],
  [30, 0.00001],
]);

export const stakeLengthToClassEmoji = new Map([
  [360, `🐋`],
  [270, `🦈`],
  [180, `🐬`],
  [90, `🦑`],
  [30, `🐢`],
]);

export const getStakeDaysRemaining = (
  stake?: NativeStakePayload,
  currentDay?: number
) => {
  if (!stake || !currentDay) {
    return 0;
  }
  const { capitalAdded, stakeStart, minStakeLength } = stake;
  const lastUpdate = Math.max(stakeStart, capitalAdded);
  const daysSinceLastUpdate = currentDay - lastUpdate;
  const daysLeft = minStakeLength - daysSinceLastUpdate;
  return daysLeft > 0 ? daysLeft : 0;
};

export const getCurrentPayout = (
  stake?: NativeStakePayload,
  startPoolPayout?: HdrnPayout | IcsaPayout,
  currentPoolPayout?: HdrnPayout | IcsaPayout
) => {
  if (!stake || !startPoolPayout || !currentPoolPayout) {
    return ethers.utils.parseUnits("0");
  }
  const payoutPerPoint = currentPoolPayout.sub(startPoolPayout);
  const payoutFromStakePoints = stake.stakePoints.mul(payoutPerPoint).div(DECIMAL_RESOLUTION);
  const payout = stake.payoutPreCapitalAddIcsa.add(payoutFromStakePoints);
  return payout;
}