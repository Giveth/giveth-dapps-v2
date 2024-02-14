import OnboardingGIVeconomyIndex from '@/components/views/landings/onboarding/GIVeconomy';
import { GeneralMetatags } from '@/components/Metatag';
import giveconBanner from 'public/images/onboard/metadata-givecon-banner.svg';
import Routes from '@/lib/constants/Routes';

const OnboardingGIVeconomyRoute = () => {
	return (
		<>
			<GeneralMetatags
				info={{
					title: 'Giveth Onboarding | GIVeconomy',
					desc: 'Learn how to use the GIVeconomy like a pro with this onboarding guide!',
					image: giveconBanner,
					url: Routes.OnboardingGiveconomy,
				}}
			/>
			<OnboardingGIVeconomyIndex />
		</>
	);
};

export default OnboardingGIVeconomyRoute;
