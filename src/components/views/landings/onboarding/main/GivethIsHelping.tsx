import styled from 'styled-components';
import { Button, H4, IconChevronRight32 } from '@giveth/ui-design-system';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common/common.styled';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';
import { Relative } from '@/components/styled-components/Position';
import ArcWithDot from '@/components/particles/ArcWithDot';
import Plus from '@/components/particles/Plus';

const GivethIsHelping = () => {
	return (
		<Relative>
			<OnboardingWrapper>
				<Wrapper>
					<H4 weight={700}>Giveth is truly helping public goods</H4>
					<H4>
						We believe we can make change and create a better world
						to live in!
					</H4>
					<ExternalLink href={Routes.Projects}>
						<ButtonStyled
							buttonType='texty-primary'
							label='Explore projects on Giveth'
							icon={<IconChevronRight32 />}
						/>
					</ExternalLink>
				</Wrapper>
			</OnboardingWrapper>
			<ArcWrapper>
				<ArcWithDot />
			</ArcWrapper>
			<PlusWrapper>
				<Plus />
			</PlusWrapper>
		</Relative>
	);
};

const ButtonStyled = styled(Button)`
	padding-left: 0;
	padding-right: 0;
`;

const PlusWrapper = styled.div`
	position: absolute;
	right: 50px;
	bottom: 50px;
`;

const ArcWrapper = styled.div`
	position: absolute;
	rotate: 190deg;
	top: 40px;
	left: -10px;
`;

const Wrapper = styled.div`
	align-items: flex-start;
	padding: 120px 40px;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export default GivethIsHelping;
