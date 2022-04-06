import React, { FC, useEffect, useState } from 'react';
import { IModal, Modal } from './Modal';
import {
	Button,
	H4,
	neutralColors,
	OulineButton,
} from '@giveth/ui-design-system';
import { Flex } from '../styled-components/Flex';
import styled from 'styled-components';
import { PoolStakingConfig } from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import { BigNumber } from 'ethers';
import { AmountInput } from '../AmountInput';
import {
	approveERC20tokenTransfer,
	stakeTokens,
	wrapToken,
} from '@/lib/stakingPool';
import Lottie from 'react-lottie';
import LoadingAnimation from '../../animations/loading.json';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';
import { useWeb3React } from '@web3-react/core';
import { StakeState } from '@/lib/staking';

interface IStakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
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
	maxAmount,
	showModal,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('0');
	const [txHash, setTxHash] = useState('');
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.UNKNOWN,
	);
	const { chainId, library } = useWeb3React();

	const { title, LM_ADDRESS, POOL_ADDRESS, GARDEN_ADDRESS } =
		poolStakingConfig;

	useEffect(() => {
		if (GARDEN_ADDRESS) {
			setStakeState(StakeState.APPROVE);
		} else {
			setStakeState(StakeState.STAKE);
		}
	}, [GARDEN_ADDRESS]);

	useEffect(() => {
		if (stakeState == StakeState.WRAP) {
			setStakeState(StakeState.APPROVE);
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

		setStakeState(StakeState.APPROVING);

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
			setStakeState(StakeState.WRAP);
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
		}
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
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
							<InnerModal>
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
									onClick={() => {
										setShowModal(false);
									}}
								/>
							</InnerModal>
						</>
					)}
				{chainId && stakeState === StakeState.CONFIRMING && (
					<SubmittedInnerModal
						title={title}
						walletNetwork={chainId}
						txHash={txHash}
					/>
				)}
				{chainId && stakeState === StakeState.CONFIRMED && (
					<ConfirmedInnerModal
						title={title}
						walletNetwork={chainId}
						txHash={txHash}
					/>
				)}
				{chainId && stakeState === StakeState.ERROR && (
					<ErrorInnerModal
						title='Something went wrong!'
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
	padding-bottom: 24px;
`;

const StakeModalTitle = styled(Flex)`
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

const Pending = styled(Flex)`
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
