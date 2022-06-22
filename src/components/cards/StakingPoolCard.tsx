import BaseStakingCard from './BaseStakingCard';
import { useStakingPool } from '@/hooks/useStakingPool';
import type { FC } from 'react';
import type { PoolStakingConfig, RegenPoolStakingConfig } from '@/types/config';
interface IStakingPoolCardProps {
	network: number;
	poolStakingConfig: PoolStakingConfig | RegenPoolStakingConfig;
}

const StakingPoolCard: FC<IStakingPoolCardProps> = ({
	network,
	poolStakingConfig,
}) => {
	const { apr, notStakedAmount, stakedAmount, earned } = useStakingPool(
		poolStakingConfig,
		network,
	);
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
