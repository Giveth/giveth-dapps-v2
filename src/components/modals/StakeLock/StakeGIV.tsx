import React, { FC, useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { ButtonLink, H5, IconExternalLink } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useAccount, useChainId } from 'wagmi';
import { waitForTransaction } from '@wagmi/core';
import { Modal } from '../Modal';
import { AmountInput } from '../../AmountInput';
import {
	approveERC20tokenTransfer,
	stakeGIV,
	wrapToken,
} from '@/lib/stakingPool';
import { ErrorInnerModal } from '../ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import { IModal } from '@/types/common';
import StakeSteps from './StakeSteps';
import {
	CancelButton,
	StakeModalContainer,
	StakeInnerModalContainer,
	StyledOutlineButton,
	SectionTitle,
	StyledButton,
} from './StakeLock.sc';
import { BriefContainer, H5White } from './LockingBrief';
import { formatWeiHelper } from '@/helpers/number';
import LockInfo from './LockInfo';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import { useStakingPool } from '@/hooks/useStakingPool';
import type {
	GIVpowerGIVgardenStakingConfig,
	PoolStakingConfig,
	SimplePoolStakingConfig,
} from '@/types/config';
import '@rainbow-me/rainbowkit/styles.css';

interface IStakeInnerModalProps {
	poolStakingConfig: PoolStakingConfig;
	showLockModal: () => void;
}

interface IStakeModalProps extends IModal, IStakeInnerModalProps {}

export const StakeGIVModal: FC<IStakeModalProps> = ({
	poolStakingConfig,
	showLockModal,
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Stake for GIVpower'
			headerTitlePosition='left'
		>
			<StakeGIVInnerModal
				poolStakingConfig={poolStakingConfig}
				showLockModal={showLockModal}
				setShowModal={setShowModal}
			/>
		</Modal>
	);
};

const StakeGIVInnerModal: FC<IStakeModalProps> = ({
	poolStakingConfig,
	showLockModal,
	setShowModal,
}) => {
	const { formatMessage } = useIntl();
	const [amount, setAmount] = useState(0n);
	const [txHash, setTxHash] = useState('');
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.APPROVE,
	);
	const { address } = useAccount();
	const chainId = useChainId();
	const { notStakedAmount: _maxAmount } = useStakingPool(poolStakingConfig);
	const maxAmount = _maxAmount.toBigInt() || 0n;

	const { POOL_ADDRESS, LM_ADDRESS } =
		poolStakingConfig as SimplePoolStakingConfig;

	useEffect(() => {
		if (stakeState == StakeState.WRAP) {
			setStakeState(StakeState.APPROVE);
		}
	}, [amount]);

	// useEffect(() => {
	// 	library?.on('block', async () => {
	// 		try {
	// 			const amountNumber = ethers.BigNumber.from(amount);
	// 			if (
	// 				amountNumber.gt(ethers.constants.Zero) &&
	// 				stakeState === StakeState.APPROVING
	// 			) {
	// 				const tokenContract = new Contract(
	// 					POOL_ADDRESS,
	// 					ERC20_ABI,
	// 					library,
	// 				) as ERC20;
	// 				const allowance: BigNumber = await tokenContract.allowance(
	// 					account!,
	// 					(poolStakingConfig as GIVpowerGIVgardenStakingConfig)
	// 						.GARDEN_ADDRESS!,
	// 				);
	// 				const amountNumber = ethers.BigNumber.from(amount);
	// 				const allowanceNumber = ethers.BigNumber.from(
	// 					allowance.toString(),
	// 				);
	// 				if (amountNumber.lte(allowanceNumber)) {
	// 					setStakeState(StakeState.WRAP);
	// 				}
	// 			}
	// 		} catch (error) {
	// 			console.log('Error on Checking allowance', error);
	// 		}
	// 	});
	// 	return () => {
	// 		library.removeAllListeners('block');
	// 	};
	// }, [library, amount, stakeState, POOL_ADDRESS, account, poolStakingConfig]);

	const onApprove = async () => {
		console.log('here');

		if (amount === 0n) return;
		setStakeState(StakeState.APPROVING);

		const isApproved = await approveERC20tokenTransfer(
			amount,
			address!,
			poolStakingConfig.network === config.GNOSIS_NETWORK_NUMBER
				? (poolStakingConfig as GIVpowerGIVgardenStakingConfig)
						.GARDEN_ADDRESS
				: LM_ADDRESS!,
			POOL_ADDRESS,
			chainId!,
		);

		if (isApproved) {
			setStakeState(StakeState.WRAP);
		} else {
			setStakeState(StakeState.APPROVE);
		}
	};

	const onWrap = async () => {
		setStakeState(StakeState.WRAPPING);
		try {
			const txResponse = await wrapToken(
				amount,
				(poolStakingConfig as GIVpowerGIVgardenStakingConfig)
					.GARDEN_ADDRESS,
				chainId!,
			);
			if (txResponse) {
				setTxHash(txResponse);
				const data = await waitForTransaction({
					hash: txResponse,
				});
				setStakeState(
					data.status === 'success'
						? StakeState.CONFIRMED
						: StakeState.ERROR,
				);
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

	const onStake = async () => {
		setStakeState(StakeState.WRAPPING);
		try {
			const txResponse = await stakeGIV(
				amount,
				poolStakingConfig.LM_ADDRESS,
				chainId,
			);
			if (txResponse) {
				setTxHash(txResponse);
				const data = await waitForTransaction({
					hash: txResponse,
				});
				setStakeState(
					data.status === 'success'
						? StakeState.CONFIRMED
						: StakeState.ERROR,
				);
			} else {
				setStakeState(StakeState.WRAP);
			}
		} catch (err: any) {
			setStakeState(
				err?.code === 4001 ? StakeState.WRAP : StakeState.ERROR,
			);
			captureException(err, {
				tags: {
					section: 'onStake',
				},
			});
		}
	};

	return (
		<StakeModalContainer>
			{stakeState !== StakeState.CONFIRMED &&
				stakeState !== StakeState.ERROR && (
					<>
						<StakeInnerModalContainer>
							<StakeSteps stakeState={stakeState} />
							{(stakeState === StakeState.APPROVE ||
								stakeState === StakeState.APPROVING) && (
								<>
									<SectionTitle>
										{formatMessage({
											id: 'label.amount_to_stake',
										})}
									</SectionTitle>
									<AmountInput
										setAmount={setAmount}
										maxAmount={maxAmount}
										poolStakingConfig={poolStakingConfig}
										disabled={
											stakeState === StakeState.APPROVING
										}
									/>
									<StyledOutlineButton
										label={formatMessage({
											id:
												stakeState ===
												StakeState.APPROVE
													? 'label.approve'
													: 'label.approve_pending',
										})}
										onClick={onApprove}
										disabled={
											amount === 0n ||
											maxAmount <= amount ||
											stakeState === StakeState.APPROVING
										}
										loading={
											stakeState === StakeState.APPROVING
										}
									/>
									<ButtonLink
										isExternal
										label={formatMessage({
											id: 'label.get_more_giv',
										})}
										linkType='texty'
										size='small'
										href={poolStakingConfig.BUY_LINK}
										target='_blank'
										icon={<IconExternalLink size={16} />}
									/>
								</>
							)}

							{(stakeState === StakeState.WRAP ||
								stakeState === StakeState.WRAPPING) && (
								<>
									<BriefContainer>
										<H5>
											{formatMessage({
												id: 'label.you_are_staking',
											})}
										</H5>
										<H5White weight={700}>
											{formatWeiHelper(amount.toString())}{' '}
											GIV
										</H5White>
									</BriefContainer>
									<StyledOutlineButton
										label={formatMessage({
											id:
												stakeState === StakeState.WRAP
													? 'label.stake'
													: 'label.stake_pending',
										})}
										onClick={
											poolStakingConfig.network ===
											config.GNOSIS_NETWORK_NUMBER
												? onWrap
												: onStake
										}
										disabled={
											amount === 0n ||
											maxAmount <= amount ||
											stakeState === StakeState.WRAPPING
										}
										loading={
											stakeState === StakeState.WRAPPING
										}
									/>
									<CancelButton
										buttonType='texty'
										size='small'
										label={formatMessage({
											id: 'label.cancel',
										})}
										onClick={() => {
											setShowModal(false);
										}}
									/>
								</>
							)}
						</StakeInnerModalContainer>
					</>
				)}
			{chainId && stakeState === StakeState.CONFIRMED && (
				<StakeInnerModalContainer>
					<BriefContainer>
						<H5>Successful!</H5>
						<H5White>You have staked</H5White>
						<H5White weight={700}>
							{formatWeiHelper(amount.toString())} GIV
						</H5White>
						<ButtonLink
							isExternal
							label={`View on ${config.NETWORKS_CONFIG[chainId].blockExplorerName}`}
							linkType='texty'
							size='small'
							icon={<IconExternalLink size={16} />}
							href={`${config.NETWORKS_CONFIG[chainId].blockExplorerUrls}tx/${txHash}`}
							target='_blank'
						/>
					</BriefContainer>
					<LockInfo amount={amount} round={0} />
					<StyledButton
						buttonType='primary'
						label='Increase your multiplier'
						size='small'
						onClick={() => {
							setShowModal(false);
							showLockModal();
						}}
					/>
				</StakeInnerModalContainer>
			)}
			{chainId && stakeState === StakeState.ERROR && (
				<ErrorInnerModal
					title='Something went wrong!'
					txHash={txHash}
				/>
			)}
		</StakeModalContainer>
	);
};
