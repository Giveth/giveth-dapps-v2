import React, { FC, useEffect, useState } from 'react';
import {
	B,
	brandColors,
	Button,
	Caption,
	H4,
	H5,
	H6,
	IconGIVStream,
	IconHelp,
	Lead,
	P,
	Subline,
} from '@giveth/ui-design-system';
import { constants, ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { durationToString } from '@/lib/helpers';
import {
	Bar,
	GsPTooltip,
	PercentageRow,
} from '@/components/homeTabs/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { RegenStreamConfig, StreamType } from '@/types/config';
import { BN, formatWeiHelper } from '@/helpers/number';
import { IconFox } from '@/components/Icons/Fox';
import { IconCult } from '@/components/Icons/Cult';
import { Flex } from './styled-components/Flex';
import { HarvestAllModal } from './modals/HarvestAll';
import { useAppSelector } from '@/features/hooks';
import useRegenTokenDistroHelper from '@/hooks/useRegenTokenDistroHelper';
import config from '@/configuration';

interface RegenStreamProps {
	network: number;
	streamConfig: RegenStreamConfig;
}

export const getStreamIconWithType = (type: StreamType, size?: number) => {
	switch (type) {
		case StreamType.FOX:
			return <IconFox size={size} />;
		case StreamType.CULT:
			return <IconCult size={size} />;
		default:
			break;
	}
};

export const RegenStreamCard: FC<RegenStreamProps> = ({
	network,
	streamConfig,
}) => {
	const [showModal, setShowModal] = useState(false);
	const [usdAmount, setUSDAmount] = useState('0');
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const [lockedAmount, setLockedAmount] = useState<ethers.BigNumber>(
		constants.Zero,
	);
	const [claimedAmount, setClaimedAmount] = useState<ethers.BigNumber>(
		constants.Zero,
	);
	const { regenTokenDistroHelper } = useRegenTokenDistroHelper(
		streamConfig.type,
	);
	const currentValues = useAppSelector(state => state.subgraph.currentValues);
	const { balances } = currentValues;
	const { mainnetThirdPartyTokensPrice, xDaiThirdPartyTokensPrice } =
		useAppSelector(state => state.price);

	useEffect(() => {
		const currentPrice =
			network === config.MAINNET_NETWORK_NUMBER
				? mainnetThirdPartyTokensPrice
				: xDaiThirdPartyTokensPrice;
		const price = new BigNumber(
			currentPrice[streamConfig.tokenAddressOnUniswapV2],
		);
		if (!price || price.isNaN()) return;

		const usd = (+ethers.utils.formatEther(
			price.times(rewardLiquidPart.toString()).toFixed(0),
		)).toFixed(2);
		setUSDAmount(usd);
	}, [
		rewardLiquidPart,
		network,
		streamConfig.tokenAddressOnUniswapV2,
		mainnetThirdPartyTokensPrice,
		xDaiThirdPartyTokensPrice,
	]);
	useEffect(() => {
		switch (streamConfig.type) {
			case StreamType.FOX:
				setLockedAmount(BN(balances.foxAllocatedTokens));
				setClaimedAmount(BN(balances.foxClaimed));
				break;
			case StreamType.CULT:
				setLockedAmount(BN(balances.cultAllocatedTokens));
				setClaimedAmount(BN(balances.cultClaimed));
				break;
			default:
				setLockedAmount(ethers.constants.Zero);
				setClaimedAmount(ethers.constants.Zero);
		}
	}, [streamConfig.type, balances]);

	useEffect(() => {
		setRewardLiquidPart(
			regenTokenDistroHelper
				.getLiquidPart(lockedAmount)
				.sub(claimedAmount),
		);
		setRewardStream(
			regenTokenDistroHelper.getStreamPartTokenPerWeek(lockedAmount),
		);
	}, [claimedAmount, lockedAmount, regenTokenDistroHelper]);

	const percentage = regenTokenDistroHelper?.GlobalReleasePercentage || 0;
	const remainTime = durationToString(regenTokenDistroHelper?.remain || 0);
	const icon = getStreamIconWithType(streamConfig.type, 40);

	return (
		<>
			<RegenStreamContainer>
				<HeaderRow justifyContent='space-between' wrap={1}>
					<Flex gap='8px'>
						{icon}
						<H5>{streamConfig.title}</H5>
					</Flex>
					<RateRow>
						<IconGIVStream size={32} />
						<StreamRate>{formatWeiHelper(rewardStream)}</StreamRate>
						<StreamRateUnit>
							{streamConfig.rewardTokenSymbol}/week
						</StreamRateUnit>
						{/* <IconWithTooltip
							icon={<IconHelp size={16} />}
							direction={'left'}
						>
							<GsPTooltip>
								Your {streamConfig.rewardTokenSymbol}stream
								flowrate
							</GsPTooltip>
						</IconWithTooltip> */}
					</RateRow>
				</HeaderRow>
				<div>
					<RegenStreamInfoRow>
						<Flex alignItems='flex-end' gap='6px'>
							<H6>
								{streamConfig.rewardTokenSymbol}stream progress
							</H6>

							<IconWithTooltip
								icon={<IconHelp size={16} />}
								direction={'right'}
							>
								<GsPTooltip>
									Liquid{'	 '}
									{streamConfig.rewardTokenSymbol}
									{'	 '}
									that has already flowed out of the{' '}
									{streamConfig.rewardTokenSymbol}stream
								</GsPTooltip>
							</IconWithTooltip>
						</Flex>
					</RegenStreamInfoRow>
					<Bar percentage={percentage} />
					<PercentageRow justifyContent='space-between'>
						<B>{percentage?.toFixed(2)}%</B>
						<B>100%</B>
					</PercentageRow>
				</div>
				<Remaining>{`Time remaining: ` + remainTime}</Remaining>
				<HarvestContainer wrap={1}>
					<div>
						<AmountInfo alignItems='flex-end' gap='4px'>
							{getStreamIconWithType(streamConfig.type, 24)}
							<Amount>{formatWeiHelper(rewardLiquidPart)}</Amount>
							<AmountUnit>
								{streamConfig.rewardTokenSymbol}
							</AmountUnit>
						</AmountInfo>
						<Converted>~${usdAmount}</Converted>
					</div>
					<HarvestButton
						label={`HARVEST ${streamConfig.rewardTokenSymbol}`}
						onClick={() => setShowModal(true)}
						buttonType='primary'
						disabled={rewardLiquidPart.isZero()}
						size='large'
					/>
				</HarvestContainer>
				{showModal && (
					<HarvestAllModal
						title={
							streamConfig.rewardTokenSymbol + 'stream Rewards'
						}
						setShowModal={setShowModal}
						network={network}
						regenStreamConfig={streamConfig}
						tokenDistroHelper={regenTokenDistroHelper}
					/>
				)}
			</RegenStreamContainer>
		</>
	);
};

const RegenStreamContainer = styled(Flex)`
	height: 488px;
	background-color: ${brandColors.giv[700]};
	border-radius: 8px;
	padding: 24px;
	position: relative;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;
`;

const HeaderRow = styled(Flex)`
	margin-bottom: 76px;
`;

const RateRow = styled(Flex)`
	gap: 8px;
	align-items: flex-end;
	overflow: hidden;
`;

const StreamRate = styled(H4)`
	line-height: 2.4rem;
`;

const StreamRateUnit = styled(H6)`
	color: ${brandColors.giv[200]};
`;

const RegenStreamInfoRow = styled(Flex)`
	justify-content: space-between;
	margin-bottom: 24px;
`;

const Remaining = styled(P)`
	/* margin-top: 24px; */
`;

const HarvestContainer = styled(Flex)`
	/* margin-top: 90px; */
	padding-top: 24px;
	border-top: 1px solid ${brandColors.giv[500]};
	justify-content: space-between;
	align-items: center;
`;

const AmountInfo = styled(Flex)`
	align-items: center;
`;

const Amount = styled(Lead)`
	margin-left: 4px;
`;

const AmountUnit = styled(Subline)`
	color: ${brandColors.deep[100]};
	padding-top: 6px;
`;

const Converted = styled(Caption)`
	color: ${brandColors.deep[200]};
	padding-top: 4px;
	padding-left: 32px;
`;

const HarvestButton = styled(Button)`
	width: auto;
	padding-left: 64px;
	padding-right: 64px;
`;
