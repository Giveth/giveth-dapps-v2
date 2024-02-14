import OnboardingDonorIndex from '@/components/views/landings/onboarding/donor';
import { GeneralMetatags } from '@/components/Metatag';
import donorBanner from 'public/images/onboard/metadata-donate-banner.svg';
import Routes from '@/lib/constants/Routes';

const OnboardingDonorRoute = () => {
	return (
		<>
			<GeneralMetatags
				info={{
					title: ' Giveth Onboarding | Donors',
					desc: 'Learn how to use the Giveth platform like a pro with this onboarding guide!',
					image: donorBanner,
					url: Routes.OnboardingDonors,
				}}
			/>
			<OnboardingDonorIndex />
		</>
	);
};

export default OnboardingDonorRoute;
