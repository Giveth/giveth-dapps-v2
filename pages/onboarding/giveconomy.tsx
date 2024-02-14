import OnboardingGIVeconomyIndex from '@/components/views/landings/onboarding/GIVeconomy';
import { GeneralMetatags } from '@/components/Metatag';
import { giveconomyOnboardingMetaTags } from 'src/content/metatags';

const OnboardingGIVeconomyRoute = () => {
	return (
		<>
			<GeneralMetatags info={giveconomyOnboardingMetaTags} />
			<OnboardingGIVeconomyIndex />
		</>
	);
};

export default OnboardingGIVeconomyRoute;
