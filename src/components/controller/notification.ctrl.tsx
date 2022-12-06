import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import config from '@/configuration';

import { fetchNotificationCountAsync } from '@/features/notification/notification.thunks';
import { useWeb3React } from '@web3-react/core';

const NotificationController = () => {
	const dispatch = useAppDispatch();
	const { isSignedIn, isEnabled } = useAppSelector(state => state.user);
	const { account } = useWeb3React();

	useEffect(() => {
		let interval: NodeJS.Timer;
		if (isEnabled && account) {
			dispatch(fetchNotificationCountAsync(account));
			interval = setInterval(() => {
				dispatch(fetchNotificationCountAsync(account));
			}, config.NOTIFICATION_POLLING_INTERVAL);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isSignedIn, dispatch]);
	return null;
};

export default NotificationController;
