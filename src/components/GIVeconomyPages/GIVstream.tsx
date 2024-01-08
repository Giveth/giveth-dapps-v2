import { FC, Fragment, useEffect, useRef, useState } from 'react';

import {
	B,
	brandColors,
	H1,
	H3,
	H6,
	IconGIVBack,
	IconGIVFarm,
	IconGIVGarden,
	IconGIVStream,
	IconHelpFilled16,
	IconPraise24,
	IconSpark,
	P,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Container, Row, Col } from '@giveth/ui-design-system';
import { useAccount, useNetwork } from 'wagmi';
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
	IncreaseSection,
	IncreaseSectionTitle,
	NoData,
	PercentageRow,
	TxHash,
	TxSpan,
	TitleCol,
	GridWrapper,
} from './GIVstream.sc';
import { IconWithTooltip } from '../IconWithToolTip';
import { getHistory } from '@/services/subgraph.service';
import { formatWeiHelper } from '@/helpers/number';
import config from '@/configuration';
import { durationToString, shortenAddress } from '@/lib/helpers';
import { NetworkSelector } from '@/components/NetworkSelector';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { HarvestAllModal } from '../modals/HarvestAll';
import { ITokenAllocation } from '@/types/subgraph';
import { IconGIV } from '../Icons/GIV';
import { givEconomySupportedNetworks } from '@/lib/constants/constants';
import { Flex } from '../styled-components/Flex';
import Pagination from '../Pagination';
import GivEconomyProjectCards from '../cards/GivEconomyProjectCards';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

export const TabGIVstreamTop = () => {
	const { formatMessage } = useIntl();
	const [showModal, setShowModal] = useState(false);
	const [rewardLiquidPart, setRewardLiquidPart] = useState(0n);
	const [rewardStream, setRewardStream] = useState(0n);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper(showModal);
	const currentValues = useAppSelector(
		state => state.subgraph.currentValues,
		() => (showModal ? true : false),
	);
	const sdh = new SubgraphDataHelper(currentValues);
	const { allocatedTokens, claimed, givback } =
		sdh.getGIVTokenDistroBalance();
	const { chain } = useNetwork();
	const chainId = chain?.id;

	useEffect(() => {
		const _allocatedTokens = BigInt(allocatedTokens);
		const _givback = BigInt(givback);
		const _claimed = BigInt(claimed);

		setRewardLiquidPart(
			givTokenDistroHelper.getLiquidPart(_allocatedTokens - _givback) -
				_claimed,
		);
		setRewardStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(
				_allocatedTokens - _givback,
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
								{formatMessage({
									id: 'label.welcome_to_the_expanding_giviverse',
								})}
							</GSSubtitle>
						</TitleCol>
						<Col xs={12} sm={5} xl={4}>
							<GIVstreamRewardCard
								cardName='GIVstream'
								liquidAmount={rewardLiquidPart}
								stream={rewardStream}
								actionLabel={formatMessage({
									id: 'label.harvest',
								})}
								actionCb={() => {
									setShowModal(true);
								}}
								network={chainId}
								targetNetworks={[
									{
										networkId:
											config.MAINNET_NETWORK_NUMBER,
										chainType:
											config.MAINNET_CONFIG.chainType!,
									},
									{
										networkId: config.GNOSIS_NETWORK_NUMBER,
										chainType:
											config.GNOSIS_CONFIG.chainType!,
									},
									{
										networkId:
											config.OPTIMISM_NETWORK_NUMBER,
										chainType:
											config.OPTIMISM_CONFIG.chainType!,
									},
								]}
								title='Your GIVstream Rewards'
							/>
						</Col>
					</Row>
				</GIVstreamTopInnerContainer>
			</GIVstreamTopContainer>
			{showModal && chainId && (
				<HarvestAllModal
					title='GIVstream Rewards'
					setShowModal={setShowModal}
				/>
			)}
		</>
	);
};

export const TabGIVstreamBottom = () => {
	const { chain } = useNetwork();
	const chainId = chain?.id;
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const { formatMessage } = useIntl();

	const [percent, setPercent] = useState(0);
	const [remain, setRemain] = useState('');
	useState(0n);
	const [streamAmount, setStreamAmount] = useState(0n);
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.currentValues),
	);
	const givTokenDistroBalance = sdh.getGIVTokenDistroBalance();
	const increaseSecRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const _allocatedTokens = BigInt(givTokenDistroBalance.allocatedTokens);
		const _givback = BigInt(givTokenDistroBalance.givback);

		setStreamAmount(
			givTokenDistroHelper.getStreamPartTokenPerWeek(
				_allocatedTokens - _givback,
			),
		);
	}, [
		givTokenDistroBalance.allocatedTokens,
		givTokenDistroBalance.givback,
		givTokenDistroHelper,
	]);

	useEffect(() => {
		const _remain = durationToString(givTokenDistroHelper.remain);
		setRemain(_remain);
		setPercent(givTokenDistroHelper.GlobalReleasePercentage);
	}, [givTokenDistroHelper]);
	return (
		<GIVstreamBottomContainer>
			<Container>
				<div id='flowRate'></div>
				<NetworkSelector />
				<FlowRateRow alignItems='baseline' gap='8px' flexWrap>
					<H3 weight={700}>
						{formatMessage({ id: 'label.your_flowrate' })}:
					</H3>
					<IconGIVStream size={64} />
					<H1>
						{chainId &&
						givEconomySupportedNetworks.includes(chainId)
							? formatWeiHelper(streamAmount.toString())
							: '0'}
					</H1>
					<FlowRateUnit>
						GIV{formatMessage({ id: 'label./week' })}
					</FlowRateUnit>
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction={'top'}
					>
						<FlowRateTooltip>
							{formatMessage({
								id: 'label.the_rate_at_which_you_receive_liquid_giv',
							})}
						</FlowRateTooltip>
					</IconWithTooltip>
				</FlowRateRow>
				<GIVstreamProgress percentage={percent} remainTime={remain} />
				<Row>
					<Col xs={12} sm={6}>
						<GsDataBlock
							title='GIVstream'
							button={
								<GsButton
									isExternal
									label={formatMessage({
										id: 'label.learn_more',
									})}
									linkType='secondary'
									size='large'
									target='_blank'
									href='https://docs.giveth.io/giveconomy/givstream'
								/>
							}
						>
							{formatMessage({
								id: 'label.your_givstream_provides_a_continous_flow_until_2026',
							})}
						</GsDataBlock>
					</Col>
					<Col xs={12} sm={6}>
						<GsDataBlock title='Expanding GIViverse'>
							{formatMessage({
								id: 'label.the_giveconomy_begins_humbly',
							})}
						</GsDataBlock>
					</Col>
				</Row>
				<HistoryTitleRow>
					<HistoryTitle>
						{formatMessage({ id: 'label.history' })}
					</HistoryTitle>
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction={'top'}
					>
						<HistoryTooltip>
							{formatMessage({
								id: 'label.everytime_you_claim_giv_rewards',
							})}
						</HistoryTooltip>
					</IconWithTooltip>
				</HistoryTitleRow>
				<GIVstreamHistory />
			</Container>
			<IncreaseSection ref={increaseSecRef}>
				<Container>
					<IncreaseSectionTitle>
						{formatMessage({ id: 'label.increase_your_givstream' })}
						<IconSpark size={32} color={brandColors.mustard[500]} />
					</IncreaseSectionTitle>
					<GivEconomyProjectCards />
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
	const { formatMessage } = useIntl();
	return (
		<GIVstreamProgressContainer>
			<GsPTitleRow justifyContent='space-between'>
				<GsPTitle alignItems='center' gap='8px'>
					<H6>
						{formatMessage({ id: 'label.giviverse_expansion' })}
					</H6>
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction={'bottom'}
					>
						<GsPTooltip>
							{formatMessage({
								id: 'label.liquid_giv_that_has_already_flowed',
							})}
						</GsPTooltip>
					</IconWithTooltip>
				</GsPTitle>
				<P>
					{`${formatMessage({ id: 'label.time_remaining' })}: ` +
						remainTime}
				</P>
			</GsPTitleRow>
			<Bar percentage={percentage} />
			<PercentageRow justifyContent='space-between'>
				<B>{percentage?.toFixed(2)}%</B>
				<B>100%</B>
			</PercentageRow>
		</GIVstreamProgressContainer>
	);
};

const convertSourceTypeToIcon = (distributor: string) => {
	switch (distributor.toLowerCase()) {
		case 'givback':
			return (
				<Flex gap='16px'>
					<IconGIVBack size={24} color={brandColors.mustard[500]} />
					<P>{` GIVbacks`}</P>
				</Flex>
			);
		case 'unipool':
		case 'uniswapv3':
			return (
				<Flex gap='16px'>
					<IconGIVFarm size={24} color={brandColors.mustard[500]} />
					<P>{` GIVfarm`}</P>
				</Flex>
			);
		case 'gardenpool':
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
		case 'praise':
			return (
				<Flex gap='16px'>
					<IconPraise24 color={brandColors.mustard[500]} />
					<P>{` Praise`}</P>
				</Flex>
			);

		default:
			// 'Unknown' we show givfarm instead of unknown for exploit farms
			// https://github.com/Giveth/giveth-dapps-v2/issues/1796
			return (
				<Flex gap='16px'>
					<IconGIVFarm size={24} color={brandColors.mustard[500]} />
					<P>{` GIVfarm`}</P>
				</Flex>
			);
	}
};

const itemPerPage = 6;

export const GIVstreamHistory: FC = () => {
	const { chain } = useNetwork();
	const chainId = chain?.id;
	const { address } = useAccount();
	const [tokenAllocations, setTokenAllocations] = useState<
		ITokenAllocation[]
	>([]);
	const { formatMessage, locale } = useIntl();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const currentValue = useAppSelector(state => state.subgraph.currentValues);
	const sdh = new SubgraphDataHelper(currentValue);
	const { allocationCount } = sdh.getGIVTokenDistroBalance();

	const { givTokenDistroHelper } = useGIVTokenDistroHelper();

	useEffect(() => {
		setPage(0);
	}, [chainId, address]);

	useEffect(() => {
		if (chainId && address) {
			setLoading(true);
			getHistory(chainId, address, page * itemPerPage, itemPerPage).then(
				_tokenAllocations => {
					setTokenAllocations(_tokenAllocations);
					setLoading(false);
				},
			);
		}
	}, [chainId, address, page]);

	return (
		<HistoryContainer>
			<GridWrapper>
				<Grid>
					<B as='span'>
						{formatMessage({ id: 'label.givstream_source' })}
					</B>
					<B as='span'>
						{formatMessage({ id: 'label.flowrate_change' })}
					</B>
					<B as='span'>{formatMessage({ id: 'label.date' })}</B>
					<B as='span'>{formatMessage({ id: 'label.tx' })}</B>
				</Grid>
				{tokenAllocations && tokenAllocations.length > 0 && (
					<Grid>
						{tokenAllocations.map((tokenAllocation, idx) => {
							const d = new Date(
								+`${tokenAllocation.timestamp}000`,
							);
							const date = d.toLocaleDateString(locale, {
								day: 'numeric',
								year: 'numeric',
								month: 'short',
							});
							return (
								// <span key={idx}>1</span>
								<Fragment key={idx}>
									<P as='span'>
										{convertSourceTypeToIcon(
											tokenAllocation.distributor ||
												'Unknown',
										)}
										{/* {tokenAllocation.distributor || 'Unknown'} */}
									</P>
									<B as='span'>
										+
										{formatWeiHelper(
											givTokenDistroHelper
												.getStreamPartTokenPerWeek(
													BigInt(
														tokenAllocation.amount,
													),
												)
												.toString(),
										)}
										<GsHFrUnit as='span'>{` GIV${formatMessage(
											{ id: 'label./week' },
										)}`}</GsHFrUnit>
									</B>
									<P as='span'>{date}</P>
									{chainId && (
										<TxSpan>
											<TxHash
												as='a'
												size='Big'
												href={`${config.EVM_NETWORKS_CONFIG[chainId]?.blockExplorers?.default.url}/tx/${tokenAllocation.txHash}`}
												target='_blank'
											>
												{shortenAddress(
													tokenAllocation.txHash,
												)}
											</TxHash>
										</TxSpan>
									)}
								</Fragment>
							);
						})}
					</Grid>
				)}
			</GridWrapper>
			{(!tokenAllocations || tokenAllocations.length == 0) && (
				<NoData> NO DATA</NoData>
			)}
			<Pagination
				currentPage={page}
				totalCount={+allocationCount}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
			{loading && <HistoryLoading />}
		</HistoryContainer>
	);
};
