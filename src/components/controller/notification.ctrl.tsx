import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import config from '@/configuration';

import { fetchNotificationCountAsync } from '@/features/notification/notification.thunks';

const NotificationController = () => {
	const dispatch = useAppDispatch();
	const isSignedIn = useAppSelector(state => state.user.isSignedIn);

	useEffect(() => {
		let interval: NodeJS.Timer;
		if (isSignedIn) {
			dispatch(fetchNotificationCountAsync());
			interval = setInterval(() => {
				dispatch(fetchNotificationCountAsync());
			}, config.NOTIFICATION_POLLING_INTERVAL);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isSignedIn, dispatch]);
	return null;
};

export default NotificationController;
