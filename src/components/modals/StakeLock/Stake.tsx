import React, { FC, useEffect, useMemo, useState } from 'react';
import { P } from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers } from 'ethers';
import { captureException } from '@sentry/nextjs';
import { Modal } from '../Modal';
import { StakingPoolImages } from '../../StakingPoolImages';
import { AmountInput } from '../../AmountInput';
import { approveERC20tokenTransfer, stakeTokens } from '@/lib/stakingPool';
import LoadingAnimation from '../../../animations/loading.json';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from '../ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import ToggleSwitch from '../../styled-components/Switch';
import { abi as ERC20_ABI } from '@/artifacts/ERC20.json';
import { IModal } from '@/types/common';
import StakeSteps from './StakeSteps';
import { ERC20 } from '@/types/contracts';
import {
	Pending,
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
import LottieControl from '@/components/LottieControl';
import { useStakingPool } from '@/hooks/useStakingPool';

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
	const [amount, setAmount] = useState('0');
	const [txHash, setTxHash] = useState('');
	const [permit, setPermit] = useState<boolean>(false);
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.APPROVE,
	);
	const { chainId, library } = useWeb3React();
	const { notStakedAmount: maxAmount } = useStakingPool(poolStakingConfig);

	const { title, LM_ADDRESS, POOL_ADDRESS, platform } =
		poolStakingConfig as SimplePoolStakingConfig;

	useEffect(() => {
		library?.on('block', async () => {
			const amountNumber = ethers.BigNumber.from(amount);
			if (
				amountNumber.gt(ethers.constants.Zero) &&
				stakeState === StakeState.APPROVING
			) {
				const signer = library.getSigner();
				const userAddress = await signer.getAddress();
				const tokenContract = new Contract(
					POOL_ADDRESS,
					ERC20_ABI,
					signer,
				) as ERC20;
				const allowance: BigNumber = await tokenContract.allowance(
					userAddress,
					LM_ADDRESS,
				);
				const amountNumber = ethers.BigNumber.from(amount);
				const allowanceNumber = ethers.BigNumber.from(
					allowance.toString(),
				);
				if (amountNumber.lte(allowanceNumber)) {
					setStakeState(StakeState.STAKE);
				}
			}
		});
		return () => {
			library.removeAllListeners('block');
		};
	}, [library, amount, stakeState]);

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
		if (amount === '0') return;
		if (!library) {
			console.error('library is null');
			return;
		}

		setStakeState(StakeState.APPROVING);

		const signer = library.getSigner();

		const userAddress = await signer.getAddress();

		const isApproved = await approveERC20tokenTransfer(
			amount,
			userAddress,
			LM_ADDRESS,
			POOL_ADDRESS,
			library,
		);

		if (isApproved) {
			setStakeState(StakeState.STAKE);
		} else {
			setStakeState(StakeState.APPROVE);
		}
	};

	const onStake = async () => {
		setStakeState(StakeState.STAKING);
		try {
			const txResponse = await stakeTokens(
				amount,
				POOL_ADDRESS,
				LM_ADDRESS,
				library,
				permit,
			);
			if (txResponse) {
				setTxHash(txResponse.hash);
				setStakeState(StakeState.CONFIRMING);
				const { status } = await txResponse.wait();
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
							{stakeState === StakeState.APPROVE && (
								<StyledOutlineButton
									label={'APPROVE'}
									onClick={onApprove}
									disabled={
										amount == '0' || maxAmount.lt(amount)
									}
								/>
							)}
							{stakeState === StakeState.APPROVING && (
								<Pending>
									<LottieControl
										animationData={LoadingAnimation}
										size={40}
									/>
									&nbsp;APPROVE PENDING
								</Pending>
							)}
							{stakeState === StakeState.STAKE && (
								<StyledButton
									label={'STAKE'}
									onClick={onStake}
									disabled={
										amount == '0' || maxAmount.lt(amount)
									}
									buttonType='primary'
								/>
							)}
							{stakeState === StakeState.STAKING && (
								<Pending>
									<LottieControl
										animationData={LoadingAnimation}
										size={40}
									/>
									&nbsp;STAKE PENDING
								</Pending>
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
