import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import {
	brandColors,
	H3,
	H4,
	IconRocketInSpace32,
	QuoteText,
	Lead,
} from '@giveth/ui-design-system';
import { Col, Row } from '../Grid';
import { Flex } from '../styled-components/Flex';
import { TopInnerContainer } from './commons';
import {
	GIVpowerTopContainer,
	Title,
	Subtitle,
	LearnMoreButton,
	HeadingSectionContainer,
	HeadingTextContainer,
	FeaturesCardContainer,
	FeaturesCardHeading,
	FeaturesCardSubheading,
	FeaturesCardItemsContainer,
	FeaturesCardItem,
	CenteredHeader,
	BenefitsCardsContainer,
	BenefitsCard,
	BenefitsCardTextContainer,
	BenefitsCardHeading,
	CardBottomText,
} from './Givpower.sc';
import RocketImage from '../../../public/images/rocket.svg';
import { GIVstreamRewardCard } from './GIVstream.sc';
import config from '@/configuration';
import { BN } from '@/helpers/number';
import Growth from '../../../public/images/growth.svg';
import GivStake from '../../../public/images/giv_stake.svg';
export function TabPowerTop() {
	const { chainId } = useWeb3React();
	return (
		<GIVpowerTopContainer>
			<TopInnerContainer>
				<Row style={{ alignItems: 'flex-end' }}>
					<Col xs={12} sm={7} xl={8}>
						<Flex alignItems='baseline' gap='16px'>
							<Title>GIVpower</Title>
							{/* <IconGIVFarm size={64} /> */}
							<Image
								src={RocketImage}
								width='58'
								height='53'
								alt='givpower'
							/>
						</Flex>
						<Subtitle size='medium'>
							Use GIV to boost projects to new heights!
						</Subtitle>
					</Col>
					<Col xs={12} sm={5} xl={4}>
						{/* //TODO: add The Card Functionality  */}
						<GIVstreamRewardCard
							wrongNetworkText='GIVstream is only available on Mainnet and Gnosis Chain.'
							liquidAmount={BN(1321231321)}
							stream='2'
							actionLabel='HARVEST'
							network={chainId}
							targetNetworks={[
								config.MAINNET_NETWORK_NUMBER,
								config.XDAI_NETWORK_NUMBER,
							]}
						/>
					</Col>
				</Row>
			</TopInnerContainer>
		</GIVpowerTopContainer>
	);
}

export function TabPowerBottom() {
	return (
		<TopInnerContainer>
			<H3 weight={700}>Boost Projects with GIVpower</H3>
			<br />
			<HeadingSectionContainer>
				<HeadingTextContainer>
					<QuoteText size='small'>
						Support verified projects using “Boost”. Projects backed
						by GIVpower will benefit from matching funds & more
						GIVbacks for their donors.
					</QuoteText>
				</HeadingTextContainer>
				<LearnMoreButton label='Learn More'>Hello</LearnMoreButton>
			</HeadingSectionContainer>
			<FeaturesCardContainer>
				<FeaturesCardHeading weight={700}>
					How does GIVpower work?
				</FeaturesCardHeading>
				<FeaturesCardSubheading size='small'>
					With GIVpower, you can support verified projects, while
					earning rewards on your GIV.
				</FeaturesCardSubheading>
				<FeaturesCardItemsContainer>
					<FeaturesCardItem>
						<Image
							height='68'
							src={GivStake}
							alt='givpower stake and lock icon'
						/>
						<H4 weight={700}>Stake & lock GIV </H4>
						<Lead>Stake & lock GIV to get GIVpower.</Lead>
						<CardBottomText>GET GIVPOWER</CardBottomText>
					</FeaturesCardItem>
					<FeaturesCardItem>
						<div>
							<IconRocketInSpace32
								size={65}
								color={brandColors.mustard[500]}
							/>
						</div>
						<H4 weight={700}>Boost Projects</H4>
						<Lead>
							Boost your favourite projects to help them rise
							through the ranks.
						</Lead>
						<CardBottomText>BOOST PROJECTS</CardBottomText>
					</FeaturesCardItem>
					<FeaturesCardItem>
						<Image
							height='70'
							src={Growth}
							alt='givpower earn yield icon'
						/>
						<H4 weight={700}>Earn a Yield</H4>
						<Lead>
							The longer you lock, the greater your rewards.
						</Lead>
						<CardBottomText>SEE REWARDS</CardBottomText>
					</FeaturesCardItem>
				</FeaturesCardItemsContainer>
			</FeaturesCardContainer>
			<CenteredHeader weight={700}>
				Win-win for GIVers & Projects
			</CenteredHeader>
			<BenefitsCardsContainer>
				<BenefitsCard>
					<BenefitsCardHeading weight={700}>
						For GIVers
					</BenefitsCardHeading>
					<BenefitsCardTextContainer>
						<QuoteText size='small'>
							Stake GIV to get GIVpower & earn rewards.
						</QuoteText>
						<QuoteText size='small'>
							Lock your GIV to increase your rewards multiplier.
						</QuoteText>
						<QuoteText size='small'>
							Donate to the top-boosted projects to get more
							GIVbacks.
						</QuoteText>
						<br />
						<CardBottomText>GET GIVPOWER</CardBottomText>
					</BenefitsCardTextContainer>
				</BenefitsCard>
				<BenefitsCard>
					<BenefitsCardHeading weight={700}>
						For Projects
					</BenefitsCardHeading>
					<BenefitsCardTextContainer>
						<QuoteText size='small'>
							Fire up your community to get more boosts & improve
							your rank.
						</QuoteText>
						<QuoteText size='small'>
							Top-ranked projects get funding from the Giveth
							Matching Pool.
						</QuoteText>
						<QuoteText size='small'>
							The higher your rank, the more GIVbacks your donors
							receive.
						</QuoteText>
						<br />
						<CardBottomText>GET GIVPOWER</CardBottomText>
					</BenefitsCardTextContainer>
				</BenefitsCard>
			</BenefitsCardsContainer>
		</TopInnerContainer>
	);
}
