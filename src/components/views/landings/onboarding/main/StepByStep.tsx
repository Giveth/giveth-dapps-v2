import styled from 'styled-components';
import { brandColors, H3, H5, mediaQueries } from '@giveth/ui-design-system';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common/common.styled';
import VerticalNumberedSteps from '@/components/VerticalNumberedSteps';
import mainSteps from '@/components/views/landings/onboarding/main/steps';
import { Relative } from '@/components/styled-components/Position';
import Wave from '@/components/particles/Wave';

const StepByStep = () => {
	return (
		<Relative>
			<Wrapper>
				<div>
					<H5 weight={700}>A step-by-step approach</H5>
					<H3 weight={700}>Ready to give Giveth a whirl?</H3>
				</div>
				<VerticalNumberedSteps inputArray={mainSteps} />
			</Wrapper>
			<WaveWrapper>
				<Wave color={brandColors.giv[500]} />
			</WaveWrapper>
		</Relative>
	);
};

const WaveWrapper = styled.div`
	position: absolute;
	bottom: 250px;
	right: -40px;
	display: none;
	${mediaQueries.tablet} {
		display: block;
	}
`;

const Wrapper = styled(OnboardingWrapper)`
	margin: 75px auto 130px;
	text-align: center;
	> div:first-child {
		margin-bottom: 32px;
	}
`;

export default StepByStep;
