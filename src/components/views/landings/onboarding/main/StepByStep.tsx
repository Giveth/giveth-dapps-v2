import styled from 'styled-components';
import { H3, H5 } from '@giveth/ui-design-system';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common.styled';

const StepByStep = () => {
	return (
		<Wrapper>
			<H5 weight={700}>A step-by-step approach</H5>
			<H3 weight={700}>Ready to give Giveth a whirl?</H3>
		</Wrapper>
	);
};

const Wrapper = styled(OnboardingWrapper)`
	margin: 75px auto 130px;
	text-align: center;
`;

export default StepByStep;
