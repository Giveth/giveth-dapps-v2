import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import OnboardingHeader from '@/components/views/landings/onboarding/common/Header';
import MainContentCreator from '@/components/views/landings/onboarding/common/MainContentCreator';
import Divider from '@/components/Divider';
import WhatElse from '@/components/views/landings/onboarding/common/WhatElse';
import {
	GIVeconomyCard,
	projectOwnerCard,
} from '@/components/views/landings/onboarding/common/cards';
import Routes from '@/lib/constants/Routes';
import donorSteps from '@/components/views/landings/onboarding/donor/donorSteps';

const OnboardingDonorIndex = () => {
	return (
		<Wrapper>
			<OnboardingHeader
				title='Get Started as Donor'
				subtitle='Donate to projects, explore donation benefits on Giveth'
			/>
			<MainContentCreator {...content} />
			<Divider height='29px' color={neutralColors.gray[200]} />
			<WhatElse cards={[projectOwnerCard, GIVeconomyCard]} />
		</Wrapper>
	);
};

const content = {
	title: 'Onboarding as a Donor',
	description:
		"Whether you're brand new to crypto, or a seasoned pro, we made it easier than ever to directly support the projects you love on Giveth. Follow along below to learn how you can donate to projects with zero fees as well as earn rewards in GIV tokens!",
	steps: donorSteps,
	buttonLink: Routes.Projects,
	buttonText: 'EXPLORE PROJECTS',
	firstTitleOnRight: true,
};

const Wrapper = styled.div`
	background: white;
	padding-top: 40px;
	padding-bottom: 90px;
`;

export default OnboardingDonorIndex;
