import { neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import OnboardingMainHeader from '@/components/views/landings/onboarding/main/Header';
import GetStarted from '@/components/views/landings/onboarding/main/GetStarted';
import WhatIsGiveth from '@/components/views/landings/onboarding/main/WhatIsGiveth';
import WhatIsGIV from '@/components/views/landings/onboarding/main/WhatIsGIV';
import StepByStep from '@/components/views/landings/onboarding/main/StepByStep';
import Divider from '@/components/Divider';
import ExploringMore from '@/components/views/landings/onboarding/main/ExploringMore';
import GivethIsHelping from '@/components/views/landings/onboarding/main/GivethIsHelping';
import WhatElse from '@/components/views/landings/onboarding/main/WhatElse';
import JoinOurCommunity from '@/components/views/landings/onboarding/main/JoinOurCommunity';

const OnboardingMainIndex = () => {
	return (
		<Wrapper>
			<OnboardingMainHeader />
			<GetStarted />
			<WhatIsGiveth />
			<WhatIsGIV />
			<StepByStep />
			<Divider height='29px' color={neutralColors.gray[200]} />
			<ExploringMore />
			<Divider height='29px' color={neutralColors.gray[200]} />
			<GivethIsHelping />
			<Divider height='29px' color={neutralColors.gray[200]} />
			<WhatElse />
			<JoinOurCommunity />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background: white;
	padding-top: 40px;
	padding-bottom: 90px;
`;

export default OnboardingMainIndex;
