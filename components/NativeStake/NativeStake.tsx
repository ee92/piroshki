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

const text = "text-lg text-slate-500 w-56"
const number = "text-xl font-semibold text-slate-700"

function NativeStake(props: NativeStakeProps) {
  const { stake, type } = props;
  const format = formatters[type];
  return (
    <Card>
      <h3 className="font-bold text-2xl pb-4">Native <span className="border-b-2 pb-1 border-b-slate-700">{type}</span> Stake</h3>
      {stake && stake.isActive ? (
        <>
        <div className="flex items-center justify-between py-4">
            <p className={text}><span className={number}>{format(stake.stakeAmount)}</span> {type} staked</p>
            <p className={text}><span className={number}>{stake.minStakeLength}</span> day stake</p>
            <p className={text}><span className={number}>{stake.stakeDaysRemaining}</span> days remaining</p>
        </div>
        <div className="flex items-center justify-between">
            {stake.currentPayoutHdrn && (
              <p className={text}><span className={number}>{formatHedron(stake.currentPayoutHdrn)}</span> HDRN earned</p>
            )}
            <p className={text}><span className={number}>{formatIcosa(stake.currentPayoutIcsa)}</span> ICSA earned</p>
            <p className={text}><span className={number}>{stake.stakePoints.toLocaleString()}</span> Points</p>
        </div>
        </>
      ) : (
        <p className="text-lg text-slate-500">You currently don't have a native <span className="font-bold text-slate-700">{type}</span> stake</p>
      )}
    </Card>
  );
}

export default NativeStake;
