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

interface INotificationMenuProps {
	notifications: INotification[] | [];
}

const NotificationMenu = ({ notifications }: INotificationMenuProps) => {
	const [isMounted, setIsMounted] = useState(false);
	const theme = useAppSelector(state => state.general.theme);

	useEffect(() => {
		setIsMounted(true);
	}, []);

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
