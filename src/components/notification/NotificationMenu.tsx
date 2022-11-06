import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	GLink,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import { MenuContainer } from '../menu/Menu.sc';
import { NotificationBox } from './NotificationBox';
import Routes from '@/lib/constants/Routes';
import { INotification } from '@/features/notification/notification.types';
import { fetchNotificationsData } from '@/features/notification/notification.services';

const NotificationMenu = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [notifications, setNotifications] = useState<INotification[]>([]);

	const { isSignedIn } = useAppSelector(state => state.user);
	const theme = useAppSelector(state => state.general.theme);
	const { lastNotificationId } = useAppSelector(
		state => state.notification.notificationInfo,
	);

	const lastFetchedNotificationId = notifications[0]?.id ?? undefined;

	useEffect(() => {
		setIsMounted(true);
		const fetchNotificationsAndSetState = async () => {
			if (!isSignedIn) return;
			try {
				const res = await fetchNotificationsData();
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
	}, []);

	console.log('Notifications', notifications);

	return (
		<NotifsMenuContainer isMounted={isMounted} theme={theme}>
			<NotificationsTitle styleType='Small'>
				NOTIFICATIONS
			</NotificationsTitle>
			<br />
			<br />
			{notifications
				.map(notification => (
					<>
						<NotificationBox
							key={notification.id}
							short={true}
							notification={notification}
						/>
						<br />
					</>
				))
				.slice(0, 5)}
			<br />
			<Link href={Routes.Notifications} passHref>
				<AllNotificationsLink color={brandColors.pinky[500]}>
					All notifications
				</AllNotificationsLink>
			</Link>
		</NotifsMenuContainer>
	);
};

export default NotificationMenu;

const NotifsMenuContainer = styled(MenuContainer)`
	height: unset;
	overflow-y: auto;
`;

const NotificationsTitle = styled(Overline)`
	color: ${neutralColors.gray[700]};
`;

const AllNotificationsLink = styled(GLink)`
	display: flex;
	justify-content: center;
	color: ${brandColors.pinky[500]};
`;
