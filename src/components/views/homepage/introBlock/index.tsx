import {
	ButtonLink,
	Container,
	H3,
	IconBulbOutline32,
	IconChevronRight24,
	IconDonation32,
	IconSpark32,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Flex } from '@/components/styled-components/Flex';
import IntroCard from './IntroCard';
import useDetectDevice from '@/hooks/useDetectDevice';
import introBanner from '/public/images/banners/introBanner.svg';
import { mediaQueries } from '@/lib/constants/constants';

const Wave = dynamic(() => import('@/components/particles/wave'));

const IntroBlock = () => {
	const { isMobile } = useDetectDevice();
	const { formatMessage } = useIntl();
	return (
		<SectionContainer>
			<Container>
				<IntroContainer>
					<TopSectionContainer
						justifyContent='space-around'
						flexDirection={isMobile ? 'column' : 'row'}
						alignItems={isMobile ? 'center' : 'stretch'}
						gap='32px'
					>
						<IntroTitle>
							<H3 weight={700}>
								{formatMessage({ id: 'label.giveth_is' })}
								<UnderlinedText>
									{formatMessage({ id: 'label.rewarding' })}
								</UnderlinedText>{' '}
								{formatMessage({
									id: 'label.and_empowering_those_who_give_to',
								})}
							</H3>
							<ButtonsContainer gap='16px'>
								<ButtonLink
									label={formatMessage({
										id: 'label.explore_projects',
									})}
									icon={<IconChevronRight24 />}
								/>
								<ButtonLink
									linkType='texty-secondary'
									label={formatMessage({
										id: 'label.our_mission',
									})}
									icon={<IconChevronRight24 />}
								/>
							</ButtonsContainer>
						</IntroTitle>
						<div>
							<Image
								src={introBanner}
								alt='intro-banner'
								width={300}
							/>
						</div>
						<TopWaveContainer>
							<Wave />
						</TopWaveContainer>
						<BottomWaveContainer>
							<Wave color='#FFC9E2' />
						</BottomWaveContainer>
					</TopSectionContainer>
					<IntroCards
						justifyContent='space-between'
						gap='24px'
						flexDirection={isMobile ? 'column' : 'row'}
						alignItems={isMobile ? 'center' : 'stretch'}
					>
						<IntroCard
							Icon={<IconDonation32 />}
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
							Icon={<IconBulbOutline32 />}
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
							Icon={<IconSpark32 />}
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
`;

const UnderlinedText = styled.span`
	text-decoration: underline;
	text-decoration-skip-ink: none;
`;

const ButtonsContainer = styled(Flex)`
	margin-top: 16px;
	flex-direction: column;
	${mediaQueries.mobileL} {
		flex-direction: row;
	}
`;

const IntroCards = styled(Flex)`
	margin-top: 40px;
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

export default IntroBlock;
