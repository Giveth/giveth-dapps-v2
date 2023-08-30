import styled from 'styled-components';
import { Button, H4, IconChevronRight32 } from '@giveth/ui-design-system';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common.styled';

const GivethIsHelping = () => {
	return (
		<OnboardingWrapper>
			<Wrapper>
				<H4 weight={700}>Giveth is truly helping public goods</H4>
				<H4>
					We believe we can make change and create a better world to
					live in!
				</H4>
				<Button
					buttonType='texty-primary'
					label='Explore projects on Giveth'
					icon={<IconChevronRight32 />}
				/>
			</Wrapper>
		</OnboardingWrapper>
	);
};

const Wrapper = styled.div`
	padding: 120px 40px;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export default GivethIsHelping;
