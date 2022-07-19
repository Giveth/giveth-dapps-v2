import React, { FC, useEffect, useState } from 'react';
import { P } from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import Lottie from 'react-lottie';
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
	StakeInnerModal,
	StyledOutlineButton,
	StyledButton,
	ToggleContainer,
} from './StakeLock.sc';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import type { PoolStakingConfig, RegenStreamConfig } from '@/types/config';

interface IStakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
	maxAmount: BigNumber;
}

export const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

export const StakeModal: FC<IStakeModalProps> = ({
	poolStakingConfig,
	regenStreamConfig,
	maxAmount,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('0');
	const [txHash, setTxHash] = useState('');
	const [permit, setPermit] = useState<boolean>(false);
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.APPROVE,
	);
	const { chainId, library } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const { title, LM_ADDRESS, POOL_ADDRESS } = poolStakingConfig;

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
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
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
							<StakeInnerModal>
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
								{stakeState === StakeState.APPROVE && (
									<StyledOutlineButton
										label={'APPROVE'}
										onClick={onApprove}
										disabled={
											amount == '0' ||
											maxAmount.lt(amount)
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
								{stakeState === StakeState.STAKE && (
									<StyledButton
										label={'STAKE'}
										onClick={onStake}
										disabled={
											amount == '0' ||
											maxAmount.lt(amount)
										}
										buttonType='primary'
									/>
								)}
								{stakeState === StakeState.STAKING && (
									<Pending>
										<Lottie
											options={loadingAnimationOptions}
											height={40}
											width={40}
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
							</StakeInnerModal>
						</>
					)}
				{chainId && stakeState === StakeState.CONFIRMING && (
					<SubmittedInnerModal
						title={title}
						walletNetwork={chainId}
						txHash={txHash}
						rewardTokenAddress={
							regenStreamConfig?.rewardTokenAddress
						}
						rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
					/>
				)}
				{chainId && stakeState === StakeState.CONFIRMED && (
					<ConfirmedInnerModal
						title={title}
						walletNetwork={chainId}
						txHash={txHash}
						rewardTokenAddress={
							regenStreamConfig?.rewardTokenAddress
						}
						rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
					/>
				)}
				{chainId && stakeState === StakeState.ERROR && (
					<ErrorInnerModal
						title='Something went wrong!'
						walletNetwork={chainId}
						txHash={txHash}
						rewardTokenAddress={
							regenStreamConfig?.rewardTokenAddress
						}
						rewardTokenSymbol={regenStreamConfig?.rewardTokenSymbol}
					/>
				)}
			</StakeModalContainer>
		</Modal>
	);
};
