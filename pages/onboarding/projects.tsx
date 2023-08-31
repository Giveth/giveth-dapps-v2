import Head from 'next/head';
import OnboardingOwnerIndex from '@/components/views/landings/onboarding/project-owner';

const OnboardingOwnerRoute = () => {
	return (
		<>
			<Head>
				<title>Giveth | Onboarding Project Owner</title>
			</Head>
			<OnboardingOwnerIndex />
		</>
	);
};

export default OnboardingOwnerRoute;
