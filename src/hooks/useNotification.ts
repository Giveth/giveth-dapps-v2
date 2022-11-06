import { useState } from 'react';
import { INotification } from '@/features/notification/notification.types';

export const useNotification = () => {
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const markOneNotificationRead = (notificationId: number) => {
		console.log('notificationId', notificationId);
		setNotifications(oldNotifications =>
			oldNotifications.map(oldNotif =>
				oldNotif.id === notificationId
					? { ...oldNotif, isRead: true }
					: oldNotif,
			),
		);
	};
	return { notifications, setNotifications, markOneNotificationRead };
};
