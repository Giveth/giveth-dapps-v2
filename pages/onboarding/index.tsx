import Head from 'next/head';
import OnboardingMainIndex from '@/components/views/landings/onboarding/main';

const OnboardingRoute = () => {
	return (
		<>
			<Head>
				<title>Giveth | Onboarding Landing Page</title>
			</Head>
			<OnboardingMainIndex />
		</>
	);
};

export default OnboardingRoute;
