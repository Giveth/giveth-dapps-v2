import React from 'react';
import OnboardView from '@/components/views/onboarding/Onboarding.view';
import { GeneralMetatags } from '@/components/Metatag';
import generalBanner from 'public/images/onboard/metadata-general-banner.svg';
import Routes from '@/lib/constants/Routes';

const OnboardingRoute = () => {
	return (
		<>
			<GeneralMetatags
				info={{
					title: 'Onboarding | Giveth',
					desc: 'Learn how to use the Giveth platform like a pro with this onboarding guide!',
					image: generalBanner,
					url: Routes.Onboarding,
				}}
			/>

			<OnboardView />
		</>
	);
};

export default OnboardingRoute;
