import React, { FC, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import Lottie from 'react-lottie';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers } from 'ethers';
import { captureException } from '@sentry/nextjs';
import { ButtonLink } from '@giveth/ui-design-system';
import { Modal } from '../Modal';
import { AmountInput } from '../../AmountInput';
import { approveERC20tokenTransfer, wrapToken } from '@/lib/stakingPool';
import LoadingAnimation from '../../../animations/loading.json';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from '../ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import { abi as ERC20_ABI } from '@/artifacts/ERC20.json';
import { IModal } from '@/types/common';
import StakeSteps from './StakeSteps';
import { ERC20 } from '@/types/contracts';
import {
	Pending,
	CancelButton,
	StakeModalContainer,
	StakeInnerModal,
	ApproveButton,
	ConfirmButton,
	SectionTitle,
} from './StakeLock.sc';
import type { PoolStakingConfig } from '@/types/config';

interface IStakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
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

export const StakeGIVModal: FC<IStakeModalProps> = ({
	poolStakingConfig,
	maxAmount,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('0');
	const [txHash, setTxHash] = useState('');
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.APPROVE,
	);
	const { chainId, library } = useWeb3React();

	const { title, POOL_ADDRESS, GARDEN_ADDRESS } = poolStakingConfig;

	useEffect(() => {
		if (stakeState == StakeState.WRAP) {
			setStakeState(StakeState.APPROVE);
		}
	}, [amount]);

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
					GARDEN_ADDRESS!,
				);
				const amountNumber = ethers.BigNumber.from(amount);
				const allowanceNumber = ethers.BigNumber.from(
					allowance.toString(),
				);
				if (amountNumber.lte(allowanceNumber)) {
					setStakeState(StakeState.WRAP);
				}
			}
		});
		return () => {
			library.removeAllListeners('block');
		};
	}, [library, amount, stakeState]);

	const onApprove = async () => {
		if (!GARDEN_ADDRESS) {
			console.error('GARDEN_ADDRESS is null');
			return;
		}
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

	const onWrap = async () => {
		if (!GARDEN_ADDRESS) {
			console.error('GARDEN_ADDRESS is null');
			return;
		}
		setStakeState(StakeState.WRAPPING);
		try {
			const txResponse = await wrapToken(amount, GARDEN_ADDRESS, library);
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

	return (
		<Modal
			setShowModal={setShowModal}
			headerTitle='Stake for GIVpower'
			headerTitlePosition='left'
		>
			<StakeModalContainer>
				{stakeState !== StakeState.CONFIRMING &&
					stakeState !== StakeState.CONFIRMED &&
					stakeState !== StakeState.ERROR && (
						<>
							<StakeInnerModal>
								<StakeSteps stakeState={stakeState} />
								{(stakeState === StakeState.APPROVE ||
									stakeState === StakeState.APPROVING) && (
									<>
										<SectionTitle>
											Amount to stake
										</SectionTitle>
										<AmountInput
											setAmount={setAmount}
											maxAmount={maxAmount}
											poolStakingConfig={
												poolStakingConfig
											}
											disabled={
												stakeState ===
												StakeState.APPROVING
											}
										/>
										<ApproveButton
											label={'APPROVE'}
											onClick={onApprove}
											disabled={
												amount == '0' ||
												maxAmount.lt(amount) ||
												stakeState ===
													StakeState.APPROVING
											}
											loading={
												stakeState ===
												StakeState.APPROVING
											}
										/>
										<ButtonLink
											label='get more giv'
											linkType='texty'
										/>
									</>
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
									<>
										<Pending>
											<Lottie
												options={
													loadingAnimationOptions
												}
												height={40}
												width={40}
											/>
											&nbsp;STAKE PENDING
										</Pending>
										<CancelButton
											buttonType='texty'
											label='CANCEL'
											onClick={() => {
												setShowModal(false);
											}}
										/>
									</>
								)}
							</StakeInnerModal>
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
