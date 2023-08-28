import { brandColors, H3, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common.styled';
import { Bullets } from '@/components/styled-components/Bullets';
import ExternalLink from '@/components/ExternalLink';

const WhatIsGiveth = () => {
	return (
		<OnboardingWrapperStyle>
			<H3 weight={700}>What is Giveth?</H3>
			<Lead size='large'>
				Giveth is a crypto donation platform & vibrant community
				centered around Building the Future of Giving and completely
				transforming how we fund nonprofits and social causes.
				<br />
				<br />
				Our easy-to-use crypto donation platform allows users around the
				world to instantly send cryptocurrency to impactful projects on
				the ground.
			</Lead>
			<Lead size='large'>
				We've been around since 2016, and we're only getting started.
				The benefits of our crypto native platform include:
			</Lead>
			<Bullets>
				<li>
					<H5Styled>Zero-fees</H5Styled>
					<LeadStyled>
						: It is completely free to list a project, donate, and
						receive funds
					</LeadStyled>
				</li>
				<li>
					<H5Styled>No Intermediaries</H5Styled>
					<LeadStyled>
						: 100% of all funds go directly from donor to project
					</LeadStyled>
				</li>
				<li>
					<H5Styled>Get rewarded for donating</H5Styled>
					<LeadStyled>
						: Earn crypto rewards every time you donate to a
						verified project on Giveth.
					</LeadStyled>
				</li>
			</Bullets>
			<Lead size='large'>
				Learn more about our vision to leverage blockchain technologies
				to evolve fundraising for nonprofits.
			</Lead>
			<Lead size='large'>
				At Giveth you can invest in projects you believe in, while
				donating to them and actually earning rewards in return. Read
				our article{' '}
				<ExternalLink
					href='https://blog.giveth.io/evolving-nonprofits-into-regen-economies-f8282f97f8d3'
					title='Evolving Nonprofits into Regen Economies'
					color={brandColors.pinky[500]}
				/>{' '}
				to learn more.
			</Lead>
		</OnboardingWrapperStyle>
	);
};

const H5Styled = styled.span`
	font-size: 25px;
	font-weight: 700;
`;

const LeadStyled = styled.span`
	font-size: 24px;
`;

const OnboardingWrapperStyle = styled(OnboardingWrapper)`
	> * {
		margin-bottom: 16px;
	}
`;

export default WhatIsGiveth;
