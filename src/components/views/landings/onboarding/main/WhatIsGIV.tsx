import {
	brandColors,
	ButtonText,
	H3,
	Lead,
	mediaQueries,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common.styled';
import Routes from '@/lib/constants/Routes';
import InternalLink from '@/components/InternalLink';
import GivPic from 'public/images/onboard/two-giv.svg';
import { Relative } from '@/components/styled-components/Position';
import QuarterCircle from '@/components/particles/QuarterCircle';

const WhatIsGIV = () => {
	return (
		<Relative>
			<OnboardingWrapperStyled>
				<Image src={GivPic} alt='Giv' />
				<Content>
					<H3 weight={700}>What is GIV?</H3>
					<LeadStyled size='large'>
						Giveth is powered by our native cryptocurrency token -
						GIV. You can buy give on the open market, or you can get
						GIV as a reward for donating to{' '}
						<InternalLink
							href={Routes.Projects}
							title='verified projects'
							color={brandColors.pinky[500]}
						/>{' '}
						(through our{' '}
						<InternalLink
							href={Routes.GIVbacks}
							title='GIVbacks'
							color={brandColors.pinky[500]}
						/>{' '}
						program)
					</LeadStyled>
					<InternalLink
						color={brandColors.pinky[500]}
						href='https://docs.giveth.io/blog/welcomeGIVeconomy/#the-giv-token'
					>
						<ButtonText>Read MORE ABOUT GIV HERE</ButtonText>
					</InternalLink>
				</Content>
			</OnboardingWrapperStyled>
			<ParticleWrapper>
				<QuarterCircle color={brandColors.pinky[500]} />
			</ParticleWrapper>
		</Relative>
	);
};

const ParticleWrapper = styled.div`
	position: absolute;
	top: 0;
	right: 39px;
`;

const Content = styled.div`
	max-width: 750px;
	${mediaQueries.tablet} {
		padding-right: 50px;
	}
`;

const OnboardingWrapperStyled = styled(OnboardingWrapper)`
	display: flex;
	gap: 32px;
	justify-content: space-between;
	margin: 170px auto 130px;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const LeadStyled = styled(Lead)`
	margin: 40px 0 24px;
`;

export default WhatIsGIV;
