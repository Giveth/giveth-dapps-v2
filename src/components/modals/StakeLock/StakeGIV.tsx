import React, { FC, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers } from 'ethers';
import { captureException } from '@sentry/nextjs';
import { ButtonLink, H5, IconExternalLink } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Modal } from '../Modal';
import { AmountInput } from '../../AmountInput';
import { approveERC20tokenTransfer, wrapToken } from '@/lib/stakingPool';
import LoadingAnimation from '../../../animations/loading.json';
import { ErrorInnerModal } from '../ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import { abi as ERC20_ABI } from '@/artifacts/ERC20.json';
import { IModal } from '@/types/common';
import StakeSteps from './StakeSteps';
import { ERC20 } from '@/types/contracts';
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
	PoolStakingConfig,
	SimplePoolStakingConfig,
} from '@/types/config';

interface IStakeInnerModalProps {
	poolStakingConfig: PoolStakingConfig;
	showLockModal: () => void;
}

interface IStakeModalProps extends IModal, IStakeInnerModalProps {}

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
	const [amount, setAmount] = useState('0');
	const [txHash, setTxHash] = useState('');
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.APPROVE,
	);
	const { chainId, library } = useWeb3React();
	const { notStakedAmount: maxAmount } = useStakingPool(poolStakingConfig);

	const { POOL_ADDRESS, GARDEN_ADDRESS } =
		poolStakingConfig as SimplePoolStakingConfig;

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
											amount == '0' ||
											maxAmount.lt(amount) ||
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
											{formatWeiHelper(amount)} GIV
										</H5White>
									</BriefContainer>
									<StyledOutlineButton
										label={formatMessage({
											id:
												stakeState === StakeState.WRAP
													? 'label.stake'
													: 'label.stake_pending',
										})}
										onClick={onWrap}
										disabled={
											amount == '0' ||
											maxAmount.lt(amount) ||
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
							{formatWeiHelper(amount)} GIV
						</H5White>
						<ButtonLink
							isExternal
							label='View on blockscout'
							linkType='texty'
							size='small'
							icon={<IconExternalLink size={16} />}
							href={`${config.XDAI_CONFIG.blockExplorerUrls}tx/${txHash}`}
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
