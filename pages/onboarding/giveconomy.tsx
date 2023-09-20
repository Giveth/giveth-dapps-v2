import Head from 'next/head';
import OnboardingGIVeconomyIndex from '@/components/views/landings/onboarding/GIVeconomy';

const OnboardingGIVeconomyRoute = () => {
	return (
		<>
			<Head>
				<title>Giveth | Onboarding GIVeconomy</title>
			</Head>
			<OnboardingGIVeconomyIndex />
		</>
	);
};

export default OnboardingGIVeconomyRoute;
