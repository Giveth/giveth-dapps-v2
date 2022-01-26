import React, {
	FC,
	Fragment,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import Link from 'next/link';
import { Row } from '../styled-components/Grid';
import {
	B,
	brandColors,
	Container,
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
	GIVbacksBottomContainer,
	GIVstreamProgressContainer,
	GIVstreamRewardCard,
	GIVstreamTopContainer,
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
	Left,
	NoData,
	PaginationItem,
	PaginationRow,
	PercentageRow,
	Right,
	TxHash,
	TxSpan,
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

export const TabGIVstreamTop = () => {
	const [showModal, setShowModal] = useState(false);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { tokenDistroHelper } = useTokenDistro();
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { allocatedTokens, claimed, givback } = balances;
	const { chainId } = useWeb3React();

	useEffect(() => {
		setRewardLiquidPart(
			tokenDistroHelper
				.getLiquidPart(allocatedTokens.sub(givback))
				.sub(claimed),
		);
		setRewardStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				allocatedTokens.sub(givback),
			),
		);
	}, [allocatedTokens, claimed, givback, tokenDistroHelper]);

	return (
		<>
			<GIVstreamTopContainer>
				<GIVstreamTopInnerContainer>
					<TopFiller />
					<Row justifyContent='space-between'>
						<Left>
							<Row alignItems='baseline' gap='16px'>
								<GSTitle>GIVstream</GSTitle>
								<IconGIVStream size={64} />
							</Row>
							<GSSubtitle size='medium'>
								Welcome to the expanding GIViverse! The
								GIVstream aligns community members with the long
								term success of Giveth and the GIVeconomy.
							</GSSubtitle>
						</Left>
						<Right>
							<GIVstreamRewardCard
								wrongNetworkText='GIVstream is only available on Mainnet and xDAI.'
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
						</Right>
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
	const { tokenDistroHelper } = useTokenDistro();

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
	const supportedNetworks = [
		config.MAINNET_NETWORK_NUMBER,
		config.XDAI_NETWORK_NUMBER,
	];

	useEffect(() => {
		setStreamAmount(
			tokenDistroHelper.getStreamPartTokenPerWeek(
				balances.allocatedTokens.sub(balances.givback),
			),
		);
	}, [balances.allocatedTokens, balances.givback, tokenDistroHelper]);

	useEffect(() => {
		setPercent(tokenDistroHelper.percent);
		const _remain = DurationToString(tokenDistroHelper.remain);
		setRemain(_remain);
	}, [tokenDistroHelper]);
	return (
		<GIVbacksBottomContainer>
			<Container>
				<NetworkSelector />
				<FlowRateRow alignItems='baseline' gap='8px'>
					<H3 id='flowRate' weight={700}>
						Your Flowrate:
					</H3>
					<IconGIVStream size={64} />
					<H1>
						{chainId && supportedNetworks.includes(chainId)
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
				<Row wrap={1} justifyContent='space-between'>
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
						Your GIVstream provides a continuous flow of claimable
						GIV until December 23, 2026. Anyone can get or increase
						their GIVstream by participating in the GIVeconomy.
					</GsDataBlock>
					<GsDataBlock title='Expanding GIViverse'>
						The GIVeconomy begins humbly but as time passes, the
						GIViverse expands and more GIV flows from GIVstream.
						This way, as the GIVeconomy grows, so do the governance
						rights of our community.
					</GsDataBlock>
				</Row>
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
			</Container>
			<IncreaseSection ref={increaseSecRef}>
				<Container>
					<IncreaseSectionTitle>
						Increase your GIVstream
						<IconSpark size={32} color={brandColors.mustard[500]} />
					</IncreaseSectionTitle>
					<Row wrap={1} justifyContent='space-between'>
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
							Donate to verified projects on Giveth. Get GIV and
							increase your GIVstream with the GIVbacks program.
						</IGsDataBox>
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
							platform for the GIVeconomy. Increase your GIVstream
							when you wrap GIV to vote.
						</IGsDataBox>
						<IGsDataBox
							title='GIVfarm'
							button={
								<Link href='/givfarm' passHref>
									<GsButton
										label='SEE OPPORTUNITIES'
										linkType='primary'
										size='medium'
									/>
								</Link>
							}
						>
							Stake GIV, or become a liquidity provider and stake
							LP tokens in the GIVfarm. Get GIV rewards and
							increase your GIVstream.
						</IGsDataBox>
					</Row>
				</Container>
			</IncreaseSection>
		</GIVbacksBottomContainer>
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

export enum GIVstreamDistributor {
	Back,
	Farm,
	Garden,
}

const convetSourceTypeToIcon = (distributor: string) => {
	switch (distributor.toLowerCase()) {
		case 'givback':
			return (
				<Row gap='16px'>
					<IconGIVBack size={24} color={brandColors.mustard[500]} />
					<P>{` GIVbacks`}</P>
				</Row>
			);
		case 'balancerlm':
		case 'balancerlp':
		case 'shushiswaplp':
		case 'honeyswaplp':
		case 'givlm':
		case 'giveth':
		case 'givhnypool':
			return (
				<Row gap='16px'>
					<IconGIVFarm size={24} color={brandColors.mustard[500]} />
					<P>{` GIVfarm`}</P>
				</Row>
			);
		case 'gardenPool':
			return (
				<Row gap='16px'>
					<IconGIVGarden size={24} color={brandColors.mustard[500]} />
					<P>{` GIVgarden`}</P>
				</Row>
			);
		case 'givdrop':
			return (
				<Row gap='16px'>
					<IconGIVGarden size={24} color={brandColors.mustard[500]} />
					<P>{` GIVdrop`}</P>
				</Row>
			);
		default:
			return distributor; //'Unknown'
			break;
	}
};

export const GIVstreamHistory: FC = () => {
	const { chainId, account } = useWeb3React();
	const [tokenAllocations, setTokenAllocations] = useState<
		ITokenAllocation[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [pages, setPages] = useState<any[]>([]);
	const [numberOfPages, setNumberOfPages] = useState(0);
	const count = 6;
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { allocationCount } = balances;

	const { tokenDistroHelper } = useTokenDistro();

	useEffect(() => {
		setPage(0);
	}, [chainId, account]);

	useEffect(() => {
		if (chainId && account) {
			setLoading(true);
			getHistory(chainId, account, page * count, count).then(
				_tokenAllocations => {
					setTokenAllocations(_tokenAllocations);
					setLoading(false);
				},
			);
		}
	}, [chainId, account, page]);

	useEffect(() => {
		const nop = Math.ceil(allocationCount / count);
		let _pages: Array<string | number> = [];
		const current_page = page + 1;
		// Loop through
		for (let i = 1; i <= nop; i++) {
			// Define offset
			let offset = i == 1 || nop ? count + 1 : count;
			// If added
			if (
				i == 1 ||
				(current_page - offset <= i && current_page + offset >= i) ||
				i == current_page ||
				i == nop
			) {
				_pages.push(i);
			} else if (
				i == current_page - (offset + 1) ||
				i == current_page + (offset + 1)
			) {
				_pages.push('...');
			}
		}
		setPages(_pages);
		setNumberOfPages(nop);
	}, [allocationCount, page]);

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
										tokenDistroHelper.getStreamPartTokenPerWeek(
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
			{numberOfPages > 1 && (
				<PaginationRow justifyContent={'flex-end'} gap='16px'>
					<PaginationItem
						onClick={() => {
							if (page > 0) setPage(page => page - 1);
						}}
						disable={page == 0}
					>
						{'<  Prev'}
					</PaginationItem>
					{pages.map((p, id) => {
						return (
							<PaginationItem
								key={id}
								onClick={() => {
									if (!isNaN(+p)) setPage(+p - 1);
								}}
								isActive={+p - 1 === page}
							>
								{p}
							</PaginationItem>
						);
					})}
					<PaginationItem
						onClick={() => {
							if (page + 1 < numberOfPages)
								setPage(page => page + 1);
						}}
						disable={page + 1 >= numberOfPages}
					>
						{'Next  >'}
					</PaginationItem>
				</PaginationRow>
			)}
			{loading && <HistoryLoading></HistoryLoading>}
		</HistoryContainer>
	);
};
