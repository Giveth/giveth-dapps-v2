import React, { useState, useEffect, useMemo } from 'react';
import {
	IconExternalLink,
	P,
	brandColors,
	Col,
	Container,
	Row,
	Flex,
	IconGIVBack64,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import {
	GIVbacksTopContainer,
	GIVbacksBottomContainer,
	GIVbackRewardCard,
	GBSubtitle,
	GBTitle,
	GIVBackCard,
	RoundSection,
	RoundTitle,
	RoundInfo,
	RoundInfoTallRow,
	RoundButton,
	InfoSection,
	InfoImage,
	ImageWrapper,
	InfoTitle,
	InfoDesc,
	GivAllocated,
	InfoReadMore,
} from './GIVbacks.sc';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import config from '@/configuration';
import { HarvestAllModal } from '../modals/HarvestAll';
import { getNowUnixMS } from '@/helpers/time';
import { formatDate } from '@/lib/helpers';
import { GIVBackExplainModal } from '../modals/GIVBackExplain';
import { NoWrap, TopInnerContainer } from './commons';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { fetchSubgraphData } from '@/services/subgraph.service';
import { FETCH_ALLOCATED_GIVBACKS } from '@/apollo/gql/gqlGivbacks';
import { client } from '@/apollo/apolloClient';

export const TabGIVbacksTop = () => {
	const { formatMessage } = useIntl();
	const [showHarvestModal, setShowHarvestModal] = useState(false);
	const [showGivBackExplain, setShowGivBackExplain] = useState(false);
	const [givBackStream, setGivBackStream] = useState(0n);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper(showHarvestModal);
	const { chain, address } = useAccount();
	const dataChainId =
		chain?.id === config.OPTIMISM_NETWORK_NUMBER
			? config.OPTIMISM_NETWORK_NUMBER
			: config.GNOSIS_NETWORK_NUMBER;
	const values = useQuery({
		queryKey: ['subgraph', dataChainId, address],
		queryFn: async () => await fetchSubgraphData(dataChainId, address),
		enabled: !!chain,
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
	const givTokenDistroBalance = useMemo(() => {
		const sdh = new SubgraphDataHelper(values.data);
		return sdh.getGIVTokenDistroBalance();
	}, [values]);

	const givbackLiquidPart = BigInt(givTokenDistroBalance.givbackLiquidPart);

	useEffect(() => {
		setGivBackStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(givbackLiquidPart),
		);
	}, [givTokenDistroBalance, givTokenDistroHelper, givbackLiquidPart]);

	return (
		<>
			<GIVbacksTopContainer>
				<TopInnerContainer>
					<Row style={{ alignItems: 'flex-end' }}>
						<Col xs={12} sm={7} xl={8}>
							<Flex $alignItems='baseline' gap='16px'>
								<GBTitle>GIVbacks</GBTitle>
								<IconGIVBack64 />
							</Flex>
							<GBSubtitle size='medium'>
								{formatMessage({
									id: 'label.givbacks_rewards_donors_to_verified_projects',
								})}
							</GBSubtitle>
						</Col>
						<Col xs={12} sm={5} xl={4}>
							<GIVbackRewardCard
								cardName='GIVbacks'
								title={formatMessage({
									id: 'label.your_givbacks_rewards',
								})}
								liquidAmount={givbackLiquidPart}
								stream={givBackStream}
								actionLabel={formatMessage({
									id: 'label.harvest',
								})}
								actionCb={() => {
									setShowHarvestModal(true);
								}}
								network={chain?.id}
								targetNetworks={[
									{
										networkId: config.GNOSIS_NETWORK_NUMBER,
										chainType:
											config.GNOSIS_CONFIG.chainType,
									},
									{
										networkId:
											config.OPTIMISM_NETWORK_NUMBER,
										chainType:
											config.OPTIMISM_CONFIG.chainType,
									},
									{
										networkId: config.ZKEVM_NETWORK_NUMBER,
										chainType:
											config.ZKEVM_CONFIG.chainType,
									},
								]}
							/>
						</Col>
					</Row>
				</TopInnerContainer>
			</GIVbacksTopContainer>
			{showHarvestModal && (
				<HarvestAllModal
					title={formatMessage({ id: 'label.givbacks_rewards' })}
					setShowModal={setShowHarvestModal}
				/>
			)}
			{showGivBackExplain && (
				<GIVBackExplainModal setShowModal={setShowGivBackExplain} />
			)}
		</>
	);
};

export const TabGIVbacksBottom = () => {
	const { formatMessage, locale } = useIntl();
	const [round, setRound] = useState(0);
	const [roundStarTime, setRoundStarTime] = useState(new Date());
	const [roundEndTime, setRoundEndTime] = useState(new Date());
	// Define an interface for the type of givbackAllocations
	interface GivbackAllocations {
		usdValueSentAmountInPowerRound: number;
		allocatedGivTokens: number;
		givPrice: number;
		date: string;
	}
	const [givbackAllocations, setGivbackAllocations] =
		useState<GivbackAllocations | null>(null);

	useEffect(() => {
		async function fetchAllocatedGivbacks() {
			const { data } = await client.query({
				query: FETCH_ALLOCATED_GIVBACKS,
				fetchPolicy: 'network-only',
			});
			setGivbackAllocations(data?.allocatedGivbacks);
		}
		fetchAllocatedGivbacks();
	}, []);

	const { givTokenDistroHelper, isLoaded } = useGIVTokenDistroHelper();
	useEffect(() => {
		if (
			givTokenDistroHelper &&
			givTokenDistroHelper.startTime.getTime() !== 0
		) {
			const now = getNowUnixMS();
			const ROUND_20_OFFSET = 4; // At round 20 we changed the rounds from Fridays to Tuesdays
			const startTime = new Date(givTokenDistroHelper.startTime);
			startTime.setDate(startTime.getDate() + ROUND_20_OFFSET);
			const deltaT = now - startTime.getTime();
			const TwoWeek = 1_209_600_000;
			const _round = Math.floor(deltaT / TwoWeek) + 1;
			setRound(_round);
			const _roundEndTime = new Date(startTime);
			_roundEndTime.setDate(startTime.getDate() + _round * 14);
			_roundEndTime.setHours(startTime.getHours());
			_roundEndTime.setMinutes(startTime.getMinutes());
			setRoundEndTime(_roundEndTime);
			const _roundStartTime = new Date(_roundEndTime);
			_roundStartTime.setDate(_roundEndTime.getDate() - 14);
			setRoundStarTime(_roundStartTime);
		}
	}, [givTokenDistroHelper, isLoaded]);

	return (
		<GIVbacksBottomContainer>
			<Container>
				<GIVBackCard>
					<Row>
						<Col xs={12} md={8}>
							<RoundSection>
								<RoundTitle>
									GIVbacks{' '}
									<NoWrap>
										{formatMessage({ id: 'label.round' })}{' '}
										{isLoaded ? round : '--'}
									</NoWrap>
								</RoundTitle>
								<RoundInfo>
									<RoundInfoTallRow
										$justifyContent='space-between'
										$alignItems='center'
										$flexWrap
									>
										{' '}
										<P>
											<NoWrap>
												{formatMessage({
													id: 'label.start_date',
												})}
											</NoWrap>
										</P>
										<P>
											<NoWrap>
												{isLoaded
													? formatDate(
															roundStarTime,
															locale,
														)
													: '--'}
											</NoWrap>
										</P>
									</RoundInfoTallRow>
									<RoundInfoTallRow
										$justifyContent='space-between'
										$alignItems='center'
										$flexWrap
									>
										<P>
											<NoWrap>
												{formatMessage({
													id: 'label.end_date',
												})}
											</NoWrap>
										</P>
										<P>
											<NoWrap>
												{isLoaded
													? formatDate(
															roundEndTime,
															locale,
														)
													: '--'}
											</NoWrap>
										</P>
									</RoundInfoTallRow>
									<RoundInfoTallRow
										$justifyContent='space-between'
										$alignItems='center'
										$flexWrap
									>
										<P>
											<NoWrap>
												{formatMessage({
													id: 'label.giv_allocated_to_round',
												})}
											</NoWrap>
										</P>
										<GivAllocated>
											<NoWrap>
												{givbackAllocations &&
												givbackAllocations.allocatedGivTokens
													? `${givbackAllocations.allocatedGivTokens} GIV`
													: 'TBD'}
											</NoWrap>
										</GivAllocated>
									</RoundInfoTallRow>
									<Link href={Routes.AllProjects}>
										<RoundButton
											size='small'
											label={formatMessage({
												id: 'label.donate_to_earn_giv',
											})}
											linkType='primary'
										/>
									</Link>
								</RoundInfo>
							</RoundSection>
						</Col>
						<Col xs={12} md={4}>
							<InfoSection>
								<ImageWrapper>
									<InfoImage
										src='/images/hands.svg'
										alt='hands image'
										width={216}
										height={103}
										objectFit='cover'
									/>
								</ImageWrapper>
								<InfoTitle weight={700}>
									{formatMessage({
										id: 'label.when_you_giv_you_get_giv_back',
									})}
								</InfoTitle>
								<InfoDesc>
									{formatMessage({
										id: 'label.each_givbacks_round_lasts_two_weeks',
									})}
								</InfoDesc>
								<InfoReadMore
									as='a'
									target='_blank'
									href={links.GIVBACK_DOC}
								>
									<span>
										{formatMessage({
											id: 'label.read_more',
										})}{' '}
									</span>
									<IconExternalLink
										size={16}
										color={brandColors.cyan[500]}
									/>
								</InfoReadMore>
							</InfoSection>
						</Col>
					</Row>
				</GIVBackCard>
			</Container>
		</GIVbacksBottomContainer>
	);
};
