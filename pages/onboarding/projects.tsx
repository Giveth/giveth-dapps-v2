import OnboardingOwnerIndex from '@/components/views/landings/onboarding/project-owner';
import { GeneralMetatags } from '@/components/Metatag';
import { projectOnboardingMetaTags } from 'src/content/metatags';

const OnboardingOwnerRoute = () => {
	return (
		<>
			<GeneralMetatags info={projectOnboardingMetaTags} />
			<OnboardingOwnerIndex />
		</>
	);
};

export default OnboardingOwnerRoute;
