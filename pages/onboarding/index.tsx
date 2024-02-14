import OnboardingMainIndex from '@/components/views/landings/onboarding/main';
import { GeneralMetatags } from '@/components/Metatag';
import { generalOnboardingMetaTags } from 'src/content/metatags';

const OnboardingRoute = () => {
	return (
		<>
			<GeneralMetatags info={generalOnboardingMetaTags} />
			<OnboardingMainIndex />
		</>
	);
};

export default OnboardingRoute;
