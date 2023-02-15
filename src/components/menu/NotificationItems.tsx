import {
	P,
	brandColors,
	Overline,
	neutralColors,
	GLink,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import Routes from '@/lib/constants/Routes';
import { NotificationBox } from '../notification/NotificationBox';
import { useAppSelector } from '@/features/hooks';
import { fetchNotificationsData } from '@/features/notification/notification.services';
import { useNotification } from '@/hooks/useNotification';

export const NotificationItems = () => {
	const { notifications, setNotifications, markOneNotificationRead } =
		useNotification();

	const { lastNotificationId } = useAppSelector(
		state => state.notification.notificationInfo,
	);

	const lastFetchedNotificationId = notifications[0]?.id ?? undefined;

	useEffect(() => {
		const fetchNotificationsAndSetState = async () => {
			try {
				const res = await fetchNotificationsData({ limit: 4 });
				if (res?.notifications) setNotifications(res.notifications);
			} catch {
				console.log('Error fetching notifications');
			}
		};

		if (
			typeof lastFetchedNotificationId === 'number' &&
			lastNotificationId > lastFetchedNotificationId
		) {
			fetchNotificationsAndSetState();
			return;
		}

		fetchNotificationsAndSetState();
	}, [lastNotificationId]);

	return (
		<>
			<NotificationsTitle styleType='Small'>
				NOTIFICATIONS
			</NotificationsTitle>
			<br />
			<br />
			{notifications?.length > 0 ? (
				notifications.map(notification => (
					<NotificationBox
						key={notification.id}
						short={true}
						notification={notification}
						markOneNotificationRead={markOneNotificationRead}
					/>
				))
			) : (
				<P>You have no notification</P>
			)}
			<br />
			<Link href={Routes.Notifications} passHref>
				<AllNotificationsLink color={brandColors.pinky[500]}>
					All notifications
				</AllNotificationsLink>
			</Link>
		</>
	);
};

const NotificationsTitle = styled(Overline)`
	color: ${neutralColors.gray[700]};
`;

const AllNotificationsLink = styled(GLink)`
	display: flex;
	justify-content: center;
	color: ${brandColors.pinky[500]};
`;
