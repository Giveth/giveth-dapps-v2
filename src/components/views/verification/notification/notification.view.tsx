import { H5, IconNotificationOutline32, Lead } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { NotificationContainer } from './notification.sc';

function NotificationView() {
	return (
		<>
			<NotificationContainer>
				<Flex gap='8px'>
					<IconNotificationOutline32 />
					<div>
						<H5 weight={700}>Notification Center</H5>
						<Lead>
							Your activity history, starting with the Most recent
						</Lead>
					</div>
				</Flex>
			</NotificationContainer>
		</>
	);
}

export default NotificationView;
