import {
	H5,
	IconConfig24,
	IconNotificationOutline32,
	Lead,
} from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import {
	NotificationContainer,
	NotificationHeader,
	IconContainer,
	NotificationDesc,
	ConfigContainer,
} from './notification.sc';
import {
	TabsContainer,
	TabItem,
	TabItemCount,
} from '@/components/styled-components/Tabs';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowFooter } from '@/features/general/general.slice';
import { fetchNotificationsData } from '@/features/notification/notification.services';
import { INotification } from '@/features/notification/notification.types';
import { NotificationBox } from '@/components/notification/NotificationBox';
import { Flex } from '@/components/styled-components/Flex';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';

enum ENotificationTabs {
	ALL,
	GENERAL,
	PROJECTS,
	GIVECONOMY,
}

function NotificationView() {
	const [tab, setTab] = useState(ENotificationTabs.ALL);
	const [notifications, setNotifications] = useState<INotification[]>([]);

	const {
		total: totalUnreadNotifications,
		general,
		projectsRelated,
		givEconomyRelated,
	} = useAppSelector(state => state.notification.notificationInfo);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
	}, [dispatch]);

	useEffect(() => {
		fetchNotificationsData().then(res => {
			if (res?.notifications) setNotifications(res.notifications);
		});
	}, []);

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
			<Flex justifyContent='space-between' alignItems='center'>
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
						<TabItemCount
							active={tab === ENotificationTabs.GENERAL}
						>
							{general}
						</TabItemCount>
					</TabItem>
					<TabItem
						active={tab === ENotificationTabs.PROJECTS}
						onClick={() => setTab(ENotificationTabs.PROJECTS)}
					>
						Projects
						<TabItemCount
							active={tab === ENotificationTabs.PROJECTS}
						>
							{projectsRelated}
						</TabItemCount>
					</TabItem>
					<TabItem
						active={tab === ENotificationTabs.GIVECONOMY}
						onClick={() => setTab(ENotificationTabs.GIVECONOMY)}
					>
						GIVeconomy
						<TabItemCount
							active={tab === ENotificationTabs.GIVECONOMY}
						>
							{givEconomyRelated}
						</TabItemCount>
					</TabItem>
				</TabsContainer>
				<InternalLink href={Routes.NotificationsSettings}>
					<ConfigContainer>
						<IconConfig24 />
					</ConfigContainer>
				</InternalLink>
			</Flex>
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
