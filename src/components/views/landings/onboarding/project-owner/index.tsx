import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import OnboardingHeader from '@/components/views/landings/onboarding/common/Header';
import MainContentCreator from '@/components/views/landings/onboarding/common/MainContentCreator';
import Divider from '@/components/Divider';
import WhatElse from '@/components/views/landings/onboarding/common/WhatElse';
import {
	donorCard,
	GIVeconomyCard,
} from '@/components/views/landings/onboarding/common/cards';
import projectOwnerSteps from '@/components/views/landings/onboarding/project-owner/projectOwnerSteps';
import Routes from '@/lib/constants/Routes';

const OnboardingOwnerIndex = () => {
	return (
		<Wrapper>
			<OnboardingHeader
				title='Get Started as a Project owner'
				subtitle='Create project, promote it and raise donations'
			/>
			<MainContentCreator {...content} />
			<Divider height='29px' color={neutralColors.gray[200]} />
			<WhatElse cards={[donorCard, GIVeconomyCard]} />
		</Wrapper>
	);
};

const content = {
	title: 'Become a project Owner on Giveth',
	description:
		'We may be biased, but we really believe that Giveth is the best donation platform in the world. When you raise funds for your project on Giveth, you receive 100% of every cent that was donated to you since Giveth takes zero fees. Not only that, but you can also earn rewards when you refer others to donate on Giveth! Check out our resources below to learn how to quickly and easily launch your project on Giveth and join us in the Future of Giving',
	steps: projectOwnerSteps,
	buttonLink: Routes.CreateProject,
	buttonText: 'CREATE PROJECT',
};

const Wrapper = styled.div`
	background: white;
	padding-top: 40px;
	padding-bottom: 90px;
`;

export default OnboardingOwnerIndex;
