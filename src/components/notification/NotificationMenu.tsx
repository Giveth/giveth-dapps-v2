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
import { fetchNotificationsData } from '@/features/notification/notification.services';
import { INotification } from '@/features/notification/notification.types';

const NotificationMenu = () => {
	const [isMounted, setIsMounted] = useState(false);
	const theme = useAppSelector(state => state.general.theme);
	const [notifications, setNotifications] = useState<INotification[]>([]);

	useEffect(() => {
		setIsMounted(true);
		fetchNotificationsData().then(res => {
			if (res?.notifications) setNotifications(res.notifications);
		});
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
