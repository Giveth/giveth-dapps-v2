import Head from 'next/head';
import React from 'react';
import OnboardView from '@/components/views/onboarding/Onboarding.view';
import Spinner from '@/components/Spinner';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import { useAppSelector } from '@/features/hooks';

const OnboardingRoute = () => {
	const { isLoading, isEnabled, isSignedIn } = useAppSelector(
		state => state.user,
	);

	if (isLoading) {
		return <Spinner />;
	} else if (!isEnabled) {
		return <WalletNotConnected />;
	} else if (!isSignedIn) {
		return <UserNotSignedIn />;
	}

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
