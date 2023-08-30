import styled from 'styled-components';
import {
	H2,
	IconFund32,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common.styled';
import OnboardingCard from '@/components/OnboardingCard';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';

const WhatElse = () => {
	return (
		<OnboardingWrapper>
			<Wrapper>
				<H2 weight={700}>What else can you do on Giveth?</H2>
				<OnboardingCard
					icon={<IconFund32 />}
					title='GIVeconomy'
					description='Get into the economy of giving and learn how you can also benefit from it.'
					buttonText='Get started with Giveconomy'
					buttonLink={Routes.OnboardingGiveconomy}
				/>
			</Wrapper>
		</OnboardingWrapper>
	);
};

const Wrapper = styled(FlexCenter)`
	 padding: 93px 0;
  justify-content: space-between;
	flex-direction: column;
	gap: 16px 37px;
	> h2:first-child {
		color: ${neutralColors.gray[700]};
      max-width: 302px;
    };
	}
	${mediaQueries.tablet} {
	  flex-direction: row;
      padding: 93px 40px;
	}
`;

export default WhatElse;
