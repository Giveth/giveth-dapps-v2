import {
	H5,
	IconConfig24,
	IconNotificationOutline32,
	Lead,
	neutralColors,
	OutlineButton,
} from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import {
	NotificationContainer,
	IconContainer,
	NotificationDesc,
	ConfigContainer,
	NotifisTabItem,
	NotifsHr,
	MarkAllNotifsButton,
	Loading,
} from './notification.sc';
import LottieControl from '@/components/LottieControl';
import LoadingAnimation from '@/animations/loading_giv.json';
import {
	TabsContainer,
	TabItemCount,
} from '@/components/styled-components/Tabs';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowFooter } from '@/features/general/general.slice';
import { NotificationBox } from '@/components/notification/NotificationBox';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';
import {
	fetchNotificationsData,
	readAllNotifications,
} from '@/features/notification/notification.services';
import { useNotification } from '@/hooks/useNotification';
import useDetectDevice from '@/hooks/useDetectDevice';
import { fetchNotificationCountAsync } from '@/features/notification/notification.thunks';

enum ENotificationTabs {
	ALL,
	GENERAL = 'general',
	PROJECTS = 'projectRelated',
	GIVECONOMY = 'givEconomy',
	SUPPORTED = 'supportedProjects',
}

const limit = 6;

function NotificationView() {
	const { notifications, setNotifications, markOneNotificationRead } =
		useNotification();
	const dispatch = useAppDispatch();
	const { account } = useWeb3React();
	const [tab, setTab] = useState(ENotificationTabs.ALL);
	const [loading, setLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [pageNumber, setPageNumber] = useState(0);
	const [markedAllNotificationsRead, setMarkedAllNotificationsRead] =
		useState(false);
	const showLoadMore = totalCount > notifications.length;
	const {
		total: totalUnreadNotifications,
		general,
		projectsRelated,
		supportedProjects,
		givEconomyRelated,
	} = useAppSelector(state => state.notification.notificationInfo);
	const { formatMessage } = useIntl();

	const { isMobile } = useDetectDevice();

	const handleLoadMore = () => {
		if (notifications.length < totalCount) setPageNumber(pageNumber + 1);
	};

	const handleChangeTab = (newTab: ENotificationTabs) => {
		if (newTab === tab) return;
		setLoading(true);
		setNotifications([]);
		setPageNumber(0);
		setTab(newTab);
	};

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
					offset: pageNumber * limit,
			  })
			: (query = {
					category: tab,
					limit,
					offset: pageNumber * limit,
			  });
		fetchNotificationsData(query, { signal })
			.then(res => {
				if (res?.notifications) {
					setNotifications(
						pageNumber === 0
							? res.notifications
							: notifications.concat(res.notifications),
					);
					setTotalCount(res.count);
				}
			})
			.finally(() => {
				setLoading(false);
			});
		return () => {
			controller.abort();
		};
	}, [tab, pageNumber, markedAllNotificationsRead, totalUnreadNotifications]);

	return (
		<NotificationContainer>
			{loading && (
				<Loading data-testid='loading'>
					<LottieControl
						animationData={LoadingAnimation}
						size={250}
					/>
				</Loading>
			)}
			<Flex gap='8px'>
				<IconContainer>
					<IconNotificationOutline32 />
				</IconContainer>
				<NotificationDesc flexDirection='column'>
					<Flex justifyContent='space-between'>
						<H5 weight={700}>
							{formatMessage({ id: 'label.notification_center' })}
						</H5>
						<InternalLink href={Routes.NotificationsSettings}>
							<ConfigContainer>
								<IconConfig24 />
							</ConfigContainer>
						</InternalLink>
					</Flex>
					<Lead>
						{formatMessage({
							id: 'label.your_history_of_notifications_startimg_with_the_most_recent',
						})}
					</Lead>
				</NotificationDesc>
			</Flex>
			<Flex
				justifyContent='space-between'
				alignItems={isMobile ? 'stretch' : 'center'}
				flexDirection={isMobile ? 'column' : 'row'}
			>
				<TabsContainer>
					<NotifisTabItem
						active={tab === ENotificationTabs.ALL}
						onClick={() => handleChangeTab(ENotificationTabs.ALL)}
					>
						{formatMessage({ id: 'label.all_fem' })}
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
						onClick={() =>
							handleChangeTab(ENotificationTabs.GENERAL)
						}
					>
						{formatMessage({ id: 'general' })}
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
						onClick={() =>
							handleChangeTab(ENotificationTabs.PROJECTS)
						}
					>
						{formatMessage({ id: 'label.my_projects' })}
						{projectsRelated !== 0 && (
							<TabItemCount
								active={tab === ENotificationTabs.PROJECTS}
							>
								{projectsRelated}
							</TabItemCount>
						)}
					</NotifisTabItem>
					<NotifisTabItem
						active={tab === ENotificationTabs.SUPPORTED}
						onClick={() =>
							handleChangeTab(ENotificationTabs.SUPPORTED)
						}
					>
						{formatMessage({ id: 'label.supported_projects' })}
						{supportedProjects !== 0 && (
							<TabItemCount
								active={tab === ENotificationTabs.SUPPORTED}
							>
								{supportedProjects}
							</TabItemCount>
						)}
					</NotifisTabItem>
					<NotifisTabItem
						active={tab === ENotificationTabs.GIVECONOMY}
						onClick={() =>
							handleChangeTab(ENotificationTabs.GIVECONOMY)
						}
					>
						{formatMessage({ id: 'label.rewards' })}
						{givEconomyRelated !== 0 && (
							<TabItemCount
								active={tab === ENotificationTabs.GIVECONOMY}
							>
								{givEconomyRelated}
							</TabItemCount>
						)}
					</NotifisTabItem>
				</TabsContainer>
				<MarkAllNotifsButton
					size='small'
					label={formatMessage({ id: 'label.mark_all_as_read' })}
					onClick={() => {
						return readAllNotifications().then(() => {
							setMarkedAllNotificationsRead(
								!markedAllNotificationsRead,
							);
							if (account)
								dispatch(fetchNotificationCountAsync(account));
						});
					}}
					buttonType='texty-primary'
					disabled={totalUnreadNotifications === 0}
				/>
			</Flex>
			<NotifsHr color={neutralColors.gray[300]} />
			<div>
				{notifications.length > 0
					? notifications.map(notification => (
							<NotificationBox
								key={notification.id}
								notification={notification}
								markOneNotificationRead={
									markOneNotificationRead
								}
							/>
					  ))
					: !loading && (
							<FlexCenter>
								<Lead>
									{formatMessage({
										id: 'label.you_dont_have_any_notifications',
									})}
								</Lead>
							</FlexCenter>
					  )}
			</div>
			<FlexCenter>
				{showLoadMore && !loading && (
					<OutlineButton
						buttonType='primary'
						label={formatMessage({
							id: 'component.button.load_more',
						})}
						onClick={handleLoadMore}
					/>
				)}
			</FlexCenter>
		</NotificationContainer>
	);
}

export default NotificationView;
