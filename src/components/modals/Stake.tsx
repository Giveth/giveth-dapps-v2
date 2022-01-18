import React, { FC, useState, useContext, useEffect } from 'react';
import { Modal, IModal } from './Modal';
import {
	neutralColors,
	Button,
	OulineButton,
	H4,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
import { PoolStakingConfig } from '../../types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import { BigNumber } from 'ethers';
import { AmountInput } from '../AmountInput';
import {
	approveERC20tokenTransfer,
	stakeTokens,
	wrapToken,
} from '../../lib/stakingPool';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import { SubmittedInnerModal, ConfirmedInnerModal } from './ConfirmSubmit';
import { useWeb3React } from '@web3-react/core';

interface IStakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	maxAmount: BigNumber;
}

enum StakeStates {
	UNKNOWN = 'UNKNOWN',
	APPROVE = 'APPROVE',
	APPROVING = 'APPROVING',
	WRAP = 'WRAP',
	WRAPPING = 'WRAPPING',
	STAKE = 'STAKE',
	STAKING = 'STAKING',
	SUBMITTED = 'SUBMITTED',
	CONFIRMED = 'CONFIRMED',
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
	maxAmount,
	showModal,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('0');
	const [txHash, setTxHash] = useState('');
	const [stakeState, setStakeState] = useState(StakeStates.UNKNOWN);
	const { chainId, library } = useWeb3React();

	const { title, LM_ADDRESS, POOL_ADDRESS, GARDEN_ADDRESS } =
		poolStakingConfig;

	useEffect(() => {
		if (GARDEN_ADDRESS) {
			setStakeState(StakeStates.APPROVE);
		} else {
			setStakeState(StakeStates.STAKE);
		}
	}, [GARDEN_ADDRESS]);

	useEffect(() => {
		if (stakeState == StakeStates.WRAP) {
			setStakeState(StakeStates.APPROVE);
		}
	}, [amount]);

	const onApprove = async () => {
		if (amount === '0') return;
		if (!library) {
			console.error('library is null');
			return;
		}
		if (!GARDEN_ADDRESS) {
			console.error('GARDEN_ADDRESS is null');
			return;
		}

		setStakeState(StakeStates.APPROVING);

		const signer = library.getSigner();

		const userAddress = await signer.getAddress();

		const isApproved = await approveERC20tokenTransfer(
			amount,
			userAddress,
			GARDEN_ADDRESS,
			POOL_ADDRESS,
			library,
		);

		if (isApproved) {
			setStakeState(StakeStates.WRAP);
		} else {
			setStakeState(StakeStates.APPROVE);
		}
	};

	const onStake = () => {
		setStakeState(StakeStates.STAKING);
		stakeTokens(amount, POOL_ADDRESS, LM_ADDRESS, library)
			.then(txResponse => {
				if (txResponse) {
					setTxHash(txResponse.hash);
					setStakeState(StakeStates.SUBMITTED);
					txResponse.wait().then(data => {
						setStakeState(StakeStates.CONFIRMED);
					});
				} else {
					setStakeState(StakeStates.STAKE);
				}
			})
			.catch(err => {
				setStakeState(StakeStates.STAKE);
			});
	};

	const onWrap = () => {
		if (!GARDEN_ADDRESS) {
			console.error('GARDEN_ADDRESS is null');
			return;
		}
		setStakeState(StakeStates.WRAPPING);
		wrapToken(amount, POOL_ADDRESS, GARDEN_ADDRESS, library)
			.then(txResponse => {
				if (txResponse) {
					setTxHash(txResponse.hash);
					setStakeState(StakeStates.SUBMITTED);
					if (txResponse) {
						txResponse.wait().then(data => {
							setStakeState(StakeStates.CONFIRMED);
						});
					}
				} else {
					setStakeState(StakeStates.WRAP);
				}
			})
			.catch(err => {
				setStakeState(StakeStates.WRAP);
			});
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<StakeModalContainer>
				{stakeState !== StakeStates.SUBMITTED &&
					stakeState !== StakeStates.CONFIRMED && (
						<>
							<StakeModalTitle alignItems='center'>
								<StakingPoolImages title={title} />
								<StakeModalTitleText weight={700}>
									Stake
								</StakeModalTitleText>
							</StakeModalTitle>
							<InnerModal>
								<AmountInput
									setAmount={setAmount}
									maxAmount={maxAmount}
									poolStakingConfig={poolStakingConfig}
									disabled={
										!(
											stakeState ===
												StakeStates.APPROVE ||
											stakeState === StakeStates.STAKE
										)
									}
								/>
								{stakeState === StakeStates.APPROVE && (
									<ApproveButton
										label={'APPROVE'}
										onClick={onApprove}
										disabled={
											amount == '0' ||
											maxAmount.lt(amount)
										}
									/>
								)}
								{stakeState === StakeStates.APPROVING && (
									<Pending>
										<Lottie
											options={loadingAnimationOptions}
											height={40}
											width={40}
										/>
										&nbsp;APPROVE PENDING
									</Pending>
								)}
								{stakeState === StakeStates.WRAP && (
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
								{stakeState === StakeStates.WRAPPING && (
									<Pending>
										<Lottie
											options={loadingAnimationOptions}
											height={40}
											width={40}
										/>
										&nbsp;STAKE PENDING
									</Pending>
								)}
								{stakeState === StakeStates.STAKE && (
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
								{stakeState === StakeStates.STAKING && (
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
							</InnerModal>
						</>
					)}
				{chainId && stakeState === StakeStates.SUBMITTED && (
					<SubmittedInnerModal
						title={title}
						walletNetwork={chainId}
						txHash={txHash}
					/>
				)}
				{chainId && stakeState === StakeStates.CONFIRMED && (
					<ConfirmedInnerModal
						title={title}
						walletNetwork={chainId}
						txHash={txHash}
					/>
				)}
			</StakeModalContainer>
		</Modal>
	);
};

const StakeModalContainer = styled.div`
	width: 370px;
	padding: 24px 0;
`;

const StakeModalTitle = styled(Row)`
	margin-bottom: 42px;
`;

const StakeModalTitleText = styled(H4)`
	margin-left: 54px;
	color: ${neutralColors.gray[100]};
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

const Pending = styled(Row)`
	margin-top: 32px;
	margin-bottom: 8px;
	line-height: 46px;
	height: 46px;
	border: 2px solid ${neutralColors.gray[100]};
	border-radius: 48px;
	color: ${neutralColors.gray[100]};
	gap: 8px;
	justify-content: center;
	align-items: center;
	& > div {
		margin: 0 !important;
	}
`;

const CancelButton = styled(Button)`
	width: 100%;
`;
