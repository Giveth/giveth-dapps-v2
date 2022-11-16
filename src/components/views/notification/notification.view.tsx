import {
	H5,
	IconConfig24,
	IconNotificationOutline32,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import { useEffect, useRef, useState } from 'react';
import {
	NotificationContainer,
	IconContainer,
	NotificationDesc,
	ConfigContainer,
	NotifisTabItem,
	NotifsHr,
} from './notification.sc';
import {
	TabsContainer,
	TabItemCount,
} from '@/components/styled-components/Tabs';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowFooter } from '@/features/general/general.slice';
import { NotificationBox } from '@/components/notification/NotificationBox';
import { Flex } from '@/components/styled-components/Flex';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';
import { fetchNotificationsData } from '@/features/notification/notification.services';
import { useNotification } from '@/hooks/useNotification';

enum ENotificationTabs {
	ALL,
	GENERAL = 'general',
	PROJECTS = 'projectRelated',
	GIVECONOMY = 'givEconomyRelated',
}

const limit = 2;

function NotificationView() {
	const [tab, setTab] = useState(ENotificationTabs.ALL);
	const { notifications, setNotifications, markOneNotificationRead } =
		useNotification();
	const [loading, setLoading] = useState(false);

	const pageNumber = useRef(0);

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
		setLoading(true);
		const controller = new AbortController();
		const signal = controller.signal;
		let query;
		tab === ENotificationTabs.ALL
			? (query = {
					limit,
					offset: pageNumber.current * limit,
			  })
			: (query = {
					category: tab,
					limit,
					offset: pageNumber.current * limit,
			  });
		fetchNotificationsData(query, { signal })
			.then(res => {
				if (res?.notifications) {
					setNotifications(
						pageNumber.current === 0
							? res.notifications
							: notifications.concat(res.notifications),
					);
				}
			})
			.finally(() => {
				setLoading(false);
			});
		return () => {
			controller.abort();
		};
	}, [tab, pageNumber.current]);

	return (
		<NotificationContainer>
			<Flex gap='8px'>
				<IconContainer>
					<IconNotificationOutline32 />
				</IconContainer>
				<NotificationDesc flexDirection='column'>
					<H5 weight={700}>Notification Center</H5>
					<Lead>
						Your activity history, starting with the most recent
					</Lead>
				</NotificationDesc>
			</Flex>
			<Flex justifyContent='space-between' alignItems='center'>
				<TabsContainer>
					<NotifisTabItem
						active={tab === ENotificationTabs.ALL}
						onClick={() => setTab(ENotificationTabs.ALL)}
					>
						All
						{totalUnreadNotifications !== 0 && (
							<TabItemCount
								active={tab === ENotificationTabs.ALL}
							>
								{totalUnreadNotifications}
							</TabItemCount>
						)}
					</NotifisTabItem>
					<NotifisTabItem
						active={tab === ENotificationTabs.GENERAL}
						onClick={() => setTab(ENotificationTabs.GENERAL)}
					>
						General
						{general !== 0 && (
							<TabItemCount
								active={tab === ENotificationTabs.GENERAL}
							>
								{general}
							</TabItemCount>
						)}
					</NotifisTabItem>
					<NotifisTabItem
						active={tab === ENotificationTabs.PROJECTS}
						onClick={() => setTab(ENotificationTabs.PROJECTS)}
					>
						Projects
						{projectsRelated !== 0 && (
							<TabItemCount
								active={tab === ENotificationTabs.PROJECTS}
							>
								{projectsRelated}
							</TabItemCount>
						)}
					</NotifisTabItem>
					<NotifisTabItem
						active={tab === ENotificationTabs.GIVECONOMY}
						onClick={() => setTab(ENotificationTabs.GIVECONOMY)}
					>
						GIVeconomy
						{givEconomyRelated !== 0 && (
							<TabItemCount
								active={tab === ENotificationTabs.GIVECONOMY}
							>
								{givEconomyRelated}
							</TabItemCount>
						)}
					</NotifisTabItem>
				</TabsContainer>
				<InternalLink href={Routes.NotificationsSettings}>
					<ConfigContainer>
						<IconConfig24 />
					</ConfigContainer>
				</InternalLink>
			</Flex>
			<NotifsHr color={neutralColors.gray[300]} />
			<div>
				{loading ? (
					<div>Loading...</div>
				) : (
					notifications.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
							markOneNotificationRead={markOneNotificationRead}
						/>
					))
				)}
			</div>
			<h6>{pageNumber.current}</h6>
		</NotificationContainer>
	);
}

export default NotificationView;
