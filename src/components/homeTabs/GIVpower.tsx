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
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import { Col, Row } from '@giveth/ui-design-system';
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
	BoostLinkContainer,
	CaptionStyled,
	BenefitsCardContainer,
} from './GIVpower.sc';
import RocketImage from '../../../public/images/rocket.svg';
import Growth from '../../../public/images/growth.svg';
import GivStake from '../../../public/images/giv_stake.svg';
import Routes from '@/lib/constants/Routes';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import { formatWeiHelper } from '@/helpers/number';
import links from '@/lib/constants/links';

export function TabPowerTop() {
	const { formatMessage } = useIntl();
	const { account } = useWeb3React();
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.xDaiValues),
	);
	const givPower = sdh.getUserGIVPowerBalance();
	const givPowerFormatted = formatWeiHelper(givPower.balance);
	const hasZeroGivPower = givPowerFormatted === '0';
	const dispatch = useAppDispatch();

	return (
		<GIVpowerTopContainer>
			<GIVpowerContainer>
				<Row style={{ alignItems: 'flex-end' }}>
					<Col xs={12} sm={8}>
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
							{formatMessage({
								id: 'label.use_giv_to_boost_projects',
							})}
						</Subtitle>
					</Col>
					<Col xs={12} sm={4}>
						<GivPowerCardContainer>
							{account ? (
								<>
									<Caption>
										{formatMessage({
											id: 'label.your_givpower',
										})}
									</Caption>
									<GivAmount>
										<Image
											src={RocketImage}
											width='27'
											height='27'
											alt='givpower'
										/>
										<TitleBase>
											{givPowerFormatted ?? 0}
										</TitleBase>
									</GivAmount>
									<BoostLinkContainer>
										{hasZeroGivPower && (
											<CaptionStyled medium>
												{formatMessage({
													id: 'label.stake_giv_to_get_givpower',
												})}
												!
											</CaptionStyled>
										)}
										<Link
											href={
												hasZeroGivPower
													? Routes.GIVfarm
													: Routes.Projects
											}
										>
											<BoostProjectButton
												label={
													hasZeroGivPower
														? formatMessage({
																id: 'label.stake_for_givpower',
														  })
														: formatMessage({
																id: 'label.boost_projects',
														  })
												}
												size='large'
												linkType='primary'
											/>
										</Link>
									</BoostLinkContainer>
								</>
							) : (
								<ConnectWallet>
									<ConnectWalletDesc>
										{formatMessage({
											id: 'label.to_see_your_givpower_please_connect',
										})}
									</ConnectWalletDesc>
									<ConnectWalletButton
										label={formatMessage({
											id: 'component.button.connect_wallet',
										})}
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
	const { formatMessage } = useIntl();

	return (
		<>
			<GIVpowerContainer>
				<H3 weight={700}>
					{formatMessage({
						id: 'label.boost_projects_with_givpower',
					})}
				</H3>
				<br />
				<HeadingSectionContainer>
					<HeadingTextContainer>
						<QuoteText size='small'>
							{formatMessage({
								id: 'label.use_your_givpower_to_boost_verified_projects',
							})}
						</QuoteText>
					</HeadingTextContainer>
					<LearnMoreButton
						isExternal
						label={formatMessage({ id: 'label.learn_more' })}
						target='_blank'
						href={links.GIVPOWER_DOC}
						size='large'
					/>
				</HeadingSectionContainer>
				<FeaturesCardContainer>
					<FeaturesCardHeading weight={700}>
						{formatMessage({ id: 'label.how_does_givpower_work' })}
					</FeaturesCardHeading>
					<FeaturesCardSubheading size='small'>
						{formatMessage({
							id: 'label.with_givpower_you_can_support_verified_projects',
						})}
					</FeaturesCardSubheading>
					<FeaturesCardItemsContainer>
						<FeaturesCardItem>
							<Image
								height='68'
								src={GivStake}
								alt='givpower stake and lock icon'
							/>
							<H4 weight={700}>
								{formatMessage({
									id: 'label.stake_and_lock_giv',
								})}{' '}
							</H4>
							<Lead>
								{formatMessage({
									id: 'label.stake_and_lock_giv_to_get_givpower',
								})}
							</Lead>
							<Link href={Routes.GIVfarm}>
								<CardBottomText>
									{formatMessage({
										id: 'label.get_givpower',
									})}
								</CardBottomText>
							</Link>
						</FeaturesCardItem>
						<FeaturesCardItem>
							<Image
								height='70'
								src={Growth}
								alt='givpower earn yield icon'
							/>
							<H4 weight={700}>
								{formatMessage({ id: 'label.earn_a_yield' })}
							</H4>
							<Lead>
								{formatMessage({
									id: 'label.the_longer_you_lock_the_greater_your_reward',
								})}
							</Lead>

							<Link href={Routes.GIVfarm}>
								<CardBottomText>
									{formatMessage({ id: 'label.see_rewards' })}
								</CardBottomText>
							</Link>
						</FeaturesCardItem>
						<FeaturesCardItem>
							<div>
								<IconRocketInSpace32
									size={65}
									color={brandColors.mustard[500]}
								/>
							</div>
							<H4 weight={700}>
								{formatMessage({
									id: 'label.boost_projects',
								})}
							</H4>
							<Lead>
								{formatMessage({
									id: 'label.boost_your_favorite_projects_to_help_them_rise',
								})}
							</Lead>
							<Link href={Routes.Projects}>
								<CardBottomText>
									{formatMessage({
										id: 'label.boost_projects',
									})}
								</CardBottomText>
							</Link>
						</FeaturesCardItem>
					</FeaturesCardItemsContainer>
				</FeaturesCardContainer>
				<HeaderAndCirclesContainer>
					<Circle size={350} />
					<Circle size={700} />
					<Circle size={1150} />
					<CenteredHeader weight={700}>
						{formatMessage({
							id: 'label.winwin_for_givers_and_projects',
						})}
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
								{formatMessage({ id: 'label.for_givers' })}
							</BenefitsCardHeading>
							<BenefitsCardContainer>
								<BenefitsCardTextContainer>
									<QuoteText size='small'>
										{formatMessage({
											id: 'label.stake_giv_to_get_givpower_and_earn_rewards',
										})}
									</QuoteText>
									<QuoteText size='small'>
										{formatMessage({
											id: 'label.lock_your_giv_to_increase_your_rewards',
										})}
									</QuoteText>
									<QuoteText size='small'>
										{formatMessage({
											id: 'label.donate_to_top_ranked_projects_and_get_more_giv_back',
										})}
									</QuoteText>
									<br />
								</BenefitsCardTextContainer>
								<Link href={Routes.GIVfarm}>
									<CardBottomText>
										{formatMessage({
											id: 'label.stake_giv',
										})}
									</CardBottomText>
								</Link>
							</BenefitsCardContainer>
						</BenefitsCard>
						<BenefitsCard>
							<BenefitsCardHeading weight={700}>
								{formatMessage({ id: 'label.for_projects' })}
							</BenefitsCardHeading>
							<BenefitsCardTextContainer>
								<QuoteText size='small'>
									{formatMessage({
										id: 'label.fireup_your_community_to_use_givpower',
									})}
								</QuoteText>
								<QuoteText size='small'>
									{formatMessage({
										id: 'label.the_higher_your_rank_the_more_givback',
									})}
								</QuoteText>
								<QuoteText size='small'>
									{formatMessage({
										id: 'label.topranked_projects_will_eventually_get_funding',
									})}
								</QuoteText>
								<br />
								<Link href={Routes.Projects}>
									<CardBottomText>
										{formatMessage({
											id: 'label.browse_projects',
										})}
									</CardBottomText>
								</Link>
							</BenefitsCardTextContainer>
						</BenefitsCard>
					</BenefitsCardsContainer>
				</GIVpowerContainer>
			</div>
			<GIVpowerContainer>
				<GivpowerCTAContainer>
					<H1 weight={700}>
						{formatMessage({
							id: 'label.stake_giv_to_get_givpower',
						})}
					</H1>
					<GivpowerCTASubheading size='small'>
						{formatMessage({
							id: 'label.lock_your_giv_to_increase_your_multiplier',
						})}
					</GivpowerCTASubheading>
					<GivpowerCTAButtonContainer>
						<Link href={Routes.GIVfarm}>
							<GivpowerCTAButton
								label={formatMessage({
									id: 'label.get_givpower',
								})}
								size='large'
								linkType='primary'
							/>
						</Link>
						<GivpowerCTAButtonOutlined
							isExternal
							label={formatMessage({ id: 'label.get_giv' })}
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
