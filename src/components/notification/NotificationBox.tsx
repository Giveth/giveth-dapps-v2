import styled from 'styled-components';
import { brandColors, Caption, neutralColors } from '@giveth/ui-design-system';
import { FC, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Flex } from '../styled-components/Flex';
import {
	convertRawDataToHTML,
	convertBackendIconsToComponents,
} from '@/helpers/html';
import { INotification } from '@/features/notification/notification.types';
import { setNotificationRead } from '@/features/notification/notification.services';
import { getNowUnixMS } from '@/helpers/time';
import { durationToString } from '@/lib/helpers';

interface INotificationBox {
	notification: INotification;
	short?: boolean;
	markOneNotificationRead: (notificationId: number) => void;
}

export const NotificationBox: FC<INotificationBox> = ({
	notification,
	short = false,
	markOneNotificationRead,
}) => {
	const NotifRef = useRef(null);
	const { formatMessage, locale } = useIntl();

	useEffect(() => {
		if (notification.isRead) return;
		const read = (entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			if (entry.isIntersecting) {
				setNotificationRead(notification.id).then(
					(notif: INotification) =>
						markOneNotificationRead(notification.id),
				);
			}
		};
		let observerRefValue: any = null;
		let observer = new IntersectionObserver(read);
		if (NotifRef.current) {
			observer.observe(NotifRef.current);
			observerRefValue = NotifRef.current;
		}

		return () => {
			if (observerRefValue) observer.unobserve(observerRefValue);
		};
	}, [markOneNotificationRead, notification.id, notification.isRead]);

	return (
		<NotificationBoxContainer
			gap='16px'
			isShort={short}
			ref={NotifRef}
			role='notification'
		>
			{!notification.isRead && <UnreadCircle isShort={short} />}
			{!short && (
				<IconContainer>
					{convertBackendIconsToComponents(
						notification.notificationType?.icon,
					)}
				</IconContainer>
			)}
			<NotificationContent>
				<ConvertedTextContainer>
					{convertRawDataToHTML(notification)}
				</ConvertedTextContainer>
				<NotificationTime medium>
					{formatMessage(
						{ id: 'label.duration_ago' },
						{
							duration: durationToString(
								getNowUnixMS() -
									new Date(notification.createdAt).getTime(),
								1,
								true,
								locale,
							),
						},
					)}
				</NotificationTime>
			</NotificationContent>
		</NotificationBoxContainer>
	);
};

const NotificationBoxContainer = styled(Flex)<{ isShort: boolean }>`
	position: relative;
	padding: ${props => (!props.isShort ? '24px 0' : '4px')};
`;

const IconContainer = styled(Flex)`
	align-items: center;
	padding-top: 4px;
	padding: 5px;
	background-color: ${neutralColors.gray[200]};
	align-self: flex-start;
	border-radius: 50%;
`;

const UnreadCircle = styled.div<{ isShort: boolean }>`
	position: absolute;
	top: ${props => (!props.isShort ? '10px' : '0')};
	left: ${props => (!props.isShort ? '10px' : '-5px')};
	height: 8px;
	width: 8px;
	background-color: ${brandColors.pinky[500]};
	border: 1px solid ${brandColors.pinky[700]};
	border-radius: 4px;
`;

const ConvertedTextContainer = styled.div`
	word-break: break-word;
`;

const NotificationContent = styled.div``;

const NotificationTime = styled(Caption)`
	margin-top: 16px;
	color: ${neutralColors.gray[700]};
`;
