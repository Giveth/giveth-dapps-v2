import React, { FC, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { formatWeiHelper } from '@/helpers/number';
import {
	MenuAndButtonContainer,
	BalanceButton,
	HBContainer,
	HBContent,
	CoverLine,
	HeaderSidebarButtonWrapper,
	SidebarInnerContainer,
} from '../Header/Header.sc';
import { IconGIV } from '../Icons/GIV';
import { useAppSelector, currentValuesHelper } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { IHeaderButtonProps } from './UserButtonWithMenu';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { useDelayedState } from '@/hooks/useDelayedState';
import { SideBar, ESideBarDirection } from '../sidebar/SideBar';
import { FlexSpacer } from '../styled-components/Flex';
import { RewardItems } from './RewardItems';
import { MenuContainer } from './Menu.sc';
import { ItemsProvider } from '@/context/Items.context';
import SwitchNetwork from '../modals/SwitchNetwork';

interface IRewardButtonWithMenuProps extends IHeaderButtonProps {}

export const RewardButtonWithMenu: FC<IRewardButtonWithMenuProps> = ({
	isHeaderShowing,
	theme,
}) => {
	const [showRewardMenuModal, setShowRewardMenuModal] = useState(false);
	const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);
	const isDesktop = useMediaQuery(device.laptopL);
	const [showMenu, menuCondition, openMenu, closeMenu] = useDelayedState();
	const [showSidebar, sidebarCondition, openSidebar, closeSidebar] =
		useDelayedState();

	useEffect(() => {
		if (!isHeaderShowing) {
			closeMenu();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isHeaderShowing]);

	const props = isDesktop
		? {
				onMouseEnter: openMenu,
				onMouseLeave: closeMenu,
		  }
		: { onClick: openSidebar };

	return (
		<MenuAndButtonContainer {...props}>
			<BalanceButton outline theme={theme} isHover={showMenu}>
				<HeaderRewardButton />
				<CoverLine theme={theme} className='cover-line' />
			</BalanceButton>
			{menuCondition && (
				<MenuContainer isAnimating={showMenu} theme={theme}>
					<ItemsProvider close={closeMenu}>
						<RewardItems
							showWhatIsGIVstreamModal={showRewardMenuModal}
							setShowWhatIsGIVstreamModal={setShowRewardMenuModal}
							theme={theme}
						/>
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
								<HeaderRewardButton />
							</HeaderSidebarButtonWrapper>
						</>
					}
				>
					<SidebarInnerContainer>
						<ItemsProvider close={closeSidebar}>
							<RewardItems
								showWhatIsGIVstreamModal={showRewardMenuModal}
								setShowWhatIsGIVstreamModal={
									setShowRewardMenuModal
								}
								theme={theme}
							/>
						</ItemsProvider>
					</SidebarInnerContainer>
				</SideBar>
			)}
			{showSwitchNetwork && (
				<SwitchNetwork setShowModal={setShowSwitchNetwork} />
			)}
		</MenuAndButtonContainer>
	);
};

const HeaderRewardButton = () => {
	const { chainId } = useWeb3React();
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph[currentValuesHelper(chainId)]),
	);
	const givBalance = sdh.getGIVTokenBalance();
	return (
		<HBContainer>
			<IconGIV size={24} />
			<HBContent size='Big'>
				{formatWeiHelper(givBalance.balance)}
			</HBContent>
		</HBContainer>
	);
};
