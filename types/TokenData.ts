import { BigNumber } from 'ethers';

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

export type NativeStakeData = {
  stakeStart: number;
  capitalAdded: number;
  stakePoints: BigNumber;
  isActive: boolean;
  payoutPreCapitalAddIcsa: BigNumber;
  payoutPreCapitalAddHdrn: BigNumber;
  stakeAmount: BigNumber;
  minStakeLength: number;
}

export type NativeStakeDisplayData = {
  isActive: boolean;
  stakePoints: number;
  stakeAmount: number;
  minStakeLength: number;
  stakeDaysRemaining: number;
}