import OnboardingMainIndex from '@/components/views/landings/onboarding/main';
import { GeneralMetatags } from '@/components/Metatag';
import generalBanner from 'public/images/onboard/metadata-general-banner.svg';
import Routes from '@/lib/constants/Routes';

const OnboardingRoute = () => {
	return (
		<>
			<GeneralMetatags
				info={{
					title: 'Giveth Onboarding | Intro',
					desc: 'Learn how to use the Giveth platform like a pro with this onboarding guide!',
					image: generalBanner,
					url: Routes.Onboarding,
				}}
			/>
			<OnboardingMainIndex />
		</>
	);
};

export default OnboardingRoute;
