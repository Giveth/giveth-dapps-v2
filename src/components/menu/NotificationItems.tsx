import {
	P,
	brandColors,
	Overline,
	neutralColors,
	GLink,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import React, { FC } from 'react';
import styled from 'styled-components';
import Routes from '@/lib/constants/Routes';
import { NotificationBox } from '../notification/NotificationBox';
import { useItemsContext } from '@/context/Items.context';
import { INotification } from '@/features/notification/notification.types';

interface INotificationMenuProps {
	notifications: INotification[] | [];
	markOneNotificationRead: (notificationId: number) => void;
}

export const NotificationItems: FC<INotificationMenuProps> = ({
	notifications,
	markOneNotificationRead,
}) => {
	const { close } = useItemsContext();

	return (
		<>
			<NotificationsTitle styleType='Small'>
				NOTIFICATIONS
			</NotificationsTitle>
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
				<AllNotificationsLink
					onClick={close}
					color={brandColors.pinky[500]}
				>
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
