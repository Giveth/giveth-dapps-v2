import { FC, useState } from 'react';
import {
	neutralColors,
	Button,
	H4,
	IconUnlock16,
	B,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Modal } from '../Modal';
import { Flex } from '../../styled-components/Flex';
import { StakingPoolImages } from '../../StakingPoolImages';
import { AmountInput } from '../../AmountInput';
import { unwrapToken, withdrawTokens } from '@/lib/stakingPool';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from '../ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import { IModal } from '@/types/common';
import { PoolStakingConfig, RegenStreamConfig } from '@/types/config';
import { useAppSelector } from '@/features/hooks';
import { formatWeiHelper } from '@/helpers/number';

interface IUnStakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	regenStreamConfig?: RegenStreamConfig;
	maxAmount: BigNumber;
}

export const UnStakeModal: FC<IUnStakeModalProps> = ({
	poolStakingConfig,
	regenStreamConfig,
	maxAmount,
	setShowModal,
}) => {
	const [txHash, setTxHash] = useState('');
	const [amount, setAmount] = useState('0');
	const [unStakeState, setUnstakeState] = useState<StakeState>(
		StakeState.UNSTAKE,
	);
	const { library, chainId } = useWeb3React();
	const { totalGIVLocked } = useAppSelector(
		state => state.subgraph.xDaiValues.givpowerInfo,
	);
	const { title, LM_ADDRESS, GARDEN_ADDRESS } = poolStakingConfig;
	const maxUnstakeable = maxAmount.sub(totalGIVLocked);

	const onWithdraw = async () => {
		setUnstakeState(StakeState.UNSTAKING);

		const tx = GARDEN_ADDRESS
			? await unwrapToken(amount, GARDEN_ADDRESS, library)
			: await withdrawTokens(amount, LM_ADDRESS, library);

		if (!tx) {
			setUnstakeState(StakeState.UNSTAKE);
			return;
		}
		setTxHash(tx.hash);
		const { status } = await tx.wait();
		if (status) {
			setUnstakeState(StakeState.CONFIRMED);
		} else {
			setUnstakeState(StakeState.ERROR);
		}
	};

	return (
		<Modal setShowModal={setShowModal}>
			<UnStakeModalContainer>
				{(unStakeState === StakeState.UNSTAKE ||
					unStakeState === StakeState.UNSTAKING) && (
					<>
						<UnStakeModalTitle alignItems='center'>
							<StakingPoolImages title={title} />
							<UnStakeModalTitleText weight={700}>
								Unstake
							</UnStakeModalTitleText>
						</UnStakeModalTitle>

						<InnerModal>
							<AmountInput
								setAmount={setAmount}
								maxAmount={maxUnstakeable}
								poolStakingConfig={poolStakingConfig}
							/>
							{GARDEN_ADDRESS && (
								<>
									<LockInfoContainer
										flexDirection='column'
										gap='8px'
									>
										<Flex justifyContent='space-between'>
											<Flex gap='4px' alignItems='center'>
												<IconUnlock16 />
												<P>Available to unstake</P>
											</Flex>
											<B>
												{formatWeiHelper(
													maxUnstakeable,
													2,
												)}
											</B>
										</Flex>
										<TotalStakedRow justifyContent='space-between'>
											<P>Total staked</P>
											<B>
												{formatWeiHelper(maxAmount, 2)}
											</B>
										</TotalStakedRow>
									</LockInfoContainer>
									<UnStakeButton
										label={'label'}
										onClick={onWithdraw}
										buttonType='primary'
										disabled={
											amount == '0' ||
											maxUnstakeable.lt(amount)
										}
									/>
								</>
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
				{chainId && unStakeState === StakeState.REJECT && (
					<ErrorInnerModal
						title='You rejected the transaction.'
						walletNetwork={chainId}
						txHash={txHash}
					/>
				)}
				{chainId && unStakeState === StakeState.SUBMITTING && (
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
				{chainId && unStakeState === StakeState.CONFIRMED && (
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
				{chainId && unStakeState === StakeState.ERROR && (
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
			</UnStakeModalContainer>
		</Modal>
	);
};

const UnStakeModalContainer = styled.div`
	width: 370px;
	padding-bottom: 24px;
`;

const UnStakeModalTitle = styled(Flex)`
	margin-bottom: 42px;
`;

const UnStakeModalTitleText = styled(H4)`
	margin-left: 54px;
	color: ${neutralColors.gray[100]};
`;

const InnerModal = styled.div`
	padding: 0 24px;
`;

const UnStakeButton = styled(Button)`
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

const LockInfoContainer = styled(Flex)`
	margin-top: 24px;
`;

const TotalStakedRow = styled(Flex)`
	opacity: 0.6;
`;
