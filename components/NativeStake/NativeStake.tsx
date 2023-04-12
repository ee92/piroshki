import { NativeStakeDisplayData } from '../../types/TokenData';
import Card from '../Card';
import styles from '../StakeIcosa.module.css'

interface NativeStakeProps {
  stake?: NativeStakeDisplayData;
  type: "HDRN" | "ICSA";
}

function NativeStake(props: NativeStakeProps) {
  const { stake, type } = props;
  return (
    <Card>
      <div>Native {type} Stake</div>
      {stake && stake.isActive ? (
        <div>
          <div>
            {stake.minStakeLength} day stake
          </div>
          <div>
            {stake.stakeAmount.toLocaleString()} {type} staked
          </div>
          <div>
            {stake.stakeDaysRemaining} days remaining
          </div>
          <div>
            {stake.stakePoints} T-Points
          </div>
        </div>
      ) : (
        <div>You currently don't have a native {type} stake</div>
      )}
    </Card>
  )
}

export default NativeStake;