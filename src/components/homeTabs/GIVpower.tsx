import Image from 'next/image';
import {
	brandColors,
	H3,
	H4,
	IconRocketInSpace32,
	QuoteText,
	Lead,
	H1,
	Caption,
	Title as TitleBase,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { Col, Row } from '../Grid';
import { Flex } from '../styled-components/Flex';
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
	ArcMustardTop,
	ArcMustardBottom,
	GivpowerCTAContainer,
	GivpowerCTASubheading,
	Circle,
	HeaderAndCirclesContainer,
	GivpowerCTAButton,
	GivpowerCTAButtonOutlined,
	GivpowerCTAButtonContainer,
	GivPowerCardContainer,
	GIVpowerContainer,
	ConnectWallet,
	ConnectWalletDesc,
	ConnectWalletButton,
	GivAmount,
	BoostProjectButton,
} from './GIVpower.sc';
import RocketImage from '../../../public/images/rocket.svg';
import Growth from '../../../public/images/growth.svg';
import GivStake from '../../../public/images/giv_stake.svg';
import Routes from '@/lib/constants/Routes';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import config, { IS_BOOSTING_ENABLED } from '@/configuration';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import { formatWeiHelper } from '@/helpers/number';
import links from '@/lib/constants/links';

export function TabPowerTop() {
	const { account } = useWeb3React();
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.xDaiValues),
	);
	const givPower = sdh.getUserGIVPowerBalance();
	const dispatch = useAppDispatch();

	return (
		<GIVpowerTopContainer>
			<GIVpowerContainer>
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
						<GivPowerCardContainer>
							{account ? (
								<>
									<Caption>Your GIVpower</Caption>
									<GivAmount>
										<Image
											src={RocketImage}
											width='27'
											height='27'
											alt='givpower'
										/>
										<TitleBase>
											{formatWeiHelper(
												givPower.balance,
											) ?? 0}
										</TitleBase>
									</GivAmount>
									{IS_BOOSTING_ENABLED && (
										<Link href={Routes.Projects} passHref>
											<BoostProjectButton
												label='BOOST PROJECTS'
												size='large'
												linkType='primary'
											/>
										</Link>
									)}
								</>
							) : (
								<ConnectWallet>
									<ConnectWalletDesc>
										To see your GIVpower, please connect
										your wallet.
									</ConnectWalletDesc>
									<ConnectWalletButton
										label='Connect Wallet'
										buttonType='primary'
										size='small'
										onClick={() =>
											dispatch(setShowWalletModal(true))
										}
									/>
								</ConnectWallet>
							)}
						</GivPowerCardContainer>
					</Col>
				</Row>
			</GIVpowerContainer>
		</GIVpowerTopContainer>
	);
}

export function TabPowerBottom() {
	const getGivLink = config.XDAI_CONFIG.GIV.BUY_LINK;

	return (
		<>
			<GIVpowerContainer>
				<H3 weight={700}>Boost Projects with GIVpower</H3>
				<br />
				<HeadingSectionContainer>
					<HeadingTextContainer>
						<QuoteText size='small'>
							Support verified projects using “Boost”. Projects
							backed by GIVpower will benefit from matching funds
							& more GIVbacks for their donors.
						</QuoteText>
					</HeadingTextContainer>
					<LearnMoreButton
						label='Learn More'
						target='_blank'
						href={links.GIVPOWER_DOC}
					/>
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
							<Link href={Routes.GIVfarm} passHref>
								<CardBottomText>GET GIVPOWER</CardBottomText>
							</Link>
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
							{/*
							TODO: UnComment when we want to go live
							<Link href={Routes.Projects} passHref> */}
							<CardBottomText>
								{/* BOOST PROJECTS */}
								Coming Soon
							</CardBottomText>
							{/* </Link> */}
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

							<Link href={Routes.GIVfarm} passHref>
								<CardBottomText>SEE REWARDS</CardBottomText>
							</Link>
						</FeaturesCardItem>
					</FeaturesCardItemsContainer>
				</FeaturesCardContainer>
				<HeaderAndCirclesContainer>
					<Circle size={350} />
					<Circle size={700} />
					<Circle size={1150} />
					<CenteredHeader weight={700}>
						Win-win for GIVers & Projects
					</CenteredHeader>
				</HeaderAndCirclesContainer>
			</GIVpowerContainer>
			<div style={{ position: 'relative', overflow: 'hidden' }}>
				<ArcMustardTop />
				<ArcMustardBottom />
				<GIVpowerContainer>
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
									Lock your GIV to increase your rewards
									multiplier.
								</QuoteText>
								<QuoteText size='small'>
									Donate to the top-boosted projects to get
									more GIVbacks.
								</QuoteText>
								<br />
								{/*
								TODO: UnComment when we want to go live
								<Link href={Routes.GIVfarm} passHref> */}
								<CardBottomText>
									{/* GET GIVPOWER */}
									Coming Soon
								</CardBottomText>
								{/* </Link> */}
							</BenefitsCardTextContainer>
						</BenefitsCard>
						<BenefitsCard>
							<BenefitsCardHeading weight={700}>
								For Projects
							</BenefitsCardHeading>
							<BenefitsCardTextContainer>
								<QuoteText size='small'>
									Fire up your community to get more boosts &
									improve your rank.
								</QuoteText>
								<QuoteText size='small'>
									Top-ranked projects get funding from the
									Giveth Matching Pool.
								</QuoteText>
								<QuoteText size='small'>
									The higher your rank, the more GIVbacks your
									donors receive.
								</QuoteText>
								<br />
								<Link href={Routes.Projects} passHref>
									<CardBottomText>
										BROWSE PROJECTS
									</CardBottomText>
								</Link>
							</BenefitsCardTextContainer>
						</BenefitsCard>
					</BenefitsCardsContainer>
				</GIVpowerContainer>
			</div>
			<GIVpowerContainer>
				<GivpowerCTAContainer>
					<H1 weight={700}>Stake GIV to get GIVpower</H1>
					<GivpowerCTASubheading size='small'>
						Lock your GIV to increase your multiplier.
					</GivpowerCTASubheading>
					<GivpowerCTAButtonContainer>
						<GivpowerCTAButton
							label='GET GIVPOWER'
							size='large'
							linkType='primary'
							href={Routes.GIVfarm}
						/>
						<GivpowerCTAButtonOutlined
							label='GET GIV'
							size='large'
							href={getGivLink}
							target='_blank'
						/>
					</GivpowerCTAButtonContainer>
				</GivpowerCTAContainer>
			</GIVpowerContainer>
		</>
	);
}
