import { brandColors, H5, IconRocketInSpace32 } from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import { StakeInnerModal, StakeModalContainer } from './Stake';
import { StakeState } from '@/lib/staking';
import StakeSteps from './StakeSteps';
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
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.APPROVE,
	);
	return (
		<Modal
			setShowModal={setShowModal}
			headerTitlePosition={'left'}
			headerTitle={'Stake for GIVpower'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<StakeModalContainer>
				<StakeInnerModal>
					<StakeSteps stakeState={stakeState} />
					<LockTitle weight={700}>Locking tokens</LockTitle>
				</StakeInnerModal>
			</StakeModalContainer>
		</Modal>
	);
};

const LockTitle = styled(H5)`
	text-align: left;
	color: ${brandColors.giv[300]};
	padding-bottom: 8px;
	border-bottom: 1px solid ${brandColors.giv[500]};
`;

export default StakeLockModal;
