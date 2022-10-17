import Head from 'next/head';
import React from 'react';
import OnboardView from '@/components/views/onboarding/Onboarding.view';

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
