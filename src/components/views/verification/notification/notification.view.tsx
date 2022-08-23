import {
	H5,
	IconNotificationOutline32,
	Lead,
	P,
	B,
	GLink,
} from '@giveth/ui-design-system';
import { ReactNode } from 'react';
import { Flex } from '@/components/styled-components/Flex';
import { NotificationContainer } from './notification.sc';

const templateToHTML = (template: any) => {
	const { content, metaData } = template;
	const res: ReactNode[] = [];
	content.forEach((cont: any) => {
		const c: string = cont.content;
		const temp = c.startsWith('$') ? metaData[c] : c;
		switch (cont.type) {
			case 'p':
				res.push(<P as='span'>{temp}</P>);
				break;
			case 'b':
				res.push(<B as='span'>{temp}</B>);
				break;
			case 'a':
				const c: string = cont.content;
				res.push(<GLink href={metaData[cont.href]}>{temp}</GLink>);
				break;
			default:
				break;
		}
		res.push(' ');
	});
	return res;
};

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
				<div>
					{notifs.map((notif, idx) => (
						<div key={idx}>{templateToHTML(notif)}</div>
					))}
				</div>
			</NotificationContainer>
		</>
	);
}

export default NotificationView;

const notifs = [
	{
		icon: '',
		content: [
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
			$amount: '400.2',
			$farm: 'givfarm',
			$href1: '/givfarm',
		},
		time: '193543213645',
		qutoe: 'hey bro, how are you?',
	},
	{
		icon: '',
		content: [
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
			$amount: '400.2',
			$farm: 'givfarm',
			$href1: '/givfarm',
		},
		time: '193543213645',
		qutoe: 'hey bro, how are you?',
	},
];
