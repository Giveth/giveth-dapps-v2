import Head from 'next/head';
import React, { useEffect } from 'react';
import SettingsIndex from '@/components/views/notification/notificationSettings';
import { NotificationSettingsProvider } from '@/context/notificationSettings.context';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import Spinner from '@/components/Spinner';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import { setShowFooter } from '@/features/general/general.slice';

const NotificationSettingsRoute = () => {
	const dispatch = useAppDispatch();

	const { isLoading, isEnabled, isSignedIn } = useAppSelector(
		state => state.user,
	);

	useEffect(() => {
		dispatch(setShowFooter(false));
	}, []);

	if (isLoading) {
		return <Spinner />;
	} else if (!isEnabled) {
		return <WalletNotConnected />;
	} else if (!isSignedIn) {
		return <UserNotSignedIn />;
	}

	return (
		<NotificationSettingsProvider>
			<Head>
				<title>Notification Settings | Giveth</title>
			</Head>
			<SettingsIndex />
		</NotificationSettingsProvider>
	);
};

export default NotificationSettingsRoute;
