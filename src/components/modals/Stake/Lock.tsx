import { brandColors, H5, IconRocketInSpace32 } from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { FC, useState } from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import {
	ApproveButton,
	CancelButton,
	ConfirmButton,
	loadingAnimationOptions,
	Pending,
	StakeInnerModal,
	StakeModalContainer,
} from './Stake';
import { StakeState } from '@/lib/staking';
import { AmountInput } from '@/components/AmountInput';
import LockSlider from './LockSlider';
import LockInfo from './LockInfo';
import StakingBrief from './StakingBrief';
import type { PoolStakingConfig, RegenStreamConfig } from '@/types/config';

interface ILockModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
	maxAmount: BigNumber;
}
const LockModal: FC<ILockModalProps> = ({
	poolStakingConfig,
	maxAmount,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('120');
	const [round, setRound] = useState(2);
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
					{(stakeState === StakeState.APPROVE ||
						stakeState === StakeState.APPROVING) && (
						<>
							<SectionTitle weight={700}>
								Locking tokens
							</SectionTitle>
							<AmountInput
								setAmount={setAmount}
								maxAmount={maxAmount}
								poolStakingConfig={poolStakingConfig}
								disabled={stakeState === StakeState.APPROVING}
							/>
							<SectionTitle weight={700}>Rounds</SectionTitle>
							<LockSlider setRound={setRound} round={round} />
							<LockInfo />
							{stakeState === StakeState.APPROVE && (
								<ApproveButton
									label={'APPROVE'}
									onClick={() => {
										setStakeState(StakeState.APPROVING);
									}}
									disabled={
										amount == '0' || maxAmount.lt(amount)
									}
								/>
							)}
							{stakeState === StakeState.APPROVING && (
								<Pending>
									<Lottie
										options={loadingAnimationOptions}
										height={40}
										width={40}
									/>
									&nbsp;APPROVE PENDING
								</Pending>
							)}
						</>
					)}
					{(stakeState === StakeState.WRAP ||
						stakeState === StakeState.WRAPPING) && (
						<>
							<StakingBrief round={round} amount={amount} />
							<LockInfo />
							{stakeState === StakeState.WRAP && (
								<ConfirmButton
									label={'STAKE & LOCK'}
									onClick={() => {}}
									disabled={
										amount == '0' || maxAmount.lt(amount)
									}
									buttonType='primary'
								/>
							)}
							{stakeState === StakeState.WRAPPING && (
								<Pending>
									<Lottie
										options={loadingAnimationOptions}
										height={40}
										width={40}
									/>
									&nbsp;STAKE PENDING
								</Pending>
							)}
						</>
					)}
					<CancelButton
						buttonType='texty'
						label='CANCEL'
						onClick={() => {
							setShowModal(false);
						}}
					/>
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

export default LockModal;
