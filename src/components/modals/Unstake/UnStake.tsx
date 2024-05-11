import { FC, useState } from 'react';
import {
	neutralColors,
	Button,
	H4,
	IconUnlock16,
	B,
	P,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useAccount } from 'wagmi';
import { Modal } from '../Modal';
import { StakingPoolImages } from '../../StakingPoolImages';
import { unwrapToken, withdrawTokens } from '@/lib/stakingPool';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from '../ConfirmSubmit';
import { waitForTransaction } from '@/lib/transaction';
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
import { useStakingPool } from '@/hooks/useStakingPool';
import { useTokenDistroHelper } from '@/hooks/useTokenDistroHelper';
import { StakingAmountInput } from '@/components/AmountInput/StakingAmountInput';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';

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
	const isSafeEnv = useIsSafeEnvironment();
	const [txHash, setTxHash] = useState('');
	const [amount, setAmount] = useState(0n);
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
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { title, type, LM_ADDRESS } =
		poolStakingConfig as SimplePoolStakingConfig;

	const isGIVpower =
		type === StakingType.GIV_GARDEN_LM ||
		type === StakingType.GIV_UNIPOOL_LM;

	const maxAmount = isGIVpower
		? stakedAmount - BigInt(userGIVLocked.balance)
		: stakedAmount;

	const onWithdraw = async () => {
		if (!chainId) return;
		setUnstakeState(StakeState.UNSTAKING);

		const GARDEN_ADDRESS = poolStakingConfig.GARDEN_ADDRESS;

		const tx = GARDEN_ADDRESS
			? await unwrapToken(amount, GARDEN_ADDRESS, chainId)
			: await withdrawTokens(amount, LM_ADDRESS, chainId);

		if (!tx) {
			setUnstakeState(StakeState.UNSTAKE);
			return;
		}
		setTxHash(tx);
		setUnstakeState(StakeState.SUBMITTING);
		const { status } = await waitForTransaction(tx, isSafeEnv);
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
						<UnStakeModalTitle $alignItems='center'>
							<StakingPoolImages title={title} />
							<UnStakeModalTitleText weight={700}>
								Unstake
							</UnStakeModalTitleText>
						</UnStakeModalTitle>

						<InnerModal>
							<StakingAmountInput
								amount={amount}
								setAmount={setAmount}
								maxAmount={maxAmount}
								poolStakingConfig={poolStakingConfig}
							/>
							{isGIVpower && (
								<>
									<LockInfoContainer
										$flexDirection='column'
										gap='8px'
									>
										<Flex $justifyContent='space-between'>
											<Flex
												gap='4px'
												$alignItems='center'
											>
												<IconUnlock16 />
												<P>Available to unstake</P>
											</Flex>
											<B>
												{formatWeiHelper(
													maxAmount.toString(),
												)}
											</B>
										</Flex>
										<TotalStakedRow $justifyContent='space-between'>
											<P>Total staked</P>
											<B>
												{formatWeiHelper(
													stakedAmount.toString(),
												)}
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
									amount == 0n ||
									maxAmount < amount ||
									unStakeState === StakeState.UNSTAKING
								}
								loading={unStakeState === StakeState.UNSTAKING}
							/>
							{isGIVpower ? (
								<CancelButton
									buttonType='texty'
									size='small'
									label='locked giv details'
									disabled={stakedAmount - maxAmount === 0n}
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
