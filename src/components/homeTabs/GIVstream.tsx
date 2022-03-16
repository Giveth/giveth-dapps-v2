import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
	B,
	brandColors,
	DataBlock,
	H1,
	H3,
	H6,
	IconGIVBack,
	IconGIVFarm,
	IconGIVGarden,
	IconGIVStream,
	IconHelp,
	IconSpark,
	P,
} from '@giveth/ui-design-system';
import {
	Bar,
	FlowRateRow,
	FlowRateTooltip,
	FlowRateUnit,
	GIVstreamTopContainer,
	GIVstreamProgressContainer,
	GIVstreamRewardCard,
	GIVstreamBottomContainer,
	GIVstreamTopInnerContainer,
	Grid,
	GsButton,
	GsDataBlock,
	GsHFrUnit,
	GsPTitle,
	GsPTitleRow,
	GsPTooltip,
	GSSubtitle,
	GSTitle,
	HistoryContainer,
	HistoryLoading,
	HistoryTitle,
	HistoryTitleRow,
	HistoryTooltip,
	IGsDataBox,
	IncreaseSection,
	IncreaseSectionTitle,
	NoData,
	PercentageRow,
	TxHash,
	TxSpan,
	TitleCol,
} from './GIVstream.sc';
import { IconWithTooltip } from '../IconWithToolTip';
import { getHistory } from '@/services/subgraph.service';
import { formatWeiHelper } from '@/helpers/number';
import config from '@/configuration';
import { DurationToString } from '@/lib/helpers';
import { NetworkSelector } from '@/components/NetworkSelector';
import { constants, ethers } from 'ethers';
import { useTokenDistro } from '@/context/tokenDistro.context';
import BigNumber from 'bignumber.js';
import { HarvestAllModal } from '../modals/HarvestAll';
import { Zero } from '@ethersproject/constants';
import { useSubgraph } from '@/context';
import { ITokenAllocation } from '@/types/subgraph';
import { TopFiller } from './commons';
import { useWeb3React } from '@web3-react/core';
import { IconGIV } from '../Icons/GIV';
import { givEconomySupportedNetworks } from '@/utils/constants';
import RegenStreamBlock from '../RegenStreamBlock';
import { Flex } from '../styled-components/Flex';
import Pagination from '../Pagination';
import Routes from '@/lib/constants/Routes';
import { Container, Row, Col } from '@/components/Grid';

export const TabGIVstreamTop = () => {
	const [showModal, setShowModal] = useState(false);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { givTokenDistroHelper } = useTokenDistro();
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { allocatedTokens, claimed, givback } = balances;
	const { chainId } = useWeb3React();

	useEffect(() => {
		setRewardLiquidPart(
			givTokenDistroHelper
				.getLiquidPart(allocatedTokens.sub(givback))
				.sub(claimed),
		);
		setRewardStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(
				allocatedTokens.sub(givback),
			),
		);
	}, [allocatedTokens, claimed, givback, givTokenDistroHelper]);

	return (
		<>
			<GIVstreamTopContainer>
				<GIVstreamTopInnerContainer>
					<Row style={{ alignItems: 'flex-end' }}>
						<TitleCol xs={12} sm={7} xl={8}>
							<Flex alignItems='baseline' gap='16px'>
								<GSTitle>GIVstream</GSTitle>
								<IconGIVStream size={64} />
							</Flex>
							<GSSubtitle size='medium'>
								Welcome to the expanding GIViverse! The
								GIVstream aligns community members with the long
								term success of Giveth and the GIVeconomy.
							</GSSubtitle>
						</TitleCol>
						<Col xs={12} sm={5} xl={4}>
							<GIVstreamRewardCard
								wrongNetworkText='GIVstream is only available on Mainnet and Gnosis Chain.'
								liquidAmount={rewardLiquidPart}
								stream={rewardStream}
								actionLabel='HARVEST'
								actionCb={() => {
									setShowModal(true);
								}}
								network={chainId}
								targetNetworks={[
									config.MAINNET_NETWORK_NUMBER,
									config.XDAI_NETWORK_NUMBER,
								]}
							/>
						</Col>
					</Row>
				</GIVstreamTopInnerContainer>
			</GIVstreamTopContainer>
			{showModal && chainId && (
				<HarvestAllModal
					title='GIVstream Rewards'
					showModal={showModal}
					setShowModal={setShowModal}
					network={chainId}
				/>
			)}
		</>
	);
};

export const TabGIVstreamBottom = () => {
	const { chainId } = useWeb3React();
	const { givTokenDistroHelper } = useTokenDistro();

	const [percent, setPercent] = useState(0);
	const [remain, setRemain] = useState('');
	useState<ethers.BigNumber>(Zero);
	const [streamAmount, setStreamAmount] = useState<BigNumber>(
		new BigNumber(0),
	);
	const {
		currentValues: { balances },
	} = useSubgraph();
	const increaseSecRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setStreamAmount(
			givTokenDistroHelper.getStreamPartTokenPerWeek(
				balances.allocatedTokens.sub(balances.givback),
			),
		);
	}, [balances.allocatedTokens, balances.givback, givTokenDistroHelper]);

	useEffect(() => {
		setPercent(givTokenDistroHelper.percent);
		const _remain = DurationToString(givTokenDistroHelper.remain);
		setRemain(_remain);
	}, [givTokenDistroHelper]);
	return (
		<GIVstreamBottomContainer>
			<Container>
				<NetworkSelector />
				<FlowRateRow alignItems='baseline' gap='8px'>
					<H3 id='flowRate' weight={700}>
						Your Flowrate:
					</H3>
					<IconGIVStream size={64} />
					<H1>
						{chainId &&
						givEconomySupportedNetworks.includes(chainId)
							? formatWeiHelper(streamAmount)
							: '0'}
					</H1>
					<FlowRateUnit>GIV/week</FlowRateUnit>
					<IconWithTooltip
						icon={<IconHelp size={16} />}
						direction={'top'}
					>
						<FlowRateTooltip>
							The rate at which you receive liquid GIV from your
							GIVstream.
						</FlowRateTooltip>
					</IconWithTooltip>
				</FlowRateRow>
				<GIVstreamProgress percentage={percent} remainTime={remain} />
				<RegenStreamBlock />
				<HistoryTitleRow>
					<HistoryTitle>History</HistoryTitle>
					<IconWithTooltip
						icon={<IconHelp size={16} />}
						direction={'top'}
					>
						<HistoryTooltip>
							Every time you claim GIV rewards from GIVbacks, the
							GIVgarden, or the GIVfarm, your GIVstream flowrate
							increases. Below is a summary.
						</HistoryTooltip>
					</IconWithTooltip>
				</HistoryTitleRow>
				<GIVstreamHistory />
				<Row>
					<Col xs={12} sm={6}>
						<GsDataBlock
							title='GIVstream'
							button={
								<GsButton
									label='LEARN MORE'
									linkType='secondary'
									size='large'
									target='_blank'
									href='https://docs.giveth.io/giveconomy/givstream'
								/>
							}
						>
							Your GIVstream provides a continuous flow of
							claimable GIV until December 23, 2026. Anyone can
							get or increase their GIVstream by participating in
							the GIVeconomy.
						</GsDataBlock>
					</Col>
					<Col xs={12} sm={6}>
						<GsDataBlock title='Expanding GIViverse'>
							The GIVeconomy begins humbly but as time passes, the
							GIViverse expands and more GIV flows from GIVstream.
							This way, as the GIVeconomy grows, so do the
							governance rights of our community.
						</GsDataBlock>
					</Col>
				</Row>
			</Container>
			<IncreaseSection ref={increaseSecRef}>
				<Container>
					<IncreaseSectionTitle>
						Increase your GIVstream
						<IconSpark size={32} color={brandColors.mustard[500]} />
					</IncreaseSectionTitle>
					<Row>
						<Col xs={12} sm={6} md={4}>
							<IGsDataBox
								title='GIVbacks'
								button={
									<GsButton
										label='SEE PROJECTS'
										linkType='primary'
										size='medium'
										href='https://giveth.io/projects'
										target='_blank'
									/>
								}
							>
								Donate to verified projects on Giveth. Get GIV
								and increase your GIVstream with the GIVbacks
								program.
							</IGsDataBox>
						</Col>
						<Col xs={12} sm={6} md={4}>
							<IGsDataBox
								title='GIVgarden'
								button={
									<GsButton
										label='SEE PROPOSALS'
										linkType='primary'
										size='medium'
										href={config.GARDEN_LINK}
										target='_blank'
									/>
								}
							>
								The GIVgarden is the decentralized governance
								platform for the GIVeconomy. Increase your
								GIVstream when you wrap GIV to vote.
							</IGsDataBox>
						</Col>
						<Col xs={12} sm={6} md={4}>
							<IGsDataBox
								title='GIVfarm'
								button={
									<Link href={Routes.GIVfarm} passHref>
										<GsButton
											label='SEE OPPORTUNITIES'
											linkType='primary'
											size='medium'
										/>
									</Link>
								}
							>
								Stake GIV, or become a liquidity provider and
								stake LP tokens in the GIVfarm. Get GIV rewards
								and increase your GIVstream.
							</IGsDataBox>
						</Col>
					</Row>
				</Container>
			</IncreaseSection>
		</GIVstreamBottomContainer>
	);
};

interface IGIVstreamProgressProps {
	percentage?: number;
	remainTime?: string;
}

export const GIVstreamProgress: FC<IGIVstreamProgressProps> = ({
	percentage = 0,
	remainTime = '',
}) => {
	return (
		<GIVstreamProgressContainer>
			<GsPTitleRow justifyContent='space-between'>
				<GsPTitle alignItems='center' gap='8px'>
					<H6>GIViverse Expansion</H6>
					<IconWithTooltip
						icon={<IconHelp size={16} />}
						direction={'right'}
					>
						<GsPTooltip>
							Time left for all GIVstreams to flow & for the
							GIViverse to reach full power!
						</GsPTooltip>
					</IconWithTooltip>
				</GsPTitle>
				<P>{`Time remaining: ` + remainTime}</P>
			</GsPTitleRow>
			<Bar percentage={percentage} />
			<PercentageRow justifyContent='space-between'>
				<B>{percentage?.toFixed(2)}%</B>
				<B>100%</B>
			</PercentageRow>
		</GIVstreamProgressContainer>
	);
};

const convetSourceTypeToIcon = (distributor: string) => {
	switch (distributor.toLowerCase()) {
		case 'givback':
			return (
				<Flex gap='16px'>
					<IconGIVBack size={24} color={brandColors.mustard[500]} />
					<P>{` GIVbacks`}</P>
				</Flex>
			);
		case 'balancerlm':
		case 'balancerlp':
		case 'shushiswaplp':
		case 'honeyswaplp':
		case 'givlm':
		case 'giveth':
		case 'givhnypool':
		case 'uniswappool':
			return (
				<Flex gap='16px'>
					<IconGIVFarm size={24} color={brandColors.mustard[500]} />
					<P>{` GIVfarm`}</P>
				</Flex>
			);
		case 'gardenPool':
			return (
				<Flex gap='16px'>
					<IconGIVGarden size={24} color={brandColors.mustard[500]} />
					<P>{` GIVgarden`}</P>
				</Flex>
			);
		case 'givdrop':
			return (
				<Flex gap='16px'>
					<IconGIV size={24} />
					<P>{` GIVdrop`}</P>
				</Flex>
			);
		default:
			return distributor; //'Unknown'
			break;
	}
};

const itemPerPage = 6;

export const GIVstreamHistory: FC = () => {
	const { chainId, account } = useWeb3React();
	const [tokenAllocations, setTokenAllocations] = useState<
		ITokenAllocation[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { allocationCount } = balances;

	const { givTokenDistroHelper } = useTokenDistro();

	useEffect(() => {
		setPage(0);
	}, [chainId, account]);

	useEffect(() => {
		if (chainId && account) {
			setLoading(true);
			getHistory(chainId, account, page * itemPerPage, itemPerPage).then(
				_tokenAllocations => {
					setTokenAllocations(_tokenAllocations);
					setLoading(false);
				},
			);
		}
	}, [chainId, account, page]);

	return (
		<HistoryContainer>
			<Grid>
				<B as='span'>GIVstream Source</B>
				<B as='span'>Flowrate Change</B>
				<B as='span'>Date</B>
				<B as='span'>Tx</B>
			</Grid>
			{tokenAllocations && tokenAllocations.length > 0 && (
				<Grid>
					{tokenAllocations.map((tokenAllocation, idx) => {
						const d = new Date(+`${tokenAllocation.timestamp}000`);
						const date = d
							.toDateString()
							.split(' ')
							.splice(1, 3)
							.join(' ');
						return (
							// <span key={idx}>1</span>
							<Fragment key={idx}>
								<P as='span'>
									{convetSourceTypeToIcon(
										tokenAllocation.distributor ||
											'Unknown',
									)}
									{/* {tokenAllocation.distributor || 'Unknown'} */}
								</P>
								<B as='span'>
									+
									{formatWeiHelper(
										givTokenDistroHelper.getStreamPartTokenPerWeek(
											ethers.BigNumber.from(
												tokenAllocation.amount,
											),
										),
									)}
									<GsHFrUnit as='span'>{` GIV/week`}</GsHFrUnit>
								</B>
								<P as='span'>{date}</P>
								{chainId && (
									<TxSpan>
										<TxHash
											size='Big'
											href={`${config.NETWORKS_CONFIG[chainId]?.blockExplorerUrls}/tx/${tokenAllocation.txHash}`}
											target='_blank'
										>
											{tokenAllocation.txHash}
										</TxHash>
									</TxSpan>
								)}
							</Fragment>
						);
					})}
				</Grid>
			)}
			{(!tokenAllocations || tokenAllocations.length == 0) && (
				<NoData> NO DATA</NoData>
			)}
			<Pagination
				currentPage={page}
				totalCount={allocationCount}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
			{loading && <HistoryLoading />}
		</HistoryContainer>
	);
};
