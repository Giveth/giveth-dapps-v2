import { FC, useState } from 'react';
import Lottie from 'react-lottie';
import {
	neutralColors,
	Button,
	H4,
	IconUnlock16,
	IconLock16,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Modal } from '../Modal';
import { Flex } from '../../styled-components/Flex';
import { StakingPoolImages } from '../../StakingPoolImages';
import { AmountInput } from '../../AmountInput';
import { unwrapToken, withdrawTokens } from '@/lib/stakingPool';
import LoadingAnimation from '@/animations/loading.json';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from '../ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import { IModal } from '@/types/common';
import {
	PoolStakingConfig,
	RegenStreamConfig,
	StakingType,
} from '@/types/config';

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

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
	const [label, setLabel] = useState('UNSTAKE');
	const [stakeState, setStakeState] = useState<StakeState>(
		StakeState.UNKNOWN,
	);
	const { library, chainId } = useWeb3React();

	const { title, LM_ADDRESS, GARDEN_ADDRESS } = poolStakingConfig;

	const onWithdraw = async () => {
		setLabel('PENDING UNSTAKE');

		const tx = GARDEN_ADDRESS
			? await unwrapToken(amount, GARDEN_ADDRESS, library)
			: await withdrawTokens(amount, LM_ADDRESS, library);

		if (!tx) {
			setStakeState(StakeState.UNKNOWN);
			setLabel('UNSTAKE');
			return;
		}

		setTxHash(tx.hash);
		setStakeState(StakeState.SUBMITTING);

		const { status } = await tx.wait();

		if (status) {
			setStakeState(StakeState.CONFIRMED);
		} else {
			setStakeState(StakeState.ERROR);
		}
	};

	return (
		<Modal setShowModal={setShowModal}>
			<UnStakeModalContainer>
				{(stakeState === StakeState.UNKNOWN ||
					stakeState === StakeState.CONFIRMING) && (
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
								maxAmount={maxAmount}
								poolStakingConfig={poolStakingConfig}
							/>
							{poolStakingConfig.type ===
								StakingType.GIVPOWER && (
								<LockInfoContainer>
									<Flex>
										<div>
											<IconUnlock16 />
										</div>
									</Flex>
									<Flex>
										<div>
											<IconLock16 />
										</div>
									</Flex>
								</LockInfoContainer>
							)}
							{label === 'UNSTAKE' && (
								<UnStakeButton
									label={label}
									onClick={onWithdraw}
									buttonType='primary'
									disabled={
										amount == '0' || maxAmount.lt(amount)
									}
								/>
							)}

							{label === 'PENDING UNSTAKE' && (
								<Pending>
									<Lottie
										options={loadingAnimationOptions}
										height={40}
										width={40}
									/>
									&nbsp;UNSTAKE PENDING
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
				{chainId && stakeState === StakeState.REJECT && (
					<ErrorInnerModal
						title='You rejected the transaction.'
						walletNetwork={chainId}
						txHash={txHash}
					/>
				)}
				{chainId && stakeState === StakeState.SUBMITTING && (
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
				{chainId && stakeState === StakeState.CONFIRMED && (
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
				{chainId && stakeState === StakeState.ERROR && (
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

const LockInfoContainer = styled.div``;

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
