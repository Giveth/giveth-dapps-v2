import { Button, H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { OnboardingHeaderWrapper } from '@/components/views/landings/onboarding/common.styled';
import Input from '@/components/styled-components/Input';

const GetStarted = () => {
	return (
		<OnboardingHeaderWrapperStyled>
			<H5 weight={700}>Get started with our Giveth onboarding guide</H5>
			<InputStyled placeholder='Your email address' />
			<Button size='small' label='Discover the Future of Giving' />
		</OnboardingHeaderWrapperStyled>
	);
};

const InputStyled = styled(Input)`
	max-width: 685px;
`;

const OnboardingHeaderWrapperStyled = styled(OnboardingHeaderWrapper)`
	margin: 64px auto 74px;
	> * {
		margin-bottom: 16px;
	}
`;

export default GetStarted;
