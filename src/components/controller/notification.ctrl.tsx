import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useAppDispatch } from '@/features/hooks';
import config from '@/configuration';

import { fetchNotificationInfoAsync } from '@/features/notification/notification.thunks';

const NotificationController = () => {
	const dispatch = useAppDispatch();
	const { account } = useWeb3React();

	useEffect(() => {
		const interval = setInterval(() => {
			dispatch(fetchNotificationInfoAsync());
		}, config.NOTIFICATION_POLLING_INTERVAL);
		return () => {
			clearInterval(interval);
		};
	}, [account, dispatch]);
	return null;
};

export default NotificationController;
