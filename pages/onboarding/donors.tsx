import OnboardingDonorIndex from '@/components/views/landings/onboarding/donor';
import { GeneralMetatags } from '@/components/Metatag';
import { donorOnboardingMetaTags } from 'src/content/metatags';
const OnboardingDonorRoute = () => {
	return (
		<>
			<GeneralMetatags info={donorOnboardingMetaTags} />
			<OnboardingDonorIndex />
		</>
	);
};

export default OnboardingDonorRoute;
