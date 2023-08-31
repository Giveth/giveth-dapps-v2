import styled from 'styled-components';
import { H2, mediaQueries, neutralColors } from '@giveth/ui-design-system';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common/common.styled';
import OnboardingCard, { IOnboardingCard } from '@/components/OnboardingCard';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';

interface IWhatElse {
	cards: IOnboardingCard[];
}

const WhatElse = ({ cards }: IWhatElse) => {
	return (
		<OnboardingWrapper>
			<Wrapper>
				<H2 weight={700}>What else can you do on Giveth?</H2>
				<CardsWrapper>
					{cards.map(i => (
						<OnboardingCard key={i.title} {...i} />
					))}
				</CardsWrapper>
			</Wrapper>
		</OnboardingWrapper>
	);
};

const CardsWrapper = styled(Flex)`
	gap: 60px 20px;
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

const Wrapper = styled(FlexCenter)`
	padding: 93px 0;
    justify-content: space-between;
	flex-direction: column;
	gap: 60px 37px;
	> h2:first-child {
		color: ${neutralColors.gray[700]};
      max-width: 302px;
    };
	}
	${mediaQueries.laptopS} {
	  flex-direction: row;
	}
	${mediaQueries.desktop} {
      padding: 93px 20px;
    }
`;

export default WhatElse;
