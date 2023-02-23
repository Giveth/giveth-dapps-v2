import BaseStakingCard from './BaseStakingCard/BaseStakingCard';
import type {
	RegenFarmConfig,
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
} from '@/types/config';
import type { FC } from 'react';
interface IStakingPoolCardProps {
	poolStakingConfig: SimplePoolStakingConfig | RegenPoolStakingConfig;
	regenStreamConfig?: RegenFarmConfig;
}

const StakingPoolCard: FC<IStakingPoolCardProps> = ({
	poolStakingConfig,
	regenStreamConfig,
}) => {
	return (
		<BaseStakingCard
			poolStakingConfig={poolStakingConfig}
			regenStreamConfig={regenStreamConfig}
		/>
	);
};

export default StakingPoolCard;
