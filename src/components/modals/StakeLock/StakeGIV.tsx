import React, { FC, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { ButtonLink, H5, IconExternalLink } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import { Modal } from '../Modal';
import {
	approveERC20tokenTransfer,
	permitTokens,
	stakeGIV,
	wrapToken,
} from '@/lib/stakingPool';
import { ErrorInnerModal } from '../ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import { waitForTransaction } from '@/lib/transaction';
import { IModal } from '@/types/common';
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
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import { useStakingPool } from '@/hooks/useStakingPool';
import { StakingAmountInput } from '@/components/AmountInput/StakingAmountInput';
import { StakeSteps } from './StakeSteps';
import { getGIVConfig } from '@/helpers/givpower';
import {
	RegenPoolStakingConfig,
	StakingType,
	type PoolStakingConfig,
	type SimplePoolStakingConfig,
} from '@/types/config';

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
	const [permit, setPermit] = useState<boolean>(false);
	const [amount, setAmount] = useState(0n);
	const [txHash, setTxHash] = useState('');
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.APPROVE,
	);
	const { address } = useAccount();
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { notStakedAmount: _maxAmount } = useStakingPool(poolStakingConfig);
	const maxAmount = _maxAmount || 0n;
	const isSafeEnv = useIsSafeEnvironment();
	const { POOL_ADDRESS, LM_ADDRESS, type } =
		poolStakingConfig as SimplePoolStakingConfig;

	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;

	const isGIVpower =
		type === StakingType.GIV_GARDEN_LM ||
		type === StakingType.GIV_UNIPOOL_LM;

	// preffix property for heading elements used by analytics
	const idPropertyPreffix = regenStreamType
		? 'regenfarm'
		: isGIVpower
			? 'givpower'
			: '';

	const onApprove = async () => {
		if (amount === 0n) return;
		setStakeState(StakeState.APPROVING);

		const isApproved = await approveERC20tokenTransfer(
			amount,
			address!,
			poolStakingConfig.network === config.GNOSIS_NETWORK_NUMBER
				? poolStakingConfig.GARDEN_ADDRESS!
				: LM_ADDRESS!,
			POOL_ADDRESS,
			chainId!,
			isSafeEnv,
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
				poolStakingConfig.GARDEN_ADDRESS!,
				chainId!,
			);
			if (txResponse) {
				setTxHash(txResponse);
				const data = await waitForTransaction(txResponse, isSafeEnv);
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
		if (!chainId || !address) return;
		setStakeState(StakeState.WRAPPING);
		try {
			if (permit) {
				const permitSignature = await permitTokens(
					chainId,
					address,
					poolStakingConfig.POOL_ADDRESS,
					poolStakingConfig.LM_ADDRESS,
					amount,
				);
				if (!permitSignature)
					throw new Error('Permit signature failed');
			}

			const txResponse = await stakeGIV(
				amount,
				poolStakingConfig.LM_ADDRESS,
				chainId,
			);
			if (txResponse) {
				setTxHash(txResponse);
				const data = await waitForTransaction(txResponse, isSafeEnv);
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
									<StakingAmountInput
										amount={amount}
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
											maxAmount < amount ||
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
										href={
											getGIVConfig(
												poolStakingConfig.network,
											).GIV_BUY_LINK
										}
										target='_blank'
										icon={<IconExternalLink size={16} />}
									/>
								</>
							)}

							{(stakeState === StakeState.WRAP ||
								stakeState === StakeState.WRAPPING) && (
								<>
									<BriefContainer>
										<H5 id={`${idPropertyPreffix}-staking`}>
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
											maxAmount < amount ||
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
						<H5White id={`${idPropertyPreffix}-staked`}>
							You have staked
						</H5White>
						<H5White weight={700}>
							{formatWeiHelper(amount.toString())} GIV
						</H5White>
						<ButtonLink
							isExternal
							label={`View on ${config.EVM_NETWORKS_CONFIG[chainId].blockExplorers?.default.name}`}
							linkType='texty'
							size='small'
							icon={<IconExternalLink size={16} />}
							href={`${config.EVM_NETWORKS_CONFIG[chainId].blockExplorers?.default.url}/tx/${txHash}`}
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
