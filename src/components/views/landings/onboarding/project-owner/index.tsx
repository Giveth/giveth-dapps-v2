import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import OnboardingHeader from '@/components/views/landings/onboarding/common/Header';
import BecomeProjectOwner from '@/components/views/landings/onboarding/project-owner/BecomeProjectOwner';
import Divider from '@/components/Divider';
import WhatElse from '@/components/views/landings/onboarding/common/WhatElse';
import {
	donorCard,
	GIVeconomyCard,
} from '@/components/views/landings/onboarding/common/cards';

const OnboardingOwnerIndex = () => {
	return (
		<Wrapper>
			<OnboardingHeader
				title='Get Started as a Project owner'
				subtitle='Create project, promote it and raise donations'
			/>
			<BecomeProjectOwner />
			<Divider height='29px' color={neutralColors.gray[200]} />
			<WhatElse cards={[donorCard, GIVeconomyCard]} />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background: white;
	padding-top: 40px;
	padding-bottom: 90px;
`;

export default OnboardingOwnerIndex;
