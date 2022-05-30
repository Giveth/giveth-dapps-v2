import { brandColors, H5, IconRocketInSpace32 } from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import { StakeInnerModal, StakeModalContainer } from './Stake';
import { StakeState } from '@/lib/staking';
import StakeSteps from './StakeSteps';
import { AmountInput } from '@/components/AmountInput';
import LockSlider from './LockSlider';
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
	const [amount, setAmount] = useState('0');
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
					<SectionTitle weight={700}>Locking tokens</SectionTitle>
					<AmountInput
						setAmount={setAmount}
						maxAmount={maxAmount}
						poolStakingConfig={poolStakingConfig}
						disabled={
							!(
								stakeState === StakeState.APPROVE ||
								stakeState === StakeState.STAKE
							)
						}
					/>
					<SectionTitle weight={700}>Rounds</SectionTitle>
					<LockSlider />
				</StakeInnerModal>
			</StakeModalContainer>
		</Modal>
	);
};

const SectionTitle = styled(H5)`
	text-align: left;
	color: ${brandColors.giv[300]};
	padding-bottom: 8px;
	border-bottom: 1px solid ${brandColors.giv[500]};
	margin: 24px 0 8px;
`;

export default StakeLockModal;
