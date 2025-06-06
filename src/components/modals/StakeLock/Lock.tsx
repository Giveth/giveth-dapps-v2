import {
	ButtonLink,
	GLink,
	IconHelpFilled16,
	IconRocketInSpace32,
	P,
	semanticColors,
	Flex,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import {
	CancelButton,
	StyledButton,
	SectionTitle,
	StakeInnerModalContainer,
	StakeModalContainer,
} from './StakeLock.sc';
import LockSlider from './LockSlider';
import LockInfo, { LockInfoTooltip } from './LockInfo';
import LockingBrief from './LockingBrief';
import { waitForTransaction } from '@/lib/transaction';
import { lockToken } from '@/lib/stakingPool';
import config from '@/configuration';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import links from '@/lib/constants/links';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { useStakingPool } from '@/hooks/useStakingPool';
import { useTokenDistroHelper } from '@/hooks/useTokenDistroHelper';
import TotalGIVpowerBox from './TotalGIVpowerBox';
import { StakingAmountInput } from '@/components/AmountInput/StakingAmountInput';
import type { PoolStakingConfig } from '@/types/config';

interface ILockModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	isGIVpower: boolean;
	started: boolean;
}

export enum ELockState {
	LOCK,
	CONFIRM,
	LOCKING,
	BOOST,
	ERROR,
}

const LockModal: FC<ILockModalProps> = ({
	poolStakingConfig,
	isGIVpower,
	setShowModal,
	started,
}) => {
	const { formatMessage } = useIntl();
	const isSafeEnv = useIsSafeEnvironment();
	const [amount, setAmount] = useState(0n);
	const [round, setRound] = useState(0);
	const [lockState, setLockState] = useState<ELockState>(ELockState.LOCK);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { address, chain } = useAccount();
	const chainId = chain?.id;
	const { stakedAmount: stakedLpAmount } =
		useStakingPool(poolStakingConfig) || {};

	const { network: poolNetwork } = poolStakingConfig || {};

	const { sdh } = useTokenDistroHelper(poolNetwork) || {};

	const userGIVLocked = sdh.getUserGIVLockedBalance();

	const maxAmount = isGIVpower
		? stakedLpAmount - BigInt(userGIVLocked.balance)
		: stakedLpAmount;

	const onLock = async () => {
		if (!chainId) return;
		const contractAddress =
			config.EVM_NETWORKS_CONFIG[poolNetwork].GIVPOWER?.LM_ADDRESS;
		if (!contractAddress) {
			console.error('No GIVPOWER LM address found');
			return;
		}
		setLockState(ELockState.LOCKING);
		try {
			const txResponse = await lockToken(
				amount,
				round,
				contractAddress,
				chainId,
			);
			if (txResponse) {
				const data = await waitForTransaction(txResponse, isSafeEnv);
				const event = new CustomEvent('chainEvent', {
					detail: {
						type: 'success',
						chainId: chainId,
						blockNumber: data.blockNumber,
						address: address,
					},
				});
				window.dispatchEvent(event);
				setLockState(
					data.status === 'success'
						? ELockState.BOOST
						: ELockState.ERROR,
				);
			} else {
				setLockState(ELockState.LOCK);
			}
		} catch (err: any) {
			setLockState(
				err?.code === 4001 ? ELockState.LOCK : ELockState.ERROR,
			);
			captureException(err, {
				tags: {
					section: 'onLock',
				},
			});
		}
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={formatMessage({ id: 'label.stake_for_givpower' })}
			headerIcon={<IconRocketInSpace32 />}
		>
			<StakeModalContainer>
				<StakeInnerModalContainer>
					{lockState === ELockState.LOCK && (
						<>
							<SectionTitle weight={700}>
								{formatMessage({
									id: 'label.lock_your_staked_giv',
								})}
							</SectionTitle>
							<StakingAmountInput
								amount={amount}
								setAmount={setAmount}
								maxAmount={maxAmount}
								poolStakingConfig={poolStakingConfig}
							/>
							<Flex gap='4px' $alignItems='center'>
								<SectionTitle weight={700}>
									{formatMessage({ id: 'label.rounds' })}
								</SectionTitle>
								<IconWithTooltip
									icon={<IconHelpFilled16 />}
									direction='right'
									align='top'
								>
									<LockInfoTooltip>
										{formatMessage({
											id: 'label.rounds_are_two_weeks_periods',
										})}
									</LockInfoTooltip>
								</IconWithTooltip>
							</Flex>
							<LockSlider
								setRound={setRound}
								round={round}
								chainNumber={poolNetwork}
							/>
							<LockInfo
								round={round}
								amount={amount}
								farmIsNotStarted={!started}
							/>
							<StyledButton
								buttonType='primary'
								size='small'
								label={formatMessage({
									id: 'label.lock_to_increase_your_multiplier',
								})}
								onClick={() => {
									setLockState(ELockState.CONFIRM);
								}}
								disabled={
									round === 0 ||
									amount == 0n ||
									maxAmount < amount
								}
							/>
							<CancelButton
								buttonType='texty'
								size='small'
								label={formatMessage({ id: 'label.cancel' })}
								onClick={() => {
									setShowModal(false);
								}}
							/>
						</>
					)}
					{(lockState === ELockState.CONFIRM ||
						lockState === ELockState.LOCKING) && (
						<>
							<LockingBrief
								round={round}
								amount={amount}
								onLocking
							/>
							<LockInfo
								round={round}
								amount={amount}
								farmIsNotStarted={!started}
							/>
							<StyledButton
								buttonType='primary'
								label={formatMessage({
									id: 'label.lock_your_tokens',
								})}
								onClick={onLock}
								disabled={
									amount === 0n ||
									maxAmount < amount ||
									lockState === ELockState.LOCKING
								}
								loading={lockState === ELockState.LOCKING}
							/>
						</>
					)}
					{lockState === ELockState.BOOST && (
						<>
							<LockingBrief round={round} amount={amount} />
							<TotalGIVpowerBox />
							<P>
								{formatMessage({
									id: 'label.user_your_givpower_to_support_verified_projects',
								})}
							</P>
							<Link href={Routes.AllProjects}>
								<BoostButton
									linkType='primary'
									label={formatMessage({
										id: 'label.boost_projects',
									})}
									size='small'
								/>
							</Link>
							<ExternalLink href={links.GIVPOWER_DOC}>
								<LearnMoreLink>
									{formatMessage({ id: 'label.learn_more' })}
								</LearnMoreLink>
							</ExternalLink>
						</>
					)}
				</StakeInnerModalContainer>
			</StakeModalContainer>
		</Modal>
	);
};

const LearnMoreLink = styled(GLink)`
	display: block;
	color: ${semanticColors.blueSky[500]};
	margin-top: 16px;
`;

const BoostButton = styled(ButtonLink)`
	margin-top: 38px;
	margin-bottom: 8px;
`;

export default LockModal;
