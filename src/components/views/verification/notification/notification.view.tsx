import { H5, IconNotificationOutline32, Lead } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { NotificationContainer, NotificationTitle } from './notification.sc';
import { INotificationData } from '@/helpers/html';
import { NotificationBox } from '@/components/notification/NotificationBox';

function NotificationView() {
	return (
		<NotificationContainer>
			<NotificationTitle>
				<Flex gap='8px'>
					<IconNotificationOutline32 />
					<div>
						<H5 weight={700}>Notification Center</H5>
						<Lead>
							Your activity history, starting with the Most recent
						</Lead>
					</div>
				</Flex>
			</NotificationTitle>
			<div>
				{notifications.map((notification, idx) => (
					<NotificationBox key={idx} notification={notification} />
				))}
			</div>
		</NotificationContainer>
	);
}

export default NotificationView;

const notifications: INotificationData[] = [
	{
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'b',
				content: 'GIV tokens',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href',
			},
			{
				type: 'p',
				content: 'for',
			},
			{
				type: 'b',
				content: '$apr',
			},
			{
				type: 'b',
				content: 'APR',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href: '/givfarm',
			apr: '18.2%',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?\n good, an you?',
	},
];
