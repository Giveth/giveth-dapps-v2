import React, { useState, useEffect } from 'react';
import { H1, IconGIVGarden } from '@giveth/ui-design-system';

import BigNumber from 'bignumber.js';
import { Zero } from '@ethersproject/constants';
import { ethers } from 'ethers';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import { Col, Container, Row } from '@giveth/ui-design-system';
import {
	GardenTopContainer,
	GardenBottomContainer,
	Title,
	Subtitle,
	GardenRewardCard,
	GovernanceLink,
	GovernanceDB,
	OpenGardenButton,
	Section1Subtitle,
	Section1Title,
	Section2Title,
	GovernanceRaw,
	VoteCard,
	VoteCardDesc,
	VoteCardButton,
	GardenIconContainer,
	GivGardenSection,
} from './GIVgarden.sc';
import { HarvestAllModal } from '../modals/HarvestAll';
import config from '@/configuration';
import { useStakingPool } from '@/hooks/useStakingPool';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { TopInnerContainer } from './commons';

const poolStakingConfig = getGivStakingConfig(config.XDAI_CONFIG);

export const TabGardenTop = () => {
	const { chainId } = useWeb3React();
	const [showModal, setShowModal] = useState(false);
	const [earnedLiquidPart, setEarnedLiquidPart] =
		useState<ethers.BigNumber>(Zero);
	const [earnedStream, setEarnedStream] = useState<BigNumber>(
		new BigNumber(0),
	);
	const { givTokenDistroHelper } = useGIVTokenDistroHelper(showModal);
	const { formatMessage } = useIntl();

	const { earned } = useStakingPool(poolStakingConfig);

	useEffect(() => {
		setEarnedLiquidPart(givTokenDistroHelper.getLiquidPart(earned));
		setEarnedStream(givTokenDistroHelper.getStreamPartTokenPerWeek(earned));
	}, [earned, givTokenDistroHelper]);

	return (
		<GardenTopContainer>
			<TopInnerContainer>
				<Row style={{ alignItems: 'flex-end' }}>
					<Col xs={12} sm={7} md={8}>
						<Title>
							GIVgarden
							<GardenIconContainer>
								<IconGIVGarden size={64} />
							</GardenIconContainer>
						</Title>
						<Subtitle size='medium'>
							{formatMessage({
								id: 'label.givgarden_is_the_decentralized_gov_platform',
							})}
						</Subtitle>
					</Col>
					<Col xs={12} sm={5} md={4}>
						<GardenRewardCard
							title={formatMessage({
								id: 'label.your_giv_garden_rewards',
							})}
							wrongNetworkText={formatMessage({
								id: 'label.givgarden_is_only_available_on_gnosis',
							})}
							liquidAmount={earnedLiquidPart}
							stream={earnedStream}
							actionLabel={formatMessage({ id: 'label.harvest' })}
							actionCb={() => {
								setShowModal(true);
							}}
							network={chainId}
							targetNetworks={[config.XDAI_NETWORK_NUMBER]}
						/>
					</Col>
				</Row>
			</TopInnerContainer>
			{showModal && (
				<HarvestAllModal
					title={formatMessage({ id: 'label.givgarden_rewards' })}
					setShowModal={setShowModal}
					poolStakingConfig={poolStakingConfig}
				/>
			)}
		</GardenTopContainer>
	);
};

export const TabGardenBottom = () => {
	const { formatMessage } = useIntl();

	const goToGarden = () => {
		const url = config.GARDEN_LINK;
		window.open(url, '_blank');
	};

	return (
		<GardenBottomContainer>
			<Container>
				<Section1Title weight={700}>
					{formatMessage({ id: 'label.vote_and_earn' })}
				</Section1Title>
				<GivGardenSection>
					<Section1Subtitle size='small'>
						{formatMessage({
							id: 'label.givtoken_holders_influence_the_treasyry',
						})}
					</Section1Subtitle>
					<OpenGardenButton
						buttonType='primary'
						label={formatMessage({ id: 'label.open_givgarden' })}
						size='large'
						onClick={goToGarden}
					/>
				</GivGardenSection>
				<Section2Title weight={500}>
					{formatMessage({ id: 'label.three_pillars_of_governance' })}
				</Section2Title>
				<GovernanceRaw>
					<Col xs={12} sm={6} md={4}>
						<GovernanceDB
							title={formatMessage({ id: 'label.covenant' })}
							button={
								<GovernanceLink
									as='a'
									size='Medium'
									target='_blank'
									rel='noreferrer'
									href='https://docs.giveth.io/whatisgiveth/covenant'
								>
									{formatMessage({ id: 'label.learn_more' })}
								</GovernanceLink>
							}
						>
							{formatMessage({
								id: 'label.a_decentralized_social_contract',
							})}
						</GovernanceDB>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<GovernanceDB
							title={formatMessage({
								id: 'label.conviction_voting',
							})}
							button={
								<GovernanceLink
									as='a'
									size='Medium'
									target='_blank'
									rel='noreferrer'
									href='https://forum.giveth.io/t/conviction-voting/154'
								>
									{formatMessage({ id: 'label.learn_more' })}
								</GovernanceLink>
							}
						>
							{formatMessage({
								id: 'label.a_token_weighted_deicision_making_tool',
							})}
						</GovernanceDB>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<GovernanceDB
							title={formatMessage({ id: 'label.tao_voting' })}
							button={
								<GovernanceLink
									as='a'
									size='Medium'
									target='_blank'
									rel='noreferrer'
									href='https://forum.giveth.io/t/tao-voting-explained/155'
								>
									{formatMessage({ id: 'label.learn_more' })}
								</GovernanceLink>
							}
						>
							{formatMessage({
								id: 'label.a_token_weighted_yes_no',
							})}
						</GovernanceDB>
					</Col>
				</GovernanceRaw>
				<VoteCard>
					<H1>
						{formatMessage({ id: 'label.vote_in_the_givgarden' })}
					</H1>
					<VoteCardDesc size='small'>
						{formatMessage({
							id: 'label.the_giv_garden_empowers_the_giv_community',
						})}
					</VoteCardDesc>
					<VoteCardButton
						label={formatMessage({ id: 'label.open_givgarden' })}
						buttonType='primary'
						onClick={goToGarden}
					/>
				</VoteCard>
			</Container>
		</GardenBottomContainer>
	);
};
