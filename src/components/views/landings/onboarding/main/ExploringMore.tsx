import styled from 'styled-components';
import { H3, mediaQueries, neutralColors } from '@giveth/ui-design-system';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common/common.styled';
import OnboardingCard from '@/components/OnboardingCard';
import { FlexCenter } from '@/components/styled-components/Flex';
import {
	donorCard,
	projectOwnerCard,
} from '@/components/views/landings/onboarding/common/cards';

const ExploringMore = () => {
	return (
		<OnboardingWrapperStyled>
			<H3 weight={700}>Exploring more as a</H3>
			<Cards>
				<OnboardingCard {...projectOwnerCard} />
				<OnboardingCard {...donorCard} />
			</Cards>
		</OnboardingWrapperStyled>
	);
};

const Cards = styled(FlexCenter)`
	margin: 60px 0 0;
	gap: 32px;
	${mediaQueries.tablet} {
		gap: 16px;
	}
	${mediaQueries.laptopS} {
		gap: 80px;
	}
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const OnboardingWrapperStyled = styled(OnboardingWrapper)`
	padding-top: 48px;
	padding-bottom: 93px;
	text-align: center;
	> h3:first-child {
		color: ${neutralColors.gray[700]};
	}
`;

export default ExploringMore;
