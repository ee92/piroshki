import { BigNumber } from "ethers";

export type HexBalance = BigNumber;
export type HexSupply = BigNumber;
export type HexDecimals = number;

export type HedronBalance = BigNumber;
export type HedronSupply = BigNumber;
export type HedronDecimals = number;

export type IcosaBalance = BigNumber;
export type IcosaSupply = BigNumber;
export type IcosaDecimals = number;
export type IcosaCurrentDay = number;

export type HdrnPayout = BigNumber;
export type IcsaPayout = BigNumber;

export type NativeStakePayload = {
  stakeStart: number;
  capitalAdded: number;
  stakePoints: BigNumber;
  isActive: boolean;
  payoutPreCapitalAddIcsa: BigNumber;
  payoutPreCapitalAddHdrn: BigNumber;
  stakeAmount: BigNumber;
  minStakeLength: number;
};

export type NativeStakeData = {
  isActive: boolean;
  stakePoints: BigNumber;
  stakeAmount: BigNumber;
  minStakeLength: number;
  stakeDaysRemaining: number;
  currentPayoutIcsa: BigNumber;
  currentPayoutHdrn?: BigNumber;
};
