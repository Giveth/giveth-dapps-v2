import OnboardingMainHeader from '@/components/views/landings/onboarding/main/Header';
import GetStarted from '@/components/views/landings/onboarding/main/GetStarted';
import WhatIsGiveth from '@/components/views/landings/onboarding/main/WhatIsGiveth';
import WhatIsGIV from '@/components/views/landings/onboarding/main/WhatIsGIV';
import StepByStep from '@/components/views/landings/onboarding/main/StepByStep';

const OnboardingMainIndex = () => {
	return (
		<>
			<OnboardingMainHeader />
			<GetStarted />
			<WhatIsGiveth />
			<WhatIsGIV />
			<StepByStep />
		</>
	);
};

export default OnboardingMainIndex;
