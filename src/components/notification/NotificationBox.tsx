import styled from 'styled-components';
import { IconHeartOutline24, neutralColors } from '@giveth/ui-design-system';
import { Flex } from '../styled-components/Flex';
import { convertRawDataToHTML, INotificationData } from '@/helpers/html';
import type { FC } from 'react';

interface INotificationBox {
	notification: INotificationData;
}

export const NotificationBox: FC<INotificationBox> = ({ notification }) => {
	return (
		<NotificationBoxContainer gap='16px'>
			<IconContainer>
				<IconHeartOutline24 />
			</IconContainer>
			<NotificationContent>
				<div>{convertRawDataToHTML(notification)}</div>
				{notification.quote && (
					<NotificationQuote>{notification.quote}</NotificationQuote>
				)}
				<NotificationTime>
					{/* {new Date(notification.time)} */}
				</NotificationTime>
			</NotificationContent>
		</NotificationBoxContainer>
	);
};

const IconContainer = styled.div`
	padding-top: 4px;
`;

const NotificationBoxContainer = styled(Flex)`
	padding: 24px;
`;

const NotificationContent = styled.div``;

const NotificationQuote = styled.div`
	border-left: 4px solid ${neutralColors.gray[400]};
	font-weight: bold;
	padding-left: 16px;
	margin-top: 16px;
`;

const NotificationTime = styled.div`
	margin-top: 16px;
`;
