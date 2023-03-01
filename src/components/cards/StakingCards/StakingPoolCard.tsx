import BaseStakingCard from './BaseStakingCard/BaseStakingCard';
import type {
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
} from '@/types/config';
import type { FC } from 'react';
interface IStakingPoolCardProps {
	poolStakingConfig: SimplePoolStakingConfig | RegenPoolStakingConfig;
}

const StakingPoolCard: FC<IStakingPoolCardProps> = ({ poolStakingConfig }) => {
	return <BaseStakingCard poolStakingConfig={poolStakingConfig} />;
};

export default StakingPoolCard;
