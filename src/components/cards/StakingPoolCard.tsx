import BaseStakingCard from './BaseStakingCard';
import { useStakingPool } from '@/hooks/useStakingPool';
import type {
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
} from '@/types/config';
import type { FC } from 'react';
interface IStakingPoolCardProps {
	poolStakingConfig: SimplePoolStakingConfig | RegenPoolStakingConfig;
}

const StakingPoolCard: FC<IStakingPoolCardProps> = ({ poolStakingConfig }) => {
	const { apr, notStakedAmount, stakedAmount, earned } =
		useStakingPool(poolStakingConfig);
	const stakeInfo = {
		apr: apr,
		notStakedAmount: notStakedAmount,
		earned: earned,
		stakedAmount: stakedAmount,
	};

	return (
		<BaseStakingCard
			stakeInfo={stakeInfo}
			poolStakingConfig={poolStakingConfig}
		/>
	);
};

export default StakingPoolCard;
