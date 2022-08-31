import { H5, IconNotificationOutline32, Lead } from '@giveth/ui-design-system';
import { useState } from 'react';
import {
	NotificationContainer,
	NotificationHeader,
	IconContainer,
	NotificationDesc,
} from './notification.sc';
import { INotificationData } from '@/helpers/html';
import { NotificationBox } from '@/components/notification/NotificationBox';
import {
	TabsContainer,
	TabItem,
	TabItemCount,
} from '@/components/styled-components/Tabs';
import { useAppSelector } from '@/features/hooks';

enum ENotificationTabs {
	ALL,
	GENERAL,
	PROJECTS,
	GIVECONOMY,
}

function NotificationView() {
	const [tab, setTab] = useState(ENotificationTabs.ALL);
	const {
		total: totalUnreadNotifications,
		general,
		projectsRelated,
		givEconomyRelated,
	} = useAppSelector(state => state.notification.notificationInfo);
	return (
		<NotificationContainer>
			<NotificationHeader gap='8px'>
				<IconContainer>
					<IconNotificationOutline32 />
				</IconContainer>
				<NotificationDesc>
					<H5 weight={700}>Notification Center</H5>
					<Lead>
						Your activity history, starting with the Most recent
					</Lead>
				</NotificationDesc>
			</NotificationHeader>
			<TabsContainer>
				<TabItem
					active={tab === ENotificationTabs.ALL}
					onClick={() => setTab(ENotificationTabs.ALL)}
				>
					All
					<TabItemCount active={tab === ENotificationTabs.ALL}>
						{totalUnreadNotifications}
					</TabItemCount>
				</TabItem>
				<TabItem
					active={tab === ENotificationTabs.GENERAL}
					onClick={() => setTab(ENotificationTabs.GENERAL)}
				>
					General
					<TabItemCount active={tab === ENotificationTabs.GENERAL}>
						{general}
					</TabItemCount>
				</TabItem>
				<TabItem
					active={tab === ENotificationTabs.PROJECTS}
					onClick={() => setTab(ENotificationTabs.PROJECTS)}
				>
					Projects
					<TabItemCount active={tab === ENotificationTabs.PROJECTS}>
						{projectsRelated}
					</TabItemCount>
				</TabItem>
				<TabItem
					active={tab === ENotificationTabs.GIVECONOMY}
					onClick={() => setTab(ENotificationTabs.GIVECONOMY)}
				>
					GIVeconomy
					<TabItemCount active={tab === ENotificationTabs.GIVECONOMY}>
						{givEconomyRelated}
					</TabItemCount>
				</TabItem>
			</TabsContainer>
			<div>
				{notifications.map(notification => (
					<NotificationBox
						key={notification.id}
						notification={notification}
					/>
				))}
			</div>
		</NotificationContainer>
	);
}

export default NotificationView;

const notifications: INotificationData[] = [
	{
		id: '1',
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
		time: '1661300000107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '2',
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
		quote: 'hey bro, how are you?\ngood, an you?',
		isRead: true,
	},
];
