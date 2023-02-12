import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import config from '@/configuration';

import { fetchNotificationCountAsync } from '@/features/notification/notification.thunks';

const NotificationController = () => {
	const dispatch = useAppDispatch();
	const { isEnabled } = useAppSelector(state => state.user);
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
	}, [dispatch, isEnabled, account]);
	return null;
};

export default NotificationController;
