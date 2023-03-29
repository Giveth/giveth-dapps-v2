import React, { FC, useEffect, useMemo, useState } from 'react';
import {
	B,
	brandColors,
	Button,
	Caption,
	H4,
	H5,
	H6,
	IconGIVStream,
	IconHelpFilled16,
	IconInfoOutline16,
	Lead,
	mediaQueries,
	P,
	Subline,
} from '@giveth/ui-design-system';
import { constants, BigNumber as EthBignumber } from 'ethers';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import { durationToString } from '@/lib/helpers';
import { Bar, GsPTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { RegenStreamConfig, StreamType } from '@/types/config';
import { BN, formatWeiHelper } from '@/helpers/number';
import { IconFox } from '@/components/Icons/Fox';
import { IconCult } from '@/components/Icons/Cult';
import { Flex } from '../styled-components/Flex';
import { HarvestAllModal } from '../modals/HarvestAll';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { Relative } from '../styled-components/Position';
import { ArchiveAndNetworkCover } from '../ArchiveAndNetworkCover/ArchiveAndNetworkCover';

interface RegenStreamProps {
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

export const RegenStreamCard: FC<RegenStreamProps> = ({ streamConfig }) => {
	const { formatMessage } = useIntl();
	const [showModal, setShowModal] = useState(false);
	const [usdAmount, setUSDAmount] = useState('0');
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const [lockedAmount, setLockedAmount] = useState<EthBignumber>(
		constants.Zero,
	);
	const [claimedAmount, setClaimedAmount] = useState<EthBignumber>(
		constants.Zero,
	);
	const { chainId } = useWeb3React();

	const {
		title,
		tokenDistroAddress,
		tokenAddressOnUniswapV2,
		type,
		rewardTokenSymbol,
		network: streamNetwork,
		archived,
	} = streamConfig;

	const currentValues = useAppSelector(
		state =>
			streamNetwork === config.XDAI_NETWORK_NUMBER
				? state.subgraph.xDaiValues
				: state.subgraph.mainnetValues,
		() => (showModal ? true : false),
	);

	const { regenTokenDistroHelper, tokenDistroBalance } = useMemo(() => {
		const sdh = new SubgraphDataHelper(currentValues);
		const tokenDistroBalance =
			sdh.getTokenDistroBalance(tokenDistroAddress);
		const regenTokenDistroHelper = new TokenDistroHelper(
			sdh.getTokenDistro(tokenDistroAddress),
		);
		return { regenTokenDistroHelper, tokenDistroBalance };
	}, [currentValues, tokenDistroAddress]);

	const { mainnetThirdPartyTokensPrice, xDaiThirdPartyTokensPrice } =
		useAppSelector(state => state.price);

	useEffect(() => {
		const currentPrice =
			chainId === config.MAINNET_NETWORK_NUMBER
				? mainnetThirdPartyTokensPrice
				: xDaiThirdPartyTokensPrice;
		const price = new BigNumber(
			currentPrice[tokenAddressOnUniswapV2.toLowerCase()],
		);
		if (!price || price.isNaN()) return;

		const usd = formatWeiHelper(
			price.times(rewardLiquidPart.toString()).toFixed(0),
			2,
		);
		setUSDAmount(usd);
	}, [
		rewardLiquidPart,
		chainId,
		tokenAddressOnUniswapV2,
		mainnetThirdPartyTokensPrice,
		xDaiThirdPartyTokensPrice,
	]);
	useEffect(() => {
		setLockedAmount(BN(tokenDistroBalance.allocatedTokens));
		setClaimedAmount(BN(tokenDistroBalance.claimed));
	}, [tokenDistroBalance]);

	useEffect(() => {
		setRewardLiquidPart(
			regenTokenDistroHelper.getUserClaimableNow(tokenDistroBalance),
		);
		setRewardStream(
			regenTokenDistroHelper.getStreamPartTokenPerWeek(lockedAmount),
		);
	}, [lockedAmount, regenTokenDistroHelper, tokenDistroBalance]);

	const percentage = regenTokenDistroHelper?.GlobalReleasePercentage || 0;
	const remainTime = durationToString(regenTokenDistroHelper?.remain || 0);
	const icon = getStreamIconWithType(type, 40);

	return (
		<Wrapper>
			<Title>{title}</Title>
			<RegenStreamContainer>
				<InfoContainer flexDirection='column'>
					<HeaderRow justifyContent='space-between' flexWrap>
						<Flex gap='8px' style={{ position: 'relative' }}>
							{icon}
							<H5>{rewardTokenSymbol} Flowrate</H5>{' '}
						</Flex>
						<RateRow>
							<IconGIVStream size={16} />
							<StreamRate>
								{formatWeiHelper(rewardStream)}
							</StreamRate>
							<StreamRateUnit>
								{rewardTokenSymbol}
								{formatMessage({ id: 'label./week' })}
							</StreamRateUnit>
						</RateRow>
					</HeaderRow>
					<RegenStreamInfoRow>
						<Flex alignItems='flex-end' gap='6px'>
							<H6>
								{formatMessage(
									{
										id: 'label.stream_progress',
									},
									{
										token: rewardTokenSymbol,
									},
								)}
							</H6>

							<IconWithTooltip
								icon={<IconHelpFilled16 />}
								direction={'bottom'}
							>
								<GsPTooltip>
									{formatMessage(
										{
											id: 'label.liquid_reward_token_that_has_flowed',
										},
										{
											rewardTokenSymbol:
												rewardTokenSymbol,
										},
									)}
								</GsPTooltip>
							</IconWithTooltip>
						</Flex>
					</RegenStreamInfoRow>
					<Bar percentage={percentage} />
					<PercentageRow justifyContent='space-between'>
						<B>{percentage?.toFixed(2)}%</B>
						<B>100%</B>
					</PercentageRow>
					<Remaining>
						{`${formatMessage({ id: 'label.time_remaining' })}: ` +
							remainTime}
					</Remaining>
				</InfoContainer>
				<Separator />
				<HarvestContainer
					flexWrap
					gap='24px'
					justifyContent='space-between'
				>
					<div>
						<AmountInfo alignItems='flex-end' gap='4px'>
							{getStreamIconWithType(type, 24)}
							<Amount>{formatWeiHelper(rewardLiquidPart)}</Amount>
							<AmountUnit>{rewardTokenSymbol}</AmountUnit>
						</AmountInfo>
						<Converted>~${usdAmount}</Converted>
					</div>
					<HarvestButtonWrapper>
						<HarvestButton
							label={`${formatMessage({
								id: 'label.harvest',
							})} ${rewardTokenSymbol}`}
							onClick={() => setShowModal(true)}
							buttonType='primary'
							disabled={rewardLiquidPart.isZero()}
							size='large'
						/>
						<HarvestButtonDesc gap='8px'>
							<IconInfoOutline16 />
							<Caption>
								{formatMessage({
									id: 'component.regenstream_card.harvest_caption',
								})}
							</Caption>
						</HarvestButtonDesc>
					</HarvestButtonWrapper>
				</HarvestContainer>
				{showModal && (
					<HarvestAllModal
						title={formatMessage(
							{ id: 'label.token_stream_rewards' },
							{
								rewardTokenSymbol: rewardTokenSymbol,
							},
						)}
						setShowModal={setShowModal}
						regenStreamConfig={streamConfig}
					/>
				)}
				<ArchiveAndNetworkCover
					isStream={true}
					targetNetwork={streamNetwork}
					isArchived={archived}
				/>
			</RegenStreamContainer>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-bottom: 74px;
`;

const Title = styled(H4)`
	margin-bottom: 16px;
`;

const ResponsiveFlex = styled(Flex)`
	flex-direction: column;
	align-items: center;
	${mediaQueries.tablet} {
		align-items: unset;
		flex-direction: row;
	}
`;

const RegenStreamContainer = styled(Flex)`
	padding: 32px 24px;
	background-color: ${brandColors.giv[700]};
	border-radius: 8px;
	position: relative;
	justify-content: stretch;
	overflow: hidden;
	gap: 32px;
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

const InfoContainer = styled(Flex)`
	align-items: center;
	${mediaQueries.tablet} {
		width: calc(100% - 33px);
		overflow: hidden;
		align-items: unset;
	}
`;

const HeaderRow = styled(ResponsiveFlex)`
	margin-bottom: 20px;
`;

const PercentageRow = styled(Flex)`
	width: 100%;
`;

const RateRow = styled(Flex)`
	gap: 8px;
	align-items: center;
	overflow: hidden;
`;

const StreamRate = styled(B)``;

const StreamRateUnit = styled(P)`
	color: ${brandColors.giv[200]};
`;

const RegenStreamInfoRow = styled(Flex)`
	justify-content: space-between;
`;

const Remaining = styled(P)``;

const Separator = styled.div`
	display: none;
	${mediaQueries.laptopS} {
		display: block;
		width: 1px;
		background-color: ${brandColors.giv[500]};
	}
`;

const HarvestContainer = styled(ResponsiveFlex)`
	${mediaQueries.tablet} {
		width: calc(100% - 33px);
		overflow: hidden;
	}
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

const HarvestButtonWrapper = styled(Relative)``;

const HarvestButton = styled(Button)`
	width: auto;
	min-width: 320px;
	& > span {
		text-overflow: ellipsis;
	}
	margin-bottom: 64px;
`;

const HarvestButtonDesc = styled(Flex)`
	position: absolute;
	bottom: 0px;
`;
