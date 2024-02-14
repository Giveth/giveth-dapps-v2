import OnboardingOwnerIndex from '@/components/views/landings/onboarding/project-owner';
import { GeneralMetatags } from '@/components/Metatag';
import projectBanner from 'public/images/onboard/metadata-project-banner.svg';
import Routes from '@/lib/constants/Routes';

const OnboardingOwnerRoute = () => {
	return (
		<>
			<GeneralMetatags
				info={{
					title: 'Giveth Onboarding | Projects',
					desc: 'Learn how to manage your Giveth project like a pro with this onboarding guide!',
					image: projectBanner,
					url: Routes.OnboardingProjects,
				}}
			/>
			<OnboardingOwnerIndex />
		</>
	);
};

export default OnboardingOwnerRoute;
