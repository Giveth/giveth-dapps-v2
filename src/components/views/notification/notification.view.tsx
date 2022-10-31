import { H5, IconNotificationOutline32, Lead } from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import {
	NotificationContainer,
	NotificationHeader,
	IconContainer,
	NotificationDesc,
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

enum ENotificationTabs {
	ALL,
	GENERAL = 'projectRelated',
	PROJECTS = 'projectRelated',
	GIVECONOMY = 'givEconomyRelated',
}

function NotificationView() {
	const [tab, setTab] = useState(ENotificationTabs.ALL);
	const [allNotifs, setAllNotifs] = useState<INotification[]>([]);
	const [generalNotifs, setGenralNotifs] = useState<INotification[]>([]);
	const [projectNotifs, setProjectsNotifs] = useState<INotification[]>([]);
	const [giveconomyNotifs, setGIVeconomyNotifs] = useState<INotification[]>(
		[],
	);
	const [loading, setLoading] = useState(false);

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
		fetchNotificationsData()
			.then(res => {
				if (res?.notifications) setAllNotifs(res.notifications);
			})
			.finally(() => {
				setLoading(true);
			});
	}, []);

	const handleTabChange = (tab: ENotificationTabs) => {
		fetchNotificationsData()
			.then(res => {
				if (res?.notifications) setAllNotifs(res.notifications);
			})
			.finally(() => {
				setLoading(true);
			});
	};

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
			{tab === ENotificationTabs.ALL && (
				<div>
					{allNotifs.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
						/>
					))}
				</div>
			)}
			{tab === ENotificationTabs.GENERAL && (
				<div>
					{generalNotifs.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
						/>
					))}
				</div>
			)}
			{tab === ENotificationTabs.PROJECTS && (
				<div>
					{projectNotifs.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
						/>
					))}
				</div>
			)}
			{tab === ENotificationTabs.GIVECONOMY && (
				<div>
					{giveconomyNotifs.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
						/>
					))}
				</div>
			)}
		</NotificationContainer>
	);
}

export default NotificationView;
