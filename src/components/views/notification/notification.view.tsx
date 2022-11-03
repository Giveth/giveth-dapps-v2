import {
	H5,
	IconDots24,
	IconNotificationOutline32,
	Lead,
} from '@giveth/ui-design-system';
import { useEffect, useRef, useState } from 'react';
import {
	NotificationContainer,
	NotificationHeader,
	IconContainer,
	NotificationDesc,
	ConfigContainer,
	NotificationsInnerMenuContainer,
	NotificationsInnerMenuItem,
} from './notification.sc';
import {
	TabsContainer,
	TabItem,
	TabItemCount,
} from '@/components/styled-components/Tabs';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowFooter } from '@/features/general/general.slice';
import { INotification } from '@/features/notification/notification.types';
import { NotificationBox } from '@/components/notification/NotificationBox';
import { Flex } from '@/components/styled-components/Flex';
import { fetchNotificationsData } from '@/features/notification/notification.services';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';

enum ENotificationTabs {
	ALL,
	GENERAL = 'general',
	PROJECTS = 'projectRelated',
	GIVECONOMY = 'givEconomyRelated',
}

function NotificationView() {
	const [tab, setTab] = useState(ENotificationTabs.ALL);
	const [notifs, setNotifs] = useState<INotification[]>([]);
	const [loading, setLoading] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [showIsRead, setShowIsRead] = useState<Boolean | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const {
		total: totalUnreadNotifications,
		general,
		projectsRelated,
		givEconomyRelated,
	} = useAppSelector(state => state.notification.notificationInfo);

	const dispatch = useAppDispatch();

	useOnClickOutside(menuRef, () => setShowMenu(false));

	useEffect(() => {
		dispatch(setShowFooter(false));
	}, [dispatch]);

	useEffect(() => {
		setLoading(true);
		const controller = new AbortController();
		const signal = controller.signal;
		let query;
		if (tab !== ENotificationTabs.ALL) {
			query = {
				category: tab,
			};
		}
		if (showIsRead !== null) {
			query = {
				...query,
				isRead: showIsRead,
			};
		}
		fetchNotificationsData(query, { signal })
			.then(res => {
				if (res?.notifications) setNotifs(res.notifications);
			})
			.finally(() => {
				setLoading(false);
			});
		return () => {
			controller.abort();
		};
	}, [tab, showIsRead]);

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
				<ConfigContainer onClick={() => setShowMenu(true)}>
					<IconDots24 />
					{showMenu && (
						<NotificationsInnerMenuContainer ref={menuRef}>
							<Flex flexDirection='column' gap='24px'>
								<NotificationsInnerMenuItem>
									Mark all as read
								</NotificationsInnerMenuItem>
								<NotificationsInnerMenuItem
									onClick={() => setShowIsRead(true)}
								>
									Show all read
								</NotificationsInnerMenuItem>
								<NotificationsInnerMenuItem
									onClick={() => setShowIsRead(false)}
								>
									Show all unread
								</NotificationsInnerMenuItem>
								<InternalLink
									href={Routes.NotificationsSettings}
								>
									<NotificationsInnerMenuItem>
										Settings
									</NotificationsInnerMenuItem>
								</InternalLink>
							</Flex>
						</NotificationsInnerMenuContainer>
					)}
				</ConfigContainer>
			</Flex>
			<div>
				{loading ? (
					<div>Loading...</div>
				) : (
					notifs.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
						/>
					))
				)}
			</div>
		</NotificationContainer>
	);
}

export default NotificationView;
