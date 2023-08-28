import styled from 'styled-components';
import { H2, H4, mediaQueries, neutralColors } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { OnboardingHeaderWrapper } from '@/components/views/landings/onboarding/common.styled';

const OnboardingMainHeader = () => {
	return (
		<OnboardingHeaderWrapper>
			<HeaderWrapper>
				<H2 weight={700}>Get Started with Giveth</H2>
				<H4>A step-by-step beginner’s guide to the Future of Giving</H4>
			</HeaderWrapper>
		</OnboardingHeaderWrapper>
	);
};

const HeaderWrapper = styled(Flex)`
	border-radius: 16px;
	background-image: url('/images/onboard/main-header.svg');
	background-size: cover;
	background-position: right;
	height: 385px;
	margin-top: 40px;
	flex-direction: column;
	justify-content: center;
	color: ${neutralColors.gray[100]};
	padding: 0 24px;
	${mediaQueries.tablet} {
		padding: 0 70px;
	}
	${mediaQueries.laptopS} {
		padding: 0 190px;
	}
	${mediaQueries.laptopL} {
		padding: 0 226px;
	}
	> div:first-child {
		margin-bottom: 16px;
	}
`;

export default OnboardingMainHeader;
