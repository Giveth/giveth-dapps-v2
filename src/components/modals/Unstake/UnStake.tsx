import { FC, useState } from 'react';
import {
	neutralColors,
	Button,
	H4,
	IconUnlock16,
	B,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { Modal } from '../Modal';
import { Flex } from '../../styled-components/Flex';
import { StakingPoolImages } from '../../StakingPoolImages';
import { AmountInput } from '../../AmountInput';
import { unwrapToken, withdrawTokens } from '@/lib/stakingPool';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from '../ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import { IModal } from '@/types/common';
import {
	PoolStakingConfig,
	RegenStreamConfig,
	SimplePoolStakingConfig,
	StakingType,
} from '@/types/config';
import { formatWeiHelper } from '@/helpers/number';
import { LockupDetailsModal } from '../LockupDetailsModal';
import { mediaQueries } from '@/lib/constants/constants';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import { useStakingPool } from '@/hooks/useStakingPool';
import { useTokenDistroHelper } from '@/hooks/useTokenDistroHelper';

interface IUnStakeInnerModalProps {
	poolStakingConfig: PoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
}

interface IUnStakeModalProps extends IModal, IUnStakeInnerModalProps {}

export const UnStakeModal: FC<IUnStakeModalProps> = ({
	poolStakingConfig,
	regenStreamConfig,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
			<UnStakeInnerModal
				poolStakingConfig={poolStakingConfig}
				regenStreamConfig={regenStreamConfig}
				setShowModal={setShowModal}
			/>
		</Modal>
	);
};

const UnStakeInnerModal: FC<IUnStakeModalProps> = ({
	poolStakingConfig,
	regenStreamConfig,
	setShowModal,
}) => {
	const [txHash, setTxHash] = useState('');
	const [amount, setAmount] = useState('0');
	const [showLockDetailModal, setShowLockDetailModal] = useState(false);
	const [unStakeState, setUnstakeState] = useState<StakeState>(
		StakeState.UNSTAKE,
	);
	const { sdh } = useTokenDistroHelper(
		poolStakingConfig.network,
		regenStreamConfig,
	);
	const userGIVLocked = sdh.getUserGIVLockedBalance();
	const { stakedAmount } = useStakingPool(poolStakingConfig);
	const { library, chainId } = useWeb3React();
	const { title, type, LM_ADDRESS, GARDEN_ADDRESS } =
		poolStakingConfig as SimplePoolStakingConfig;

	const isGIVStaking = type === StakingType.GIV_LM;
	const isGIVpower = isGIVStaking && chainId === config.XDAI_NETWORK_NUMBER;
	const maxAmount = isGIVpower
		? stakedAmount.sub(userGIVLocked.balance)
		: stakedAmount;

	const onWithdraw = async () => {
		setUnstakeState(StakeState.UNSTAKING);

		const tx = GARDEN_ADDRESS
			? await unwrapToken(amount, GARDEN_ADDRESS, library)
			: await withdrawTokens(amount, LM_ADDRESS, library);

		if (!tx) {
			setUnstakeState(StakeState.UNSTAKE);
			return;
		}
		setTxHash(tx.hash);
		setUnstakeState(StakeState.SUBMITTING);
		const { status } = await tx.wait();
		if (status) {
			setUnstakeState(StakeState.CONFIRMED);
		} else {
			setUnstakeState(StakeState.ERROR);
		}
	};
	return (
		<>
			<UnStakeModalContainer>
				{(unStakeState === StakeState.UNSTAKE ||
					unStakeState === StakeState.UNSTAKING) && (
					<>
						<UnStakeModalTitle alignItems='center'>
							<StakingPoolImages title={title} />
							<UnStakeModalTitleText weight={700}>
								Unstake
							</UnStakeModalTitleText>
						</UnStakeModalTitle>

						<InnerModal>
							<AmountInput
								setAmount={setAmount}
								maxAmount={maxAmount}
								poolStakingConfig={poolStakingConfig}
							/>
							{isGIVpower && (
								<>
									<LockInfoContainer
										flexDirection='column'
										gap='8px'
									>
										<Flex justifyContent='space-between'>
											<Flex gap='4px' alignItems='center'>
												<IconUnlock16 />
												<P>Available to unstake</P>
											</Flex>
											<B>{formatWeiHelper(maxAmount)}</B>
										</Flex>
										<TotalStakedRow justifyContent='space-between'>
											<P>Total staked</P>
											<B>
												{formatWeiHelper(stakedAmount)}
											</B>
										</TotalStakedRow>
									</LockInfoContainer>
								</>
							)}
							<UnStakeButton
								label={
									unStakeState === StakeState.UNSTAKE
										? 'unstake'
										: 'unstake pending'
								}
								onClick={onWithdraw}
								buttonType='primary'
								disabled={
									amount == '0' ||
									maxAmount.lt(amount) ||
									unStakeState === StakeState.UNSTAKING
								}
								loading={unStakeState === StakeState.UNSTAKING}
							/>
							{isGIVpower ? (
								<CancelButton
									buttonType='texty'
									size='small'
									label='locked giv details'
									disabled={stakedAmount
										.sub(maxAmount)
										.isZero()}
									onClick={() => {
										setShowLockDetailModal(true);
									}}
								/>
							) : (
								<CancelButton
									buttonType='texty'
									size='small'
									label='CANCEL'
									onClick={() => {
										setShowModal(false);
									}}
								/>
							)}
						</InnerModal>
					</>
				)}
				{chainId && unStakeState === StakeState.REJECT && (
					<ErrorInnerModal
						title='You rejected the transaction.'
						txHash={txHash}
					/>
				)}
				{chainId && unStakeState === StakeState.SUBMITTING && (
					<SubmittedInnerModal
						title={title}
						txHash={txHash}
						rewardTokenAddress={
							regenStreamConfig?.rewardTokenAddress
						}
						rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
					/>
				)}
				{chainId && unStakeState === StakeState.CONFIRMED && (
					<ConfirmedInnerModal
						title={title}
						txHash={txHash}
						rewardTokenAddress={
							regenStreamConfig?.rewardTokenAddress
						}
						rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
					/>
				)}
				{chainId && unStakeState === StakeState.ERROR && (
					<ErrorInnerModal
						title='Something went wrong!'
						txHash={txHash}
						rewardTokenAddress={
							regenStreamConfig?.rewardTokenAddress
						}
						rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
					/>
				)}
			</UnStakeModalContainer>
			{showLockDetailModal && (
				<LockupDetailsModal
					setShowModal={setShowLockDetailModal}
					unstakeable={maxAmount}
				/>
			)}
		</>
	);
};

const UnStakeModalContainer = styled.div`
	padding-bottom: 24px;
	width: 100%;
	${mediaQueries.tablet} {
		width: 370px;
	}
`;

const UnStakeModalTitle = styled(Flex)`
	margin-bottom: 42px;
`;

const UnStakeModalTitleText = styled(H4)`
	margin-left: 54px;
	color: ${neutralColors.gray[100]};
`;

const InnerModal = styled.div`
	padding: 0 24px;
`;

const UnStakeButton = styled(Button)`
	width: 100%;
	margin-top: 32px;
	margin-bottom: 8px;
`;

const CancelButton = styled(Button)`
	width: 100%;
`;

const LockInfoContainer = styled(Flex)`
	margin-top: 24px;
`;

const TotalStakedRow = styled(Flex)`
	opacity: 0.6;
`;
