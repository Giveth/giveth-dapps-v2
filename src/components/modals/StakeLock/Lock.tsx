import {
	ButtonLink,
	GLink,
	IconRocketInSpace32,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { BigNumber } from 'ethers';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';
import { useWeb3React } from '@web3-react/core';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import {
	CancelButton,
	StyledButton,
	SectionTitle,
	StakeInnerModal,
	StakeModalContainer,
} from './StakeLock.sc';
import { AmountInput } from '@/components/AmountInput';
import LockSlider from './LockSlider';
import LockInfo from './LockInfo';
import LockingBrief from './LockingBrief';
import { lockToken } from '@/lib/stakingPool';
import config from '@/configuration';
import TotalGIVpowerBox from './TotalGIVpowerBox';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import type { PoolStakingConfig, RegenStreamConfig } from '@/types/config';

interface ILockModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
	maxAmount: BigNumber;
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
	maxAmount,
	setShowModal,
}) => {
	const [amount, setAmount] = useState('0');
	const [round, setRound] = useState(1);
	const [lockState, setLockState] = useState<ELockState>(ELockState.LOCK);
	const { library } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

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
			headerTitle={'Stake for GIVpower'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<StakeModalContainer>
				<StakeInnerModal>
					{lockState === ELockState.LOCK && (
						<>
							<SectionTitle weight={700}>
								Lock your staked GIV
							</SectionTitle>
							<AmountInput
								setAmount={setAmount}
								maxAmount={maxAmount}
								poolStakingConfig={poolStakingConfig}
							/>
							<SectionTitle weight={700}>Rounds</SectionTitle>
							<LockSlider setRound={setRound} round={round} />
							<LockInfo round={round} amount={amount} />
							<StyledButton
								buttonType='primary'
								size='small'
								label={'Lock to increase your multiplier'}
								onClick={() => {
									setLockState(ELockState.CONFIRM);
								}}
								disabled={amount == '0' || maxAmount.lt(amount)}
							/>
							<CancelButton
								buttonType='texty'
								size='small'
								label={'cancel'}
								onClick={() => {
									setShowModal(false);
								}}
							/>
						</>
					)}
					{(lockState === ELockState.CONFIRM ||
						lockState === ELockState.LOCKING) && (
						<>
							<LockingBrief round={round} amount={amount} />
							<LockInfo round={round} amount={amount} />
							<StyledButton
								buttonType='primary'
								label={'Lock your tokens'}
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
							{/* <P>
								You get GIVpower when you stake &amp; lock GIV.
								GIVpower allows you to influence the ranking of
								projects on Giveth.
							</P>
							<P>
								Top ranked projects may be eligible for matching
								funds, &amp; their donors get more GIVbacks!
							</P>
							<P>
								Boost your favourite projects, or delegate your
								GIVpower to community representatives.
							</P> */}
							<P>
								Coming soon: You will be able to use your
								GIVpower to support verified projects without
								donating.
							</P>
							<LearnMoreLink href=''>Learn More</LearnMoreLink>
							{/* <BoostButton
								linkType='primary'
								label={'Boost projects'}
								size='small'
								href={Routes.Projects}
							/>
							<CancelButton
								buttonType='texty'
								size='small'
								label={'I’ll do it later'}
								onClick={() => {
									setShowModal(false);
								}}
							/> */}
						</>
					)}
				</StakeInnerModal>
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
