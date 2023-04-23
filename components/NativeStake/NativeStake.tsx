import { NativeStakeData } from "../../types/TokenData";
import { formatHedron, formatIcosa } from "../../utils/format";
import Card from "../Card";
import styles from "../StakeIcosa.module.css";

interface NativeStakeProps {
  stake?: NativeStakeData;
  type: "HDRN" | "ICSA";
}

const formatters = {
  ICSA: formatIcosa,
  HDRN: formatHedron,
};

function NativeStake(props: NativeStakeProps) {
  const { stake, type } = props;
  const format = formatters[type];
  return (
    <Card>
      <div>Native {type} Stake</div>
      {stake && stake.isActive ? (
        <div>
          <div>{stake.minStakeLength} day stake</div>
          <div>
            {format(stake.stakeAmount)} {type} staked
          </div>
          <div>{stake.stakeDaysRemaining} days remaining</div>
          <div>{stake.stakePoints.toLocaleString()} Points</div>
          <div>{format(stake.currentPayout)} earned</div>
        </div>
      ) : (
        <div>You currently don't have a native {type} stake</div>
      )}
    </Card>
  );
}

export default NativeStake;
