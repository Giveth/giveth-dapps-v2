import { FC, useState } from 'react';
import { H4, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { captureException } from '@sentry/nextjs';
import { Modal } from './Modal';
import { CancelButton, HarvestButton, HelpRow } from './HarvestAll.sc';
import { Flex } from '../styled-components/Flex';
import { PoolStakingConfig } from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import V3StakingCard from '../cards/StakingCards/PositionCard/PositionCard';
import { exit, transfer } from '@/lib/stakingNFT';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';
import { StakeState } from '@/lib/staking';
import { IModal } from '@/types/common';
import { LiquidityPosition } from '@/types/nfts';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IV3StakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	isUnstakingModal?: boolean;
	stakedPositions: LiquidityPosition[];
	unstakedPositions: LiquidityPosition[];
	currentIncentive: {
		key?: (string | number)[] | null | undefined;
	};
}

export const V3StakeModal: FC<IV3StakeModalProps> = ({
	poolStakingConfig,
	isUnstakingModal,
	stakedPositions,
	unstakedPositions,
	currentIncentive,
	setShowModal,
}) => {
	const { chainId, library, account } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const positions = isUnstakingModal ? stakedPositions : unstakedPositions;
	const { title, icon } = poolStakingConfig;
	const [stakeStatus, setStakeStatus] = useState<StakeState>(
		StakeState.UNKNOWN,
	);
	const [txStatus, setTxStatus] = useState<any>();
	const [tokenIdState, setTokenId] = useState<number>(0);

	const handleStakeUnstake = async (tokenId: number) => {
		if (!account || !library) return;
		setTokenId(tokenId);
		setStakeStatus(StakeState.CONFIRMING);
		// console.log(tokenId, account, library, currentIncentive);
		const tx = isUnstakingModal
			? await exit(
					tokenId,
					account,
					library,
					currentIncentive,
					setStakeStatus,
			  )
			: await transfer(
					tokenId,
					account,
					library,
					currentIncentive,
					setStakeStatus,
			  );
		setTxStatus(tx);
		try {
			const { status } = await tx.wait();
			if (status) {
				setStakeStatus(StakeState.CONFIRMED);
			} else {
				setStakeStatus(StakeState.ERROR);
			}
		} catch (error) {
			setStakeStatus(StakeState.UNKNOWN);
			captureException(error, {
				tags: {
					section: 'handleStakeUnstake',
				},
			});
		}
	};

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
			<StakeModalContainer>
				{(stakeStatus === StakeState.UNKNOWN ||
					stakeStatus === StakeState.CONFIRMING ||
					stakeStatus === StakeState.UNSTAKING ||
					stakeStatus === StakeState.CONFIRM_UNSTAKE) && (
					<StakeModalTitle alignItems='center'>
						<StakingPoolImages title={title} icon={icon} />
						<StakeModalTitleText weight={700}>
							{title}
						</StakeModalTitleText>
					</StakeModalTitle>
				)}
				{(stakeStatus === StakeState.UNKNOWN ||
					stakeStatus === StakeState.CONFIRMING) && (
					<InnerModalPositions>
						{positions.map(position => (
							<V3StakingCard
								key={position.tokenId.toString()}
								position={position}
								isUnstaking={isUnstakingModal}
								handleAction={handleStakeUnstake}
								isConfirming={
									stakeStatus === StakeState.CONFIRMING
								}
								selectedPosition={
									position.tokenId === tokenIdState
								}
							/>
						))}
					</InnerModalPositions>
				)}
				{(stakeStatus === StakeState.UNSTAKING ||
					stakeStatus === StakeState.CONFIRM_UNSTAKE) && (
					<HarvestContainer>
						<HelpRow>Please, unstake your NFT!</HelpRow>
						<HarvestButtonContainer>
							<HarvestButton
								label={
									stakeStatus === StakeState.CONFIRM_UNSTAKE
										? 'PENDING'
										: 'UNSTAKE'
								}
								size='medium'
								buttonType='primary'
								onClick={() => {
									handleStakeUnstake(0);
								}}
								loading={
									stakeStatus === StakeState.CONFIRM_UNSTAKE
								}
							/>
							<CancelButton
								label='CANCEL'
								size='medium'
								buttonType='texty'
								onClick={closeModal}
								// disabled={claimState === ClaimState.WAITING}
							/>
						</HarvestButtonContainer>
					</HarvestContainer>
				)}
				<InnerModalStates>
					{chainId && stakeStatus === StakeState.REJECT && (
						<ErrorInnerModal
							title='You rejected the transaction.'
							txHash={txStatus?.hash}
						/>
					)}
					{chainId && stakeStatus === StakeState.SUBMITTING && (
						<SubmittedInnerModal
							title={title}
							txHash={txStatus?.hash}
						/>
					)}
					{chainId && stakeStatus === StakeState.CONFIRMED && (
						<ConfirmedInnerModal
							title='Successful transaction.'
							txHash={txStatus?.hash}
						/>
					)}
					{chainId && stakeStatus === StakeState.ERROR && (
						<ErrorInnerModal
							title='Something went wrong!'
							txHash={txStatus?.hash}
						/>
					)}
				</InnerModalStates>
			</StakeModalContainer>
		</Modal>
	);
};

const StakeModalContainer = styled.div`
	padding: 24px 0;
`;

const StakeModalTitle = styled(Flex)`
	margin-bottom: 42px;
`;

const StakeModalTitleText = styled(H4)`
	margin-left: 54px;
	color: ${neutralColors.gray[100]};
`;

const InnerModalPositions = styled.div`
	width: 630px;
	display: flex;
	flex-direction: column;
	padding: 24px;
	gap: 36px;
`;

const InnerModalStates = styled.div`
	width: 370px;
`;

export const HarvestContainer = styled.div`
	margin: auto;
	padding: 0 24px;
	width: 630px;
`;

export const HarvestButtonContainer = styled.div`
	margin-top: 36px;
`;
