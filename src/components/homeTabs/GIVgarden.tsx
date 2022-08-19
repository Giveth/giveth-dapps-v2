import React, { useState, useEffect } from 'react';
import { H1, IconGIVGarden } from '@giveth/ui-design-system';

import BigNumber from 'bignumber.js';
import { Zero } from '@ethersproject/constants';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
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
import { Col, Container, Row } from '@/components/Grid';

const poolStakingConfig = getGivStakingConfig(config.XDAI_CONFIG);

export const TabGardenTop = () => {
	const { chainId } = useWeb3React();
	const { givTokenDistroHelper } = useGIVTokenDistroHelper();

	const [showModal, setShowModal] = useState(false);
	const [earnedLiquidPart, setEarnedLiquidPart] =
		useState<ethers.BigNumber>(Zero);
	const [earnedStream, setEarnedStream] = useState<BigNumber>(
		new BigNumber(0),
	);

	const { earned } = useStakingPool(
		poolStakingConfig,
		config.XDAI_NETWORK_NUMBER,
	);

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
							The GIVgarden is the decentralized governance
							platform for the GIVeconomy.
						</Subtitle>
					</Col>
					<Col xs={12} sm={5} md={4}>
						<GardenRewardCard
							title='Your GIVgarden rewards'
							wrongNetworkText='GIVgarden is only available on Gnosis Chain.'
							liquidAmount={earnedLiquidPart}
							stream={earnedStream}
							actionLabel='HARVEST'
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
					title='GIVgarden Rewards'
					setShowModal={setShowModal}
					poolStakingConfig={poolStakingConfig}
					earned={earned}
					network={config.XDAI_NETWORK_NUMBER}
					tokenDistroHelper={givTokenDistroHelper}
				/>
			)}
		</GardenTopContainer>
	);
};

export const TabGardenBottom = () => {
	const goToGarden = () => {
		const url = config.GARDEN_LINK;
		window.open(url, '_blank');
	};

	return (
		<GardenBottomContainer>
			<Container>
				<Section1Title weight={700}>Vote & Earn</Section1Title>
				<GivGardenSection>
					<Section1Subtitle size='small'>
						GIV token holders influence the treasury, roadmap and
						mission of the Giveth ecosystem. By voting in the
						GIVgarden you earn rewards on your staked GIV!
					</Section1Subtitle>
					<OpenGardenButton
						buttonType='primary'
						label='OPEN GIVGARDEN'
						size='large'
						onClick={goToGarden}
					/>
				</GivGardenSection>
				<Section2Title weight={500}>
					Three Pillars of Governance
				</Section2Title>
				<GovernanceRaw>
					<Col xs={12} sm={6} md={4}>
						<GovernanceDB
							title='Covenant'
							button={
								<GovernanceLink
									size='Medium'
									target='_blank'
									rel='noreferrer'
									href='https://docs.giveth.io/whatisgiveth/covenant'
								>
									LEARN MORE
								</GovernanceLink>
							}
						>
							A decentralized social contract that outlines
							standards for on-chain and off-chain community
							behaviour.
						</GovernanceDB>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<GovernanceDB
							title='Conviction Voting'
							button={
								<GovernanceLink
									size='Medium'
									target='_blank'
									rel='noreferrer'
									href='https://forum.giveth.io/t/conviction-voting/154'
								>
									LEARN MORE
								</GovernanceLink>
							}
						>
							A token-weighted decision making tool, used for
							funds allocation, in which voting power is accrued
							as a function of tokens staked and time.
						</GovernanceDB>
					</Col>
					<Col xs={12} sm={6} md={4}>
						<GovernanceDB
							title='Tao Voting'
							button={
								<GovernanceLink
									size='Medium'
									target='_blank'
									rel='noreferrer'
									href='https://forum.giveth.io/t/tao-voting-explained/155'
								>
									LEARN MORE
								</GovernanceLink>
							}
						>
							A token-weighted YES/NO decision making tool, with
							the option of delegation, that is used to make
							non-financial decisions in the GIVgarden.
						</GovernanceDB>
					</Col>
				</GovernanceRaw>
				<VoteCard>
					<H1>Vote in the GIVgarden</H1>
					<VoteCardDesc size='small'>
						The GIVgarden empowers the Giveth community to
						coordinate around shared resources from the bottom up.
					</VoteCardDesc>
					<VoteCardButton
						label='OPEN GIVGARDEN'
						buttonType='primary'
						onClick={goToGarden}
					/>
				</VoteCard>
			</Container>
		</GardenBottomContainer>
	);
};
