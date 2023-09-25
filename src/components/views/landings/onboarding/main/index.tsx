import { neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import OnboardingHeader from '@/components/views/landings/onboarding/common/Header';
import GetStarted from '@/components/views/landings/onboarding/main/GetStarted';
import WhatIsGiveth from '@/components/views/landings/onboarding/main/WhatIsGiveth';
import WhatIsGIV from '@/components/views/landings/onboarding/main/WhatIsGIV';
import StepByStep from '@/components/views/landings/onboarding/main/StepByStep';
import Divider from '@/components/Divider';
import ExploringMore from '@/components/views/landings/onboarding/main/ExploringMore';
import GivethIsHelping from '@/components/views/landings/onboarding/main/GivethIsHelping';
import WhatElse from '@/components/views/landings/onboarding/common/WhatElse';
import JoinOurCommunity from '@/components/views/landings/onboarding/main/JoinOurCommunity';
import Flower from '@/components/particles/Flower';
import { Relative } from '@/components/styled-components/Position';
import { GIVeconomyCard } from '@/components/views/landings/onboarding/common/cards';

const OnboardingMainIndex = () => {
	return (
		<Wrapper>
			<Relative>
				<OnboardingHeader
					title='Get Started with Giveth'
					subtitle='A step-by-step beginner’s guide to the Future of Giving'
				/>
				<GetStarted />
				<WhatIsGiveth />
				<WhatIsGIV />
				<StepByStep />
				<Divider height='29px' color={neutralColors.gray[200]} />
				<ExploringMore />
				<Divider height='29px' color={neutralColors.gray[200]} />
				<GivethIsHelping />
				<Divider height='29px' color={neutralColors.gray[200]} />
				<WhatElse cards={[GIVeconomyCard]} />
				<JoinOurCommunity />
			</Relative>
			<Flower right='0' top='500px' />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background: white;
	padding-top: 40px;
	padding-bottom: 90px;
	> div:first-child {
		z-index: 1;
	}
`;

export default OnboardingMainIndex;
