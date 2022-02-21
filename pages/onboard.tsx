import OnboardView from '@/components/views/onboarding/Onboarding.view';
import Head from 'next/head';

const OnboardingRoute = () => {
	return (
		<>
			<Head>
				<title>Onboarding | Giveth</title>
			</Head>
			<OnboardView />
		</>
	);
};

export default OnboardingRoute;
