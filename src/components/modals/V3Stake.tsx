import { FC, useState } from 'react';
import {
	B,
	brandColors,
	Button,
	H4,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { BigNumber, constants } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { captureException } from '@sentry/nextjs';
import { Modal } from './Modal';
import { CancelButton, HarvestButton, HelpRow, Pending } from './HarvestAll.sc';
import { Flex } from '../styled-components/Flex';
import { PoolStakingConfig } from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import V3StakingCard from '../cards/StakingCards/PositionCard/PositionCard';
import LoadingAnimation from '@/animations/loading.json';
import { exit, getReward, transfer } from '@/lib/stakingNFT';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { getUniswapV3StakerContract } from '@/lib/contracts';
import { StakeState } from '@/lib/staking';
import { BN } from '@/helpers/number';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { LiquidityPosition } from '@/types/nfts';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import LottieControl from '@/components/LottieControl';

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
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.currentValues),
	);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const { chainId, library, account } = useWeb3React();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const positions = isUnstakingModal ? stakedPositions : unstakedPositions;
	const { title, icon } = poolStakingConfig;
	const [stakeStatus, setStakeStatus] = useState<StakeState>(
		StakeState.UNKNOWN,
	);
	const [txStatus, setTxStatus] = useState<any>();
	const [tokenIdState, setTokenId] = useState<number>(0);
	const [reward, setReward] = useState<BigNumber>(constants.Zero);
	const [stream, setStream] = useState<BigNumber>(constants.Zero);
	const [claimableNow, setClaimableNow] = useState<BigNumber>(constants.Zero);
	const [givBackLiquidPart, setGivBackLiquidPart] = useState<BigNumber>(
		constants.Zero,
	);

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

	const handleAction = async (tokenId: number) => {
		const uniswapV3StakerContract = getUniswapV3StakerContract(library);
		if (!library || !uniswapV3StakerContract) return;

		const givTokenDistroBalance = sdh.getGIVTokenDistroBalance();
		const bnGIVback = BN(givTokenDistroBalance.givback);
		const _reward = await getReward(
			tokenId,
			uniswapV3StakerContract,
			currentIncentive.key,
		);

		const liquidReward = givTokenDistroHelper.getLiquidPart(_reward);
		const streamPerWeek =
			givTokenDistroHelper.getStreamPartTokenPerWeek(_reward);
		setTokenId(tokenId);
		setReward(liquidReward);
		setStream(BigNumber.from(streamPerWeek.toFixed(0)));
		setClaimableNow(
			givTokenDistroHelper.getUserClaimableNow(givTokenDistroBalance),
		);
		setGivBackLiquidPart(givTokenDistroHelper.getLiquidPart(bnGIVback));
		// setStakeStatus(StakeState.UNSTAKING);
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
							{stakeStatus === StakeState.CONFIRM_UNSTAKE ? (
								<Pending>
									<LottieControl
										animationData={LoadingAnimation}
										size={40}
									/>
									&nbsp; PENDING
								</Pending>
							) : (
								<HarvestButton
									label='UNSTAKE'
									size='medium'
									buttonType='primary'
									onClick={() => {
										handleStakeUnstake(0);
									}}
								/>
							)}
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

export const PositionContainer = styled.div`
	display: flex;
	justify-content: space-between;
	border-radius: 8px;
	padding: 12px 24px;
	background: ${brandColors.giv[400]};
	color: ${neutralColors.gray[100]};
`;

export const PositionInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: ${neutralColors.gray[100]};
`;

export const PositionInfoRow = styled(Flex)`
	align-items: center;
	gap: 8px;
`;

export const TokenAmountRow = styled(Flex)`
	align-items: center;
	gap: 4px;
`;

export const StyledOverline = styled(Overline)`
	color: ${brandColors.deep[100]};
`;

const RoundedInfo = styled.div`
	background: ${brandColors.giv[600]};
	border-radius: 28px;
	font-weight: bold;
	padding: 4px 10px;
`;

export const TokenValue = styled(B)``;

export const PositionActions = styled.div`
	display: flex;
	width: 180px;
	flex-direction: column;
	gap: 12px;
`;

export const FullWidthButton = styled(Button)`
	width: 100%;
`;

export const HarvestContainer = styled.div`
	margin: auto;
	padding: 0 24px;
	width: 630px;
`;

export const HarvestButtonContainer = styled.div`
	margin-top: 36px;
`;
