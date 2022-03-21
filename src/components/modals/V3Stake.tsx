import { FC, useState } from 'react';
import { IModal, Modal } from './Modal';
import {
	B,
	brandColors,
	Button,
	Caption,
	H4,
	IconGIVStream,
	IconHelp,
	Lead,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';
import {
	CancelButton,
	GIVRate,
	HarvestButton,
	HelpRow,
	Pending,
	RateRow,
	TooltipContent,
} from './HarvestAll.sc';
import Lottie from 'react-lottie';
import { Flex } from '../styled-components/Flex';
import styled from 'styled-components';
import { PoolStakingConfig } from '@/types/config';
import { StakingPoolImages } from '../StakingPoolImages';
import V3StakingCard from '../cards/PositionCard';
import { useLiquidityPositions, useSubgraph } from '@/context';
import { AmountBoxWithPrice } from '../AmountBoxWithPrice';
import { IconWithTooltip } from '../IconWithToolTip';
import LoadingAnimation from '@/animations/loading.json';
import { exit, getReward, transfer } from '@/lib/stakingNFT';
import { BigNumber, constants } from 'ethers';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { formatWeiHelper } from '@/helpers/number';
import { getUniswapV3StakerContract } from '@/lib/contracts';
import { useWeb3React } from '@web3-react/core';
import { StakeState } from '@/lib/staking';

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

interface IV3StakeModalProps extends IModal {
	poolStakingConfig: PoolStakingConfig;
	isUnstakingModal?: boolean;
}

export const V3StakeModal: FC<IV3StakeModalProps> = ({
	poolStakingConfig,
	isUnstakingModal,
	showModal,
	setShowModal,
}) => {
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { givTokenDistroHelper } = useTokenDistro();
	const { chainId, library, account } = useWeb3React();
	const { unstakedPositions, stakedPositions, currentIncentive } =
		useLiquidityPositions();
	const positions = isUnstakingModal ? stakedPositions : unstakedPositions;
	const { title } = poolStakingConfig;
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
		if (!isUnstakingModal) {
			setStakeStatus(StakeState.CONFIRMING);
			setTokenId(tokenId);
		} else {
			await handleAction(tokenId);
			setStakeStatus(StakeState.CONFIRM_UNSTAKE);
		}
		console.log(tokenId, account, library, currentIncentive);
		const tx = isUnstakingModal
			? await exit(
					tokenIdState,
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
		console.log(tx);
		setTxStatus(tx);
		try {
			const { status } = await tx.wait();
			if (status) {
				setStakeStatus(StakeState.CONFIRMED);
			} else {
				setStakeStatus(StakeState.ERROR);
			}
		} catch {
			setStakeStatus(StakeState.UNKNOWN);
		}
	};

	const handleAction = async (tokenId: number) => {
		const uniswapV3StakerContract = getUniswapV3StakerContract(library);
		if (!library || !uniswapV3StakerContract) return;

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
		setClaimableNow(givTokenDistroHelper.getUserClaimableNow(balances));
		setGivBackLiquidPart(
			givTokenDistroHelper.getLiquidPart(balances.givback),
		);
		setStakeStatus(StakeState.UNSTAKING);
	};

	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<StakeModalContainer>
				{(stakeStatus === StakeState.UNKNOWN ||
					stakeStatus === StakeState.CONFIRMING ||
					stakeStatus === StakeState.UNSTAKING ||
					stakeStatus === StakeState.CONFIRM_UNSTAKE) && (
					<StakeModalTitle alignItems='center'>
						<StakingPoolImages title={title} />
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
									<Lottie
										options={loadingAnimationOptions}
										height={40}
										width={40}
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
								onClick={() => {
									setShowModal(false);
								}}
								// disabled={claimState === ClaimState.WAITING}
							/>
						</HarvestButtonContainer>
					</HarvestContainer>
				)}
				<InnerModalStates>
					{chainId && stakeStatus === StakeState.REJECT && (
						<ErrorInnerModal
							title='You rejected the transaction.'
							walletNetwork={chainId}
							txHash={txStatus?.hash}
						/>
					)}
					{chainId && stakeStatus === StakeState.SUBMITTING && (
						<SubmittedInnerModal
							title={title}
							walletNetwork={chainId}
							txHash={txStatus?.hash}
						/>
					)}
					{chainId && stakeStatus === StakeState.CONFIRMED && (
						<ConfirmedInnerModal
							title='Successful transaction.'
							walletNetwork={chainId}
							txHash={txStatus?.hash}
						/>
					)}
					{chainId && stakeStatus === StakeState.ERROR && (
						<ErrorInnerModal
							title='Something went wrong!'
							walletNetwork={chainId}
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
