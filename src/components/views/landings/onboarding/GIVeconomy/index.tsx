import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import OnboardingHeader from '@/components/views/landings/onboarding/common/Header';
import MainContentCreator from '@/components/views/landings/onboarding/common/MainContentCreator';
import Divider from '@/components/Divider';
import WhatElse from '@/components/views/landings/onboarding/common/WhatElse';
import {
	donorCard,
	projectOwnerCard,
} from '@/components/views/landings/onboarding/common/cards';
import Routes from '@/lib/constants/Routes';
import GIVeconomySteps from '@/components/views/landings/onboarding/GIVeconomy/GIVeconomySteps';

const OnboardingGIVeconomyIndex = () => {
	return (
		<Wrapper>
			<OnboardingHeader
				title='Explore GIVeconomy'
				subtitle='Get into the economy of giving and how you can benefit from it.'
			/>
			<MainContentCreator {...content} />
			<Divider height='29px' color={neutralColors.gray[200]} />
			<WhatElse cards={[projectOwnerCard, donorCard]} />
		</Wrapper>
	);
};

const content = {
	title: 'What else can you do on Giveth?',
	description:
		"Giveth is more than just a crypto donation platform. With GIV tokens you can take part in governance of the Giveth DAO, earn yield in our GIVfarm pools, boost project rankings with GIVpower and refer friends to Giveth to earn even more rewards. Start exploring everything that's possible in the GIVeconomy!",
	steps: GIVeconomySteps,
	buttonLink: Routes.GIVeconomy,
	buttonText: 'EXPLORE GIVeconomy',
};

const Wrapper = styled.div`
	background: white;
	padding-top: 40px;
	padding-bottom: 90px;
`;

export default OnboardingGIVeconomyIndex;
