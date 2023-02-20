import {
	ButtonLink,
	H3,
	IconChevronRight24,
	IconDonation32,
	IconSpark32,
	IconVerifiedBadge32,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Flex } from '@/components/styled-components/Flex';
import IntroCard from './IntroCard';
import introBanner from '/public/images/banners/introBanner.svg';
import { mediaQueries } from '@/lib/constants/constants';
import { Container } from '@/components/Grid';
import Routes from '@/lib/constants/Routes';

const SemiCircle = dynamic(() => import('@/components/particles/SemiCircle'));
const Circle = dynamic(() => import('@/components/particles/Circle'));
const Wave = dynamic(() => import('@/components/particles/Wave'));

const IntroBlock = () => {
	const { formatMessage } = useIntl();
	return (
		<SectionContainer>
			<Container style={{ position: 'relative' }}>
				<IntroContainer>
					<TopSectionContainer
						justifyContent='space-around'
						gap='32px'
					>
						<IntroTitle>
							<H3 weight={700}>
								{formatMessage({
									id: 'label.giveth_empowers_changemakers',
								})}
							</H3>
							<br />
							<CustomLead>
								Join our community-driven movement to transform
								the way we fund nonprofits and social causes.
							</CustomLead>
							<ButtonsContainer gap='16px'>
								<Link href={Routes.Projects}>
									<ButtonLink
										label={formatMessage({
											id: 'label.explore_projects',
										})}
										icon={<IconChevronRight24 />}
									/>
								</Link>
								<Link
									href='https://docs.giveth.io/whatisgiveth/#our-mission'
									target='_blank'
								>
									<OurMissionButton
										linkType='texty-secondary'
										label={formatMessage({
											id: 'label.our_mission',
										})}
										icon={<IconChevronRight24 />}
									/>
								</Link>
							</ButtonsContainer>
						</IntroTitle>
						<div>
							<Image
								src={introBanner}
								alt='intro-banner'
								width={350}
							/>
						</div>
						<TopWaveContainer>
							<Wave />
						</TopWaveContainer>
						<BottomWaveContainer>
							<Wave color='#FFC9E2' />
						</BottomWaveContainer>
						<SemiCircleContainer>
							<SemiCircle />
						</SemiCircleContainer>
						<CircleContainer>
							<Circle />
						</CircleContainer>
					</TopSectionContainer>
					<IntroCards justifyContent='space-between' gap='24px'>
						<IntroCard
							Icon={
								<IconVerifiedBadge32
									color={neutralColors.gray[800]}
								/>
							}
							LinkComponent={
								<ButtonLink
									linkType='texty-secondary'
									label={formatMessage({
										id: 'label.how_it_works',
									})}
									icon={<IconChevronRight24 />}
								/>
							}
							title={formatMessage({
								id: 'label.zero_fees',
							})}
							description={formatMessage({
								id: 'label.create_a_project_or_donate_directly',
							})}
						/>
						<IntroCard
							Icon={
								<IconDonation32
									color={neutralColors.gray[800]}
								/>
							}
							LinkComponent={
								<ButtonLink
									linkType='texty-secondary'
									label={formatMessage({
										id: 'label.learn_more',
									})}
									icon={<IconChevronRight24 />}
								/>
							}
							title={formatMessage({
								id: 'label.earn_rewards',
							})}
							description={formatMessage({
								id: 'label.by_donating_crypto',
							})}
						/>
						<IntroCard
							Icon={
								<IconSpark32 color={neutralColors.gray[800]} />
							}
							LinkComponent={
								<ButtonLink
									linkType='texty-primary'
									label={formatMessage({
										id: 'label.get_started',
									})}
									icon={<IconChevronRight24 />}
								/>
							}
							title={formatMessage({
								id: 'label.easy_onboarding',
							})}
							description={formatMessage({
								id: 'label.new_to_crypto',
							})}
						/>
					</IntroCards>
				</IntroContainer>
			</Container>
		</SectionContainer>
	);
};

const SectionContainer = styled.div`
	position: relative;
	background-color: ${neutralColors.gray[100]};
	padding: 100px 0;
	margin-top: 10px;
	::before {
		content: '';
		background-image: url('/images/backgrounds/giv-outlined-bright-opacity.png');
		background-repeat: repeat;
		position: absolute;
		height: 100%;
		opacity: 0.5;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 0;
	}
`;

const IntroContainer = styled.div`
	position: relative;
	padding: 0 8px;
`;

const IntroTitle = styled.div`
	max-width: 500px;
`;

const TopSectionContainer = styled(Flex)`
	position: relative;
	margin-bottom: 100px;
	flex-direction: column;
	align-items: center;
	${mediaQueries.tablet} {
		flex-direction: row;
		align-items: stretch;
	}
`;

const UnderlinedText = styled.span`
	text-decoration: underline;
	text-decoration-skip-ink: none;
`;

const ButtonsContainer = styled(Flex)`
	position: relative;
	margin-top: 16px;
	flex-direction: column;
	z-index: 1;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const IntroCards = styled(Flex)`
	margin-top: 40px;
	flex-direction: column;
	align-items: center;
	${mediaQueries.tablet} {
		flex-direction: row;
		align-items: stretch;
	}
`;

const TopWaveContainer = styled.div`
	position: absolute;
	top: -60px;
	left: -10px;
`;

const BottomWaveContainer = styled.div`
	position: absolute;
	bottom: -60px;
	right: 0;
`;

const SemiCircleContainer = styled.div`
	z-index: 0;
	position: absolute;
	bottom: 0;
	left: 0;
`;

const CircleContainer = styled.div`
	position: absolute;
	bottom: -50px;
	left: 50%;
	display: none;
	${mediaQueries.mobileL} {
		display: inline;
	}
`;

const CustomLead = styled(Lead)`
	color: ${neutralColors.gray[800]};
`;

const OurMissionButton = styled(ButtonLink)`
	display: flex;
	align-items: center;
	height: 100%;
`;

export default IntroBlock;
