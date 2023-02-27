import {
	ButtonLink,
	GLink,
	IconHelpFilled16,
	IconRocketInSpace32,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import {
	CancelButton,
	StyledButton,
	SectionTitle,
	StakeInnerModalContainer,
	StakeModalContainer,
} from './StakeLock.sc';
import { AmountInput } from '@/components/AmountInput';
import LockSlider from './LockSlider';
import LockInfo, { LockInfoTooltip } from './LockInfo';
import LockingBrief from './LockingBrief';
import { lockToken } from '@/lib/stakingPool';
import config from '@/configuration';
import TotalGIVpowerBox from './TotalGIVpowerBox';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Flex } from '@/components/styled-components/Flex';
import links from '@/lib/constants/links';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';
import { useStakingPool } from '@/hooks/useStakingPool';
import { useTokenDistroHelper } from '@/hooks/useTokenDistroHelper';
import type { PoolStakingConfig } from '@/types/config';

interface ILockModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	isGIVpower: boolean;
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
}) => {
	const { formatMessage } = useIntl();
	const [amount, setAmount] = useState('0');
	const [round, setRound] = useState(0);
	const [lockState, setLockState] = useState<ELockState>(ELockState.LOCK);
	const { library } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { stakedAmount: stakedLpAmount } = useStakingPool(poolStakingConfig);

	const { network: poolNetwork } = poolStakingConfig;

	const { sdh } = useTokenDistroHelper(poolNetwork);

	const userGIVLocked = sdh.getUserGIVLockedBalance();

	const maxAmount = isGIVpower
		? stakedLpAmount.sub(userGIVLocked.balance)
		: stakedLpAmount;

	const onLock = async () => {
		const contractAddress = config.XDAI_CONFIG.GIV.LM_ADDRESS;
		setLockState(ELockState.LOCKING);
		try {
			const txResponse = await lockToken(
				amount,
				round,
				contractAddress,
				library,
			);
			if (txResponse) {
				if (txResponse) {
					const { status } = await txResponse.wait();
					setLockState(status ? ELockState.BOOST : ELockState.ERROR);
				}
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
							<AmountInput
								setAmount={setAmount}
								maxAmount={maxAmount}
								poolStakingConfig={poolStakingConfig}
							/>
							<Flex gap='4px' alignItems='center'>
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
							<LockSlider setRound={setRound} round={round} />
							<LockInfo round={round} amount={amount} />
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
									amount == '0' ||
									maxAmount.lt(amount)
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
							<LockInfo round={round} amount={amount} />
							<StyledButton
								buttonType='primary'
								label={formatMessage({
									id: 'label.lock_your_tokens',
								})}
								onClick={onLock}
								disabled={
									amount == '0' ||
									maxAmount.lt(amount) ||
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
							<Link href={Routes.Projects}>
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
