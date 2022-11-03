import styled from 'styled-components';
import {
	brandColors,
	Caption,
	IconHeartOutline24,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC, useState, useEffect, useRef } from 'react';
import { Flex } from '../styled-components/Flex';
import { convertRawDataToHTML } from '@/helpers/html';
import { durationToString } from '@/lib/helpers';
import { INotification } from '@/features/notification/notification.types';
import { setNotificationRead } from '@/features/notification/notification.services';

interface INotificationBox {
	notification: INotification;
	short?: boolean;
}

export const NotificationBox: FC<INotificationBox> = ({
	notification,
	short = false,
}) => {
	const [isRead, setIsRead] = useState(notification.isRead);
	const NotifRef = useRef(null);

	useEffect(() => {
		if (isRead) return;
		const read = (entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			if (entry.isIntersecting) {
				setNotificationRead(notification.id).then(
					(notif: INotification) => setIsRead(notif.isRead),
				);
			}
		};
		let observer = new IntersectionObserver(read);
		if (NotifRef.current) observer.observe(NotifRef.current);

		return () => {
			if (NotifRef.current) observer.unobserve(NotifRef.current);
		};
	}, [notification.id]);

	return (
		<NotificationBoxContainer gap='16px' isShort={short} ref={NotifRef}>
			{!isRead && <UnreadCircle isShort={short} />}
			{!short && (
				<IconContainer>
					<IconHeartOutline24 />
				</IconContainer>
			)}
			<NotificationContent>
				<div>{convertRawDataToHTML(notification)}</div>
				{/* {!short && notification.quote && (
					<NotificationQuote>{notification.quote}</NotificationQuote>
				)} */}
				<NotificationTime medium>
					{durationToString(
						Date.now() - new Date(notification.createdAt).getTime(),
						1,
						true,
					) + ' ago'}
				</NotificationTime>
			</NotificationContent>
		</NotificationBoxContainer>
	);
};

const NotificationBoxContainer = styled(Flex)<{ isShort: boolean }>`
	position: relative;
	padding: ${props => (!props.isShort ? '24px' : '4px')};
`;

const IconContainer = styled.div`
	padding-top: 4px;
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

const NotificationContent = styled.div``;

// const NotificationQuote = styled(B)`
// 	border-left: 4px solid ${neutralColors.gray[400]};
// 	font-weight: bold;
// 	padding-left: 16px;
// 	margin-top: 16px;
// 	white-space: pre-wrap;
// 	&::before {
// 		content: '"';
// 	}
// 	&::after {
// 		content: '"';
// 	}
// `;

const NotificationTime = styled(Caption)`
	margin-top: 16px;
	color: ${neutralColors.gray[700]};
`;
