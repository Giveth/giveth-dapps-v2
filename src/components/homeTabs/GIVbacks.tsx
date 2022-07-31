import React, { useState, useEffect, useMemo } from 'react';
import {
	IconExternalLink,
	IconGIVBack,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { Flex } from '../styled-components/Flex';
import {
	GIVbacksTopContainer,
	GIVbacksBottomContainer,
	GIVbackRewardCard,
	GBSubtitle,
	GBTitle,
	GbDataBlock,
	GbButton,
	GIVBackCard,
	RoundSection,
	RoundTitle,
	RoundInfo,
	RoundInfoRow,
	RoundInfoTallRow,
	RoundButton,
	InfoSection,
	InfoImage,
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
import { TopInnerContainer } from './commons';
import links from '@/lib/constants/links';
import { Col, Container, Row } from '@/components/Grid';
import Routes from '@/lib/constants/Routes';
import { BN } from '@/helpers/number';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

export const TabGIVbacksTop = () => {
	const [showHarvestModal, setShowHarvestModal] = useState(false);
	const [showGivBackExplain, setShowGivBackExplain] = useState(false);
	const [givBackStream, setGivBackStream] = useState<BigNumber.Value>(0);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();
	const xDaiValues = useAppSelector(state => state.subgraph.xDaiValues);
	const givTokenDistroBalance = useMemo(() => {
		const sdh = new SubgraphDataHelper(xDaiValues);
		return sdh.getGIVTokenDistroBalance();
	}, [xDaiValues]);
	const { chainId } = useWeb3React();

	useEffect(() => {
		const _givback = BN(givTokenDistroBalance.givback);
		setGivBackStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(_givback),
		);
	}, [givTokenDistroBalance, givTokenDistroHelper]);

	return (
		<>
			<GIVbacksTopContainer>
				<TopInnerContainer>
					<Row style={{ alignItems: 'flex-end' }}>
						<Col xs={12} sm={7} xl={8}>
							<Flex alignItems='baseline' gap='16px'>
								<GBTitle>GIVbacks</GBTitle>
								<IconGIVBack size={64} />
							</Flex>
							<GBSubtitle size='medium'>
								GIVbacks rewards donors to verified projects
								with GIV, super-charging Giveth as a
								donor-driven force for good.
							</GBSubtitle>
						</Col>
						<Col xs={12} sm={5} xl={4}>
							<GIVbackRewardCard
								title='Your GIVbacks rewards'
								wrongNetworkText='GIVbacks is only available on Gnosis Chain.'
								liquidAmount={BN(
									givTokenDistroBalance.givbackLiquidPart,
								)}
								stream={givBackStream}
								actionLabel='HARVEST'
								actionCb={() => {
									setShowHarvestModal(true);
								}}
								subButtonLabel={
									BN(
										givTokenDistroBalance.givbackLiquidPart,
									)?.isZero()
										? "Why don't I have GIVbacks?"
										: undefined
								}
								subButtonCb={() => setShowGivBackExplain(true)}
								network={chainId}
								targetNetworks={[config.XDAI_NETWORK_NUMBER]}
							/>
						</Col>
					</Row>
				</TopInnerContainer>
			</GIVbacksTopContainer>
			{showHarvestModal && (
				<HarvestAllModal
					title='GIVbacks Rewards'
					setShowModal={setShowHarvestModal}
					network={config.XDAI_NETWORK_NUMBER}
					tokenDistroHelper={givTokenDistroHelper}
				/>
			)}
			{showGivBackExplain && (
				<GIVBackExplainModal setShowModal={setShowGivBackExplain} />
			)}
		</>
	);
};

export const TabGIVbacksBottom = () => {
	const [round, setRound] = useState(0);
	const [roundStartime, setRoundStartime] = useState(new Date());
	const [roundEndTime, setRoundEndTime] = useState(new Date());
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();

	useEffect(() => {
		if (givTokenDistroHelper) {
			const now = getNowUnixMS();
			const deltaT = now - givTokenDistroHelper.startTime.getTime();
			const TwoWeek = 1_209_600_000;
			const _round = Math.floor(deltaT / TwoWeek) + 1;
			setRound(_round);
			const _rounStartTime = new Date(givTokenDistroHelper.startTime);
			_rounStartTime.setDate(
				givTokenDistroHelper.startTime.getDate() + (_round - 1) * 14,
			);
			_rounStartTime.setHours(givTokenDistroHelper.startTime.getHours());
			_rounStartTime.setMinutes(
				givTokenDistroHelper.startTime.getMinutes(),
			);
			setRoundStartime(_rounStartTime);
			const _roundEndTime = new Date(_rounStartTime);
			_roundEndTime.setDate(_rounStartTime.getDate() + 14);
			_roundEndTime.setHours(givTokenDistroHelper.startTime.getHours());
			_roundEndTime.setMinutes(
				givTokenDistroHelper.startTime.getMinutes(),
			);
			setRoundEndTime(_roundEndTime);
		}
	}, [givTokenDistroHelper]);

	return (
		<GIVbacksBottomContainer>
			<Container>
				<Row>
					<Col xs={12} sm={6}>
						<GbDataBlock
							title='Donor Rewards'
							button={
								<GbButton
									label='DONATE TO EARN GIV'
									linkType='secondary'
									size='large'
									href={Routes.Projects}
								/>
							}
						>
							When you donate to verified projects you qualify to
							receive GIV tokens. Through GIVbacks, GIV empowers
							donors with governance rights via the GIVgarden.
						</GbDataBlock>
					</Col>
					<Col xs={12} sm={6}>
						<GbDataBlock
							title='Project Verification'
							button={
								<GbButton
									label='VERIFY YOUR PROJECT'
									linkType='secondary'
									size='large'
									href='https://giveth.typeform.com/verification'
									target='_blank'
								/>
							}
						>
							Great projects make the GIVeconomy thrive! As a
							project owner, when you get your project verified,
							your donors become eligible to receive GIVbacks.
						</GbDataBlock>
					</Col>
				</Row>
				<GIVBackCard>
					<Row>
						<Col xs={12} md={8}>
							<RoundSection>
								<RoundTitle>GIVbacks Round {round}</RoundTitle>
								<RoundInfo>
									<RoundInfoRow justifyContent='space-between'>
										<P>Start Date</P>
										<P>
											{givTokenDistroHelper
												? formatDate(roundStartime)
												: '-'}
										</P>
									</RoundInfoRow>
									<RoundInfoRow justifyContent='space-between'>
										<P>End Date</P>
										<P>
											{givTokenDistroHelper
												? formatDate(roundEndTime)
												: '-'}
										</P>
									</RoundInfoRow>
									<RoundInfoTallRow
										justifyContent='space-between'
										alignItems='center'
									>
										<P>GIV Allocated to Round</P>
										<GivAllocated>
											1 Million GIV
										</GivAllocated>
									</RoundInfoTallRow>
									<RoundButton
										size='small'
										label={'DONATE TO EARN GIV'}
										linkType='primary'
										href={Routes.Projects}
									/>
								</RoundInfo>
							</RoundSection>
						</Col>
						<Col xs={12} md={4}>
							<InfoSection>
								<InfoImage src='/images/hands.svg' />
								<InfoTitle weight={700}>
									When you give you get GIV back!
								</InfoTitle>
								<InfoDesc>
									Each GIVbacks round lasts two weeks. After
									the End Date, the GIV Allocated to that
									round is distributed to Givers who donated
									to verified projects during the round.
									Projects must apply for verification at
									least 1 week prior to the Start Date in
									order to be included in the round.
								</InfoDesc>
								<InfoReadMore
									target='_blank'
									href={links.GIVBACK_DOC}
								>
									<span>Read More </span>
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
