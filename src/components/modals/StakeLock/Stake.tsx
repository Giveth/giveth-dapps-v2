import React, { FC, useEffect, useMemo, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { Modal } from '../Modal';
import { StakingPoolImages } from '../../StakingPoolImages';
import {
	approveERC20tokenTransfer,
	permitTokens,
	stakeTokens,
} from '@/lib/stakingPool';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from '../ConfirmSubmit';
import { waitForTransaction } from '@/lib/transaction';
import { StakeState } from '@/lib/staking';
import ToggleSwitch from '@/components/ToggleSwitch';
import { IModal } from '@/types/common';
import {
	CancelButton,
	StakeModalContainer,
	StakeModalTitle,
	StakeModalTitleText,
	StakeInnerModalContainer,
	StyledOutlineButton,
	StyledButton,
	ToggleContainer,
} from './StakeLock.sc';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import {
	PoolStakingConfig,
	RegenStreamConfig,
	SimplePoolStakingConfig,
	StakingPlatform,
} from '@/types/config';
import { useStakingPool } from '@/hooks/useStakingPool';
import { StakingAmountInput } from '@/components/AmountInput/StakingAmountInput';
import { StakeSteps } from './StakeSteps';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';

interface IStakeInnerModalProps {
	poolStakingConfig: PoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
}

interface IStakeModalProps extends IModal, IStakeInnerModalProps {}

export const StakeModal: FC<IStakeModalProps> = ({
	poolStakingConfig,
	regenStreamConfig,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
			<StakeInnerModal
				poolStakingConfig={poolStakingConfig}
				regenStreamConfig={regenStreamConfig}
				setShowModal={setShowModal}
			/>
		</Modal>
	);
};

const StakeInnerModal: FC<IStakeModalProps> = ({
	poolStakingConfig,
	regenStreamConfig,
	setShowModal,
}) => {
	const [amount, setAmount] = useState(0n);
	const [txHash, setTxHash] = useState('');
	const [permit, setPermit] = useState<boolean>(false);
	const [permitSignature, setPermitSignature] = useState<Address>();
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.APPROVE,
	);
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { address } = useAccount();
	const { notStakedAmount: maxAmount } = useStakingPool(poolStakingConfig);
	const isSafeEnv = useIsSafeEnvironment();

	const { title, LM_ADDRESS, POOL_ADDRESS, platform } =
		poolStakingConfig as SimplePoolStakingConfig;

	const onlyApproveMode = useMemo(
		() => platform === StakingPlatform.ICHI,
		[platform],
	);

	useEffect(() => {
		if (!onlyApproveMode) {
			setPermit(true);
			setStakeState(StakeState.STAKE);
		}
	}, [onlyApproveMode]);

	const onApprove = async () => {
		if (amount === 0n || !chainId || !address) return;

		setStakeState(StakeState.APPROVING);

		const isApproved = await approveERC20tokenTransfer(
			amount,
			address,
			LM_ADDRESS,
			POOL_ADDRESS,
			chainId,
			isSafeEnv,
		);

		if (isApproved) {
			setStakeState(StakeState.STAKE);
		} else {
			setStakeState(StakeState.APPROVE);
		}
	};

	const onStake = async () => {
		if (!chainId || !address) return;
		setStakeState(StakeState.STAKING);
		try {
			if (permit) {
				const _permitSignature = await permitTokens(
					chainId,
					address,
					poolStakingConfig.POOL_ADDRESS,
					poolStakingConfig.LM_ADDRESS,
					amount,
				);
				if (!_permitSignature)
					throw new Error('Permit signature failed');
				setPermitSignature(_permitSignature);
			}
			const txResponse = await stakeTokens(
				amount,
				LM_ADDRESS,
				chainId,
				permitSignature,
			);
			if (txResponse) {
				setTxHash(txResponse);
				setStakeState(StakeState.CONFIRMING);
				const { status } = await waitForTransaction(
					txResponse,
					isSafeEnv,
				);
				setStakeState(status ? StakeState.CONFIRMED : StakeState.ERROR);
			} else {
				setStakeState(StakeState.STAKE);
			}
		} catch (err: any) {
			setStakeState(
				err?.code === 4001 ? StakeState.STAKE : StakeState.ERROR,
			);
			captureException(err, {
				tags: {
					section: 'onStake',
				},
			});
		}
	};

	const handlePermit = () => {
		if (permit) {
			setPermit(false);
			setStakeState(StakeState.APPROVE);
		} else {
			setPermit(true);
			setStakeState(StakeState.STAKE);
		}
	};
	return (
		<StakeModalContainer>
			{stakeState !== StakeState.CONFIRMING &&
				stakeState !== StakeState.CONFIRMED &&
				stakeState !== StakeState.ERROR && (
					<>
						<StakeModalTitle $alignItems='center'>
							<StakingPoolImages title={title} />
							<StakeModalTitleText weight={700}>
								Stake
							</StakeModalTitleText>
						</StakeModalTitle>
						<StakeInnerModalContainer>
							<StakeSteps stakeState={stakeState} />
							<StakingAmountInput
								amount={amount}
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
							{!onlyApproveMode && (
								<ToggleContainer>
									<ToggleSwitch
										isOn={permit}
										disabled={
											!(
												stakeState ===
													StakeState.APPROVE ||
												stakeState === StakeState.STAKE
											)
										}
										toggleOnOff={handlePermit}
										label={`${
											permit ? 'Permit' : 'Approve'
										} mode`}
									/>
								</ToggleContainer>
							)}
							{(stakeState === StakeState.APPROVE ||
								stakeState === StakeState.APPROVING) && (
								<StyledOutlineButton
									label={
										stakeState === StakeState.APPROVING
											? 'APPROVE PENDING'
											: 'APPROVE'
									}
									onClick={onApprove}
									loading={
										stakeState === StakeState.APPROVING
									}
									disabled={
										amount == 0n || maxAmount < amount
									}
								/>
							)}
							{(stakeState === StakeState.STAKE ||
								stakeState === StakeState.STAKING) && (
								<StyledButton
									label={
										stakeState === StakeState.STAKE
											? 'STAKE'
											: 'STAKE PENDING'
									}
									onClick={onStake}
									disabled={
										amount === 0n || maxAmount < amount
									}
									buttonType='primary'
									loading={stakeState === StakeState.STAKING}
								/>
							)}
							<CancelButton
								buttonType='texty'
								label='CANCEL'
								onClick={() => {
									setShowModal(false);
								}}
							/>
						</StakeInnerModalContainer>
					</>
				)}
			{chainId && stakeState === StakeState.CONFIRMING && (
				<SubmittedInnerModal
					title={title}
					txHash={txHash}
					rewardTokenAddress={regenStreamConfig?.rewardTokenAddress}
					rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
				/>
			)}
			{chainId && stakeState === StakeState.CONFIRMED && (
				<ConfirmedInnerModal
					title={title}
					txHash={txHash}
					rewardTokenAddress={regenStreamConfig?.rewardTokenAddress}
					rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
				/>
			)}
			{chainId && stakeState === StakeState.ERROR && (
				<ErrorInnerModal
					title='Something went wrong!'
					txHash={txHash}
					rewardTokenAddress={regenStreamConfig?.rewardTokenAddress}
					rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
				/>
			)}
		</StakeModalContainer>
	);
};
