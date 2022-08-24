import styled from 'styled-components';
import {
	B,
	brandColors,
	IconHeartOutline24,
	neutralColors,
} from '@giveth/ui-design-system';
import { Flex } from '../styled-components/Flex';
import { convertRawDataToHTML, INotificationData } from '@/helpers/html';
import type { FC } from 'react';

interface INotificationBox {
	notification: INotificationData;
	short?: boolean;
}

export const NotificationBox: FC<INotificationBox> = ({
	notification,
	short = false,
}) => {
	return (
		<NotificationBoxContainer gap='16px' isShort={short}>
			{!notification.isRead && <UnreadCircle isShort={short} />}
			{!short && (
				<IconContainer>
					<IconHeartOutline24 />
				</IconContainer>
			)}
			<NotificationContent>
				<div>{convertRawDataToHTML(notification)}</div>
				{!short && notification.quote && (
					<NotificationQuote>{notification.quote}</NotificationQuote>
				)}
				<NotificationTime>
					{/* {new Date(notification.time)} */}
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

const NotificationQuote = styled(B)`
	border-left: 4px solid ${neutralColors.gray[400]};
	font-weight: bold;
	padding-left: 16px;
	margin-top: 16px;
	white-space: pre-wrap;
	&::before {
		content: '"';
	}
	&::after {
		content: '"';
	}
`;

const NotificationTime = styled.div`
	margin-top: 16px;
`;
