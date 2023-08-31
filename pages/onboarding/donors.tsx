import Head from 'next/head';
import OnboardingDonorIndex from '@/components/views/landings/onboarding/donor';

const OnboardingDonorRoute = () => {
	return (
		<>
			<Head>
				<title>Giveth | Onboarding Donors</title>
			</Head>
			<OnboardingDonorIndex />
		</>
	);
};

export default OnboardingDonorRoute;
