import { GLink } from '@giveth/ui-design-system';
import React, { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { networksParams } from '@/helpers/blockchain';
import { shortenAddress } from '@/lib/helpers';
import {
	MenuAndButtonContainer,
	WalletButton,
	HBContainer,
	HBPic,
	WBInfo,
	WBNetwork,
	CoverLine,
} from '../Header/Header.sc';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { useDelayedState } from '@/hooks/useDelayedState';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { SideBar, ESideBarDirection } from '../sidebar/SideBar';
import { MenuContainer } from './Menu.sc';
import { UserItems } from './UserItems';

export interface IHeaderButtonProps {
	isHeaderShowing: boolean;
	theme: ETheme;
}

interface IUserButtonWithMenuProps extends IHeaderButtonProps {
	chainId?: number;
	account?: string | null;
	library: any;
}

export const UserButtonWithMenu: FC<IUserButtonWithMenuProps> = ({
	isHeaderShowing,
	theme,
	chainId,
	account,
	library,
}) => {
	const [showUserMenu, setShowUserMenu] = useState(false);
	const { userData } = useAppSelector(state => state.user);
	const { formatMessage } = useIntl();
	const isDesktop = useMediaQuery(device.laptopL);
	const [showSidebar, sidebarCondition, openSidebar, closeSidebar] =
		useDelayedState();

	useEffect(() => {
		if (!isHeaderShowing) {
			setShowUserMenu(false);
		}
	}, [isHeaderShowing]);

	const props = isDesktop
		? {
				onMouseEnter: () => setShowUserMenu(true),
				onMouseLeave: () => setShowUserMenu(false),
		  }
		: { onClick: openSidebar };

	return (
		<MenuAndButtonContainer {...props}>
			<WalletButton outline theme={theme}>
				<HBContainer>
					<HBPic
						src={
							userData?.avatar ||
							'/images/placeholders/profile.png'
						}
						alt='Profile Pic'
						width={'24px'}
						height={'24px'}
					/>
					<WBInfo>
						<GLink size='Medium'>
							{userData?.name || shortenAddress(account)}
						</GLink>
						<WBNetwork size='Tiny'>
							{formatMessage({
								id: 'label.connected_to',
							})}{' '}
							{(chainId && networksParams[chainId]?.chainName) ||
								library?._network?.name}
						</WBNetwork>
					</WBInfo>
				</HBContainer>
				<CoverLine theme={theme} />
			</WalletButton>
			{showUserMenu && (
				<MenuContainer>
					<UserItems />
				</MenuContainer>
			)}
			{sidebarCondition && (
				<SideBar
					close={closeSidebar}
					isAnimating={showSidebar}
					direction={ESideBarDirection.Right}
					header={<div>WOW</div>}
				>
					sidebaarrrrrrrrr
				</SideBar>
			)}
		</MenuAndButtonContainer>
	);
};
