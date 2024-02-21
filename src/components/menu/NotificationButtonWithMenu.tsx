import React, { FC, useEffect } from 'react';
import {
	brandColors,
	IconNotificationFilled16,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import styled from 'styled-components';
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
import { MenuContainer, NotificationMenuWrapper } from './Menu.sc';
import { ItemsProvider } from '@/context/Items.context';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';
import { useModalCallback } from '@/hooks/useModalCallback';
import Routes from '@/lib/constants/Routes';
import { NotificationItems } from './NotificationItems';
import { fetchNotificationsData } from '@/features/notification/notification.services';
import { useNotification } from '@/hooks/useNotification';

const NOTIFICATION_ENABLED =
	process.env.NEXT_PUBLIC_NOTIFICATION_CENTER_ENABLED === 'true';

export const NotificationButtonWithMenu: FC<IHeaderButtonProps> = ({
	isHeaderShowing,
	theme,
}) => {
	const isDesktop = useMediaQuery(device.laptopL);
	const [showMenu, menuCondition, openMenu, closeMenu] = useDelayedState();
	const [showSidebar, sidebarCondition, openSidebar, closeSidebar] =
		useDelayedState();
	const router = useRouter();
	const goToNotifs = () => router.push(Routes.Notifications);
	const { isSignedIn } = useAppSelector(state => state.user);

	const { modalCallback: signInThenGoToNotifs } =
		useModalCallback(goToNotifs);

	const { notifications, setNotifications, markOneNotificationRead } =
		useNotification();

	const { lastNotificationId } = useAppSelector(
		state => state.notification.notificationInfo,
	);

	useEffect(() => {
		if (!isSignedIn) return;
		const fetchNotificationsAndSetState = async () => {
			try {
				const res = await fetchNotificationsData({ limit: 4 });
				if (res?.notifications) setNotifications(res.notifications);
			} catch (e) {
				console.log('fetchNotificationsAndSetState error: ', e);
			}
		};
		if (NOTIFICATION_ENABLED) {
			fetchNotificationsAndSetState();
		}
	}, [lastNotificationId, isSignedIn]);

	useEffect(() => {
		if (!isHeaderShowing) {
			closeMenu();
		}
	}, [isHeaderShowing]);

	const props = isSignedIn
		? isDesktop
			? {
					onMouseEnter: openMenu,
					onMouseLeave: closeMenu,
					onClick: goToNotifs,
				}
			: { onClick: NOTIFICATION_ENABLED ? openSidebar : goToNotifs }
		: { onClick: () => signInThenGoToNotifs() };

	return (
		<MenuAndButtonContainer {...props}>
			<NotificationsButton outline basetheme={theme} isHover={showMenu}>
				<HeaderNotificationButton theme={theme} />
				<CoverLine basetheme={theme} className='cover-line' />
			</NotificationsButton>
			{NOTIFICATION_ENABLED && menuCondition && (
				<NotificationMenuContainer
					isAnimating={showMenu}
					basetheme={theme}
				>
					<NotificationMenuWrapper>
						<ItemsProvider close={closeMenu}>
							<NotificationItems
								notifications={notifications}
								markOneNotificationRead={
									markOneNotificationRead
								}
							/>
						</ItemsProvider>
					</NotificationMenuWrapper>
				</NotificationMenuContainer>
			)}
			{NOTIFICATION_ENABLED && sidebarCondition && (
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
							<NotificationItems
								notifications={notifications}
								markOneNotificationRead={
									markOneNotificationRead
								}
							/>
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
	const { total: totalUnreadNotifications } = useAppSelector(
		state => state.notification.notificationInfo,
	);

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
					theme === ETheme.Dark
						? neutralColors.gray[100]
						: brandColors.pinky[500]
				}
			/>
		</NotificationsIconContainer>
	);
};

const NotificationMenuContainer = styled(MenuContainer)`
	padding-bottom: 0;
`;
