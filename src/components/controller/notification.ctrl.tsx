import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import config from '@/configuration';

import { fetchNotificationCountAsync } from '@/features/notification/notification.thunks';

const NotificationController = () => {
	const dispatch = useAppDispatch();
	const { isEnabled } = useAppSelector(state => state.user);
	const { address } = useAccount();

	useEffect(() => {
		let interval: NodeJS.Timer;
		if (isEnabled && address) {
			dispatch(fetchNotificationCountAsync(address));
			interval = setInterval(() => {
				dispatch(fetchNotificationCountAsync(address));
			}, config.NOTIFICATION_POLLING_INTERVAL);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [dispatch, isEnabled, address]);
	return null;
};

export default NotificationController;
