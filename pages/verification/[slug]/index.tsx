import Head from 'next/head';
import React, { useEffect } from 'react';
import VerificationIndex from '@/components/views/verification/VerificationIndex';
import { setShowFooter } from '@/features/general/general.slice';
import { VerificationProvider } from '@/context/verification.context';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import Spinner from '@/components/Spinner';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import { isUserRegistered } from '@/lib/helpers';
import CompleteProfile from '@/components/CompleteProfile';

const VerificationRoute = () => {
	const dispatch = useAppDispatch();

	const { isLoading, isEnabled, isSignedIn, userData } = useAppSelector(
		state => state.user,
	);

	useEffect(() => {
		dispatch(setShowFooter(false));
		return () => {
			dispatch(setShowFooter(true));
		};
	}, []);

	if (isLoading) {
		return <Spinner />;
	} else if (!isEnabled) {
		return <WalletNotConnected />;
	} else if (!isSignedIn) {
		return <UserNotSignedIn />;
	} else if (!isUserRegistered(userData)) {
		return <CompleteProfile />;
	}

	return (
		<VerificationProvider>
			<Head>
				<title>Verify a Project | Giveth</title>
			</Head>
			<VerificationIndex />
		</VerificationProvider>
	);
};

export default VerificationRoute;
