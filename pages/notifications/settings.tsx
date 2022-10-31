import Head from 'next/head';
import React from 'react';
import SettingsIndex from '@/components/views/notification/notificationSettings';
import { NotificationSettingsProvider } from '@/context/notificationSettings.context';

const NotificationSettingsRoute = () => {
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
