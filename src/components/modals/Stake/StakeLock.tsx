import { IconRocketInSpace32 } from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import { StakeModalContainer } from './Stake';
import type { FC } from 'react';
import type { PoolStakingConfig, RegenStreamConfig } from '@/types/config';

interface IStakeLockModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
	maxAmount: BigNumber;
}
const StakeLockModal: FC<IStakeLockModalProps> = ({
	poolStakingConfig,
	regenStreamConfig,
	maxAmount,
	setShowModal,
}) => {
	return (
		<Modal
			setShowModal={setShowModal}
			headerTitlePosition={'left'}
			headerTitle={'Stake for GIVpower'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<StakeModalContainer></StakeModalContainer>
		</Modal>
	);
};

export default StakeLockModal;
