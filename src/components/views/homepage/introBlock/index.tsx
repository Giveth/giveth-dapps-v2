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
import { Flex } from '@/components/styled-components/Flex';
import IntroCard from './IntroCard';
import useDetectDevice from '@/hooks/useDetectDevice';

const IntroBlock = () => {
	const { isMobile } = useDetectDevice();
	const { formatMessage } = useIntl();
	return (
		<SectionContainer>
			<Container>
				<IntroContainer>
					<Flex
						justifyContent='space-around'
						flexDirection={isMobile ? 'column' : 'row'}
						alignItems={isMobile ? 'center' : 'stretch'}
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
									label='Explore projects'
									icon={<IconChevronRight24 />}
								/>
								<ButtonLink
									linkType='texty-secondary'
									label='Our mission'
									icon={<IconChevronRight24 />}
								/>
							</ButtonsContainer>
						</IntroTitle>
						<div>Image</div>
					</Flex>
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
									label='HOW IT WORKS	'
									icon={<IconChevronRight24 />}
								/>
							}
							title='Zero fees'
							description='Create a project or donate directly to for-good projects with zero fees.'
						/>
						<IntroCard
							Icon={<IconBulbOutline32 />}
							LinkComponent={
								<ButtonLink
									linkType='texty-secondary'
									label='LEARN MORE'
									icon={<IconChevronRight24 />}
								/>
							}
							title='Earn rewards'
							description='By donating crypto to verified projects, you get rewarded!'
						/>
						<IntroCard
							Icon={<IconSpark32 />}
							LinkComponent={
								<ButtonLink
									linkType='texty-primary'
									label='GET STARTED'
									icon={<IconChevronRight24 />}
								/>
							}
							title='Easy onboarding'
							description='New to crypto? No Problem Start right here'
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
	margin-top: 200px;
`;

const IntroTitle = styled.div`
	max-width: 500px;
`;

const UnderlinedText = styled.span`
	text-decoration: underline;
	text-decoration-skip-ink: none;
`;

const ButtonsContainer = styled(Flex)`
	margin-top: 16px;
`;

const IntroCards = styled(Flex)`
	margin-top: 40px;
`;

export default IntroBlock;
