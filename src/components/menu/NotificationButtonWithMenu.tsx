import React, { FC, useEffect } from 'react';
import {
	brandColors,
	IconNotificationFilled16,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import {
	MenuAndButtonContainer,
	CoverLine,
	HeaderSidebarButtonWrapper,
	SidebarInnerContainer,
	NotificationsButton,
	NotificationsButtonCircle,
	NotificationsIconContainer,
} from '../Header/Header.sc';
import { IHeaderButtonProps } from './UserButtonWithMenu';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { useDelayedState } from '@/hooks/useDelayedState';
import { SideBar, ESideBarDirection } from '../sidebar/SideBar';
import { FlexSpacer } from '../styled-components/Flex';
import { MenuContainer } from './Menu.sc';
import { ItemsProvider } from '@/context/Items.context';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';
import { fetchNotificationsData } from '@/features/notification/notification.services';
import { useNotification } from '@/hooks/useNotification';
import { useModalCallback } from '@/hooks/useModalCallback';
import Routes from '@/lib/constants/Routes';

interface INotificationButtonWithMenuProps extends IHeaderButtonProps {}

export const NotificationButtonWithMenu: FC<
	INotificationButtonWithMenuProps
> = ({ isHeaderShowing, theme }) => {
	const isDesktop = useMediaQuery(device.laptopL);
	const [showMenu, menuCondition, openMenu, closeMenu] = useDelayedState();
	const [showSidebar, sidebarCondition, openSidebar, closeSidebar] =
		useDelayedState();
	const router = useRouter();
	const { isSignedIn } = useAppSelector(state => state.user);

	const { modalCallback: signInThenGoToNotifs } = useModalCallback(() =>
		router.push(Routes.Notifications),
	);

	useEffect(() => {
		if (!isHeaderShowing) {
			closeMenu();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isHeaderShowing]);

	const props = isSignedIn
		? isDesktop
			? {
					onMouseEnter: openMenu,
					onMouseLeave: closeMenu,
			  }
			: { onClick: openSidebar }
		: { onClick: () => signInThenGoToNotifs() };
	return (
		<MenuAndButtonContainer {...props}>
			<NotificationsButton outline theme={theme} isHover={showMenu}>
				<HeaderNotificationButton theme={theme} />
				<CoverLine theme={theme} className='cover-line' />
			</NotificationsButton>
			{menuCondition && (
				<MenuContainer isAnimating={showMenu} theme={theme}>
					<ItemsProvider close={closeMenu}>
						<div>Notifs</div>
					</ItemsProvider>
				</MenuContainer>
			)}
			{sidebarCondition && (
				<SideBar
					close={closeSidebar}
					isAnimating={showSidebar}
					direction={ESideBarDirection.Right}
					header={
						<>
							<FlexSpacer />
							<HeaderSidebarButtonWrapper>
								<HeaderNotificationButton theme={theme} />
							</HeaderSidebarButtonWrapper>
						</>
					}
				>
					<SidebarInnerContainer>
						<ItemsProvider close={closeSidebar}>
							<div>Notifs</div>
						</ItemsProvider>
					</SidebarInnerContainer>
				</SideBar>
			)}
		</MenuAndButtonContainer>
	);
};

interface IHeaderNotificationButtonProps {
	theme: ETheme;
}

const HeaderNotificationButton: FC<IHeaderNotificationButtonProps> = ({
	theme,
}) => {
	const { notifications, setNotifications, markOneNotificationRead } =
		useNotification();
	const { isSignedIn } = useAppSelector(state => state.user);
	const { total: totalUnreadNotifications, lastNotificationId } =
		useAppSelector(state => state.notification.notificationInfo);

	const lastFetchedNotificationId = notifications[0]?.id ?? undefined;

	useEffect(() => {
		const fetchNotificationsAndSetState = async () => {
			if (!isSignedIn) return;
			try {
				const res = await fetchNotificationsData({ limit: 4 });
				if (res?.notifications) setNotifications(res.notifications);
			} catch {
				console.log('Error fetching notifications');
			}
		};

		if (
			typeof lastFetchedNotificationId === 'number' &&
			lastNotificationId > lastFetchedNotificationId
		) {
			fetchNotificationsAndSetState();
			return;
		}

		fetchNotificationsAndSetState();
	}, [lastNotificationId, isSignedIn]);
	return (
		<NotificationsIconContainer>
			{totalUnreadNotifications > 0 && (
				<NotificationsButtonCircle>
					<Overline styleType='Small'>
						{totalUnreadNotifications}
					</Overline>
				</NotificationsButtonCircle>
			)}
			<IconNotificationFilled16
				color={
					theme === ETheme.Light
						? brandColors.pinky[500]
						: neutralColors.gray[100]
				}
			/>
		</NotificationsIconContainer>
	);
};
