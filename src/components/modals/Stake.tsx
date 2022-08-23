import React, { FC, useEffect, useMemo, useState } from 'react';
import {
	brandColors,
	Button,
	H4,
	neutralColors,
	OulineButton,
	P,
	SublineBold,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { BigNumber, Contract, ethers } from 'ethers';
import Lottie from 'react-lottie';
import { useWeb3React } from '@web3-react/core';
import { captureException } from '@sentry/nextjs';
import { Modal } from './Modal';
import { Flex, FlexCenter } from '../styled-components/Flex';
import { StakingPoolImages } from '../StakingPoolImages';
import { AmountInput } from '../AmountInput';
import {
	approveERC20tokenTransfer,
	stakeTokens,
	wrapToken,
} from '@/lib/stakingPool';
import LoadingAnimation from '../../animations/loading.json';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import ToggleSwitch from '../styled-components/Switch';
import { abi as ERC20_ABI } from '@/artifacts/ERC20.json';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { ERC20 } from '@/types/contracts';
import { StakingPlatform } from '@/types/config';
import type {
	RegenStreamConfig,
	SimplePoolStakingConfig,
} from '@/types/config';

interface IStakeModalProps extends IModal {
	poolStakingConfig: SimplePoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
	maxAmount: BigNumber;
}

const loadingAnimationOptions = {
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

	const { title, icon, LM_ADDRESS, POOL_ADDRESS, GARDEN_ADDRESS, platform } =
		poolStakingConfig;

	const onlyApproveMode = useMemo(
		() => !!GARDEN_ADDRESS || platform === StakingPlatform.ICHI,
		[GARDEN_ADDRESS, platform],
	);

	useEffect(() => {
		handlePermit();
	}, [onlyApproveMode]);

	useEffect(() => {
		if (stakeState == StakeState.WRAP) {
			setStakeState(StakeState.APPROVE);
		}
	}, [amount]);

	useEffect(() => {
		if (!library) return;
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
					!GARDEN_ADDRESS ? LM_ADDRESS : GARDEN_ADDRESS!,
				);
				const amountNumber = ethers.BigNumber.from(amount);
				const allowanceNumber = ethers.BigNumber.from(
					allowance.toString(),
				);
				if (amountNumber.lte(allowanceNumber)) {
					if (GARDEN_ADDRESS) {
						setStakeState(StakeState.WRAP);
					} else {
						setStakeState(StakeState.STAKE);
					}
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
			!GARDEN_ADDRESS ? LM_ADDRESS : GARDEN_ADDRESS!,
			POOL_ADDRESS,
			library,
		);

		if (isApproved) {
			if (GARDEN_ADDRESS) {
				setStakeState(StakeState.WRAP);
			} else {
				setStakeState(StakeState.STAKE);
			}
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

	const onWrap = async () => {
		if (!GARDEN_ADDRESS) {
			console.error('GARDEN_ADDRESS is null');
			return;
		}
		setStakeState(StakeState.WRAPPING);
		try {
			const txResponse = await wrapToken(
				amount,
				POOL_ADDRESS,
				GARDEN_ADDRESS,
				library,
			);
			if (txResponse) {
				setTxHash(txResponse.hash);
				setStakeState(StakeState.CONFIRMING);
				if (txResponse) {
					const { status } = await txResponse.wait();
					setStakeState(
						status ? StakeState.CONFIRMED : StakeState.ERROR,
					);
				}
			} else {
				setStakeState(StakeState.WRAP);
			}
		} catch (err: any) {
			setStakeState(
				err?.code === 4001 ? StakeState.WRAP : StakeState.ERROR,
			);
			captureException(err, {
				tags: {
					section: 'onWrap',
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
								<StakingPoolImages title={title} icon={icon} />
								<StakeModalTitleText weight={700}>
									Stake
								</StakeModalTitleText>
							</StakeModalTitle>
							<InnerModal>
								{stakeState === StakeState.APPROVE ||
								stakeState === StakeState.APPROVING ||
								stakeState === StakeState.WRAP ||
								stakeState === StakeState.WRAPPING ? (
									<StakeStepsContainer>
										<StakeStep>
											<StakeStepTitle>
												Approve
											</StakeStepTitle>
											<StakeStepNumber>1</StakeStepNumber>
										</StakeStep>
										<StakeStep>
											<StakeStepTitle
												disable={
													!(
														stakeState ===
															StakeState.WRAP ||
														stakeState ===
															StakeState.WRAPPING
													)
												}
											>
												Stake
											</StakeStepTitle>
											<StakeStepNumber
												disable={
													!(
														stakeState ===
															StakeState.WRAP ||
														stakeState ===
															StakeState.WRAPPING
													)
												}
											>
												2
											</StakeStepNumber>
										</StakeStep>
									</StakeStepsContainer>
								) : (
									<StakeStepsPlaceholder />
								)}
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
													stakeState ===
														StakeState.STAKE
												)
											}
											setStateChange={handlePermit}
										/>
										<P>
											{permit ? 'Permit' : 'Approve'} mode
										</P>
									</ToggleContainer>
								)}
								{stakeState === StakeState.APPROVE && (
									<ApproveButton
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
								{stakeState === StakeState.WRAP && (
									<ConfirmButton
										label={'STAKE'}
										onClick={onWrap}
										disabled={
											amount == '0' ||
											maxAmount.lt(amount)
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
								{stakeState === StakeState.STAKE && (
									<ConfirmButton
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
									onClick={closeModal}
								/>
							</InnerModal>
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

// const StakeSteps = () => {
// 	return (

// 	)
// }

const StakeStepsContainer = styled(Flex)`
	position: relative;
	justify-content: space-evenly;
	&::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 1px;
		border-top: 1px solid ${brandColors.giv[500]};
		bottom: 11px;
		z-index: 0;
	}
	&::after {
		content: '';
		position: absolute;
		height: 1px;
		border-top: 1px dashed ${brandColors.giv[500]};
		left: -24px;
		right: -24px;
		bottom: 11px;
		z-index: 0;
	}
	margin-bottom: 16px;
`;

const StakeStep = styled(FlexCenter)`
	flex-direction: column;
	width: 61px;
	position: relative;
	z-index: 1;
`;

interface IStakeStepState {
	disable?: boolean;
}

const StakeStepTitle = styled(P)<IStakeStepState>`
	margin-bottom: 8px;
	color: ${props =>
		props.disable ? brandColors.giv[300] : brandColors.giv['000']};
`;
const StakeStepNumber = styled(SublineBold)<IStakeStepState>`
	color: ${props =>
		props.disable ? brandColors.giv[300] : brandColors.giv['000']};
	background-color: ${brandColors.giv[500]};
	border: 3px solid
		${props =>
			props.disable ? brandColors.giv[300] : brandColors.giv['000']};
	border-radius: 18px;
	width: 24px;
`;

const StakeModalContainer = styled.div`
	width: 370px;
	padding-bottom: 24px;
`;

const StakeModalTitle = styled(Flex)`
	margin-bottom: 16px;
`;

const StakeModalTitleText = styled(H4)`
	margin-left: 54px;
	color: ${neutralColors.gray[100]};
`;

const StakeStepsPlaceholder = styled.div`
	padding: 13px;
`;

const InnerModal = styled.div`
	padding: 0 24px;
`;

const ApproveButton = styled(OulineButton)`
	width: 100%;
	margin-top: 32px;
	margin-bottom: 8px;
`;

const ConfirmButton = styled(Button)`
	width: 100%;
	margin-top: 32px;
	margin-bottom: 8px;
`;

const Pending = styled(FlexCenter)`
	margin-top: 32px;
	margin-bottom: 8px;
	line-height: 46px;
	height: 46px;
	border: 2px solid ${neutralColors.gray[100]};
	border-radius: 48px;
	color: ${neutralColors.gray[100]};
	gap: 8px;
	& > div {
		margin: 0 !important;
	}
`;

const CancelButton = styled(Button)`
	width: 100%;
`;

const ToggleContainer = styled(FlexCenter)`
	padding: 16px 0 0;
	gap: 10px;
`;
