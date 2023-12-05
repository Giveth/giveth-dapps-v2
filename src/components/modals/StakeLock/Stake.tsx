import React, { FC, useEffect, useMemo, useState } from 'react';
import { P } from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { useAccount, useNetwork } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';
import { Modal } from '../Modal';
import { StakingPoolImages } from '../../StakingPoolImages';
import { approveERC20tokenTransfer, stakeTokens } from '@/lib/stakingPool';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from '../ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import ToggleSwitch from '../../styled-components/Switch';
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
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.APPROVE,
	);
	const { chain } = useNetwork();
	const chainId = chain?.id;
	const { address } = useAccount();
	const { notStakedAmount: maxAmount } = useStakingPool(poolStakingConfig);

	const { title, LM_ADDRESS, POOL_ADDRESS, platform } =
		poolStakingConfig as SimplePoolStakingConfig;

	// useEffect(() => {
	// 	library?.on('block', async () => {
	// 		const amountNumber = ethers.BigNumber.from(amount);
	// 		if (
	// 			amountNumber.gt(ethers.constants.Zero) &&
	// 			stakeState === StakeState.APPROVING
	// 		) {
	// 			const signer = library.getSigner();
	// 			const userAddress = await signer.getAddress();
	// 			const tokenContract = new Contract(
	// 				POOL_ADDRESS,
	// 				ERC20_ABI,
	// 				signer,
	// 			) as ERC20;
	// 			const allowance: BigNumber = await tokenContract.allowance(
	// 				userAddress,
	// 				LM_ADDRESS,
	// 			);
	// 			const amountNumber = ethers.BigNumber.from(amount);
	// 			const allowanceNumber = ethers.BigNumber.from(
	// 				allowance.toString(),
	// 			);
	// 			if (amountNumber.lte(allowanceNumber)) {
	// 				setStakeState(StakeState.STAKE);
	// 			}
	// 		}
	// 	});
	// 	return () => {
	// 		library.removeAllListeners('block');
	// 	};
	// }, [library, amount, stakeState]);

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
		);

		if (isApproved) {
			setStakeState(StakeState.STAKE);
		} else {
			setStakeState(StakeState.APPROVE);
		}
	};

	const onStake = async () => {
		if (!chainId) return;
		setStakeState(StakeState.STAKING);
		try {
			const txResponse = await stakeTokens(
				amount,
				POOL_ADDRESS,
				LM_ADDRESS,
				chainId,
				permit,
			);
			if (txResponse) {
				setTxHash(txResponse);
				setStakeState(StakeState.CONFIRMING);
				const { status } = await waitForTransaction({
					hash: txResponse,
				});
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
						<StakeModalTitle alignItems='center'>
							<StakingPoolImages title={title} />
							<StakeModalTitleText weight={700}>
								Stake
							</StakeModalTitleText>
						</StakeModalTitle>
						<StakeInnerModalContainer>
							<StakeSteps stakeState={stakeState} />
							<StakingAmountInput
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
										checked={permit}
										disabled={
											!(
												stakeState ===
													StakeState.APPROVE ||
												stakeState === StakeState.STAKE
											)
										}
										setStateChange={handlePermit}
									/>
									<P>{permit ? 'Permit' : 'Approve'} mode</P>
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
