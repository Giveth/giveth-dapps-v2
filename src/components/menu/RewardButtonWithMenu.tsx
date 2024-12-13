import React, { FC, useEffect, useState } from 'react';
import { FlexSpacer } from '@giveth/ui-design-system';
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
import { IHeaderButtonProps } from './UserButtonWithMenu';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { useDelayedState } from '@/hooks/useDelayedState';
import { SideBar, ESideBarDirection } from '../sidebar/SideBar';
import { RewardItems } from './RewardItems';
import { MenuContainer } from './Menu.sc';
import { ItemsProvider } from '@/context/Items.context';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { formatWeiHelper } from '@/helpers/number';
import { useSubgraphInfo } from '@/hooks/useSubgraphInfo';

interface IRewardButtonWithMenuProps extends IHeaderButtonProps {}

export const RewardButtonWithMenu: FC<IRewardButtonWithMenuProps> = ({
	isHeaderShowing,
	theme,
}) => {
	const [showRewardMenuModal, setShowRewardMenuModal] = useState(false);
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
			<BalanceButton $outline $baseTheme={theme} $isHover={showMenu}>
				<HeaderRewardButton />
				<CoverLine $baseTheme={theme} className='cover-line' />
			</BalanceButton>
			{menuCondition && (
				<MenuContainer $isAnimating={showMenu} $baseTheme={theme}>
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
		</MenuAndButtonContainer>
	);
};

const HeaderRewardButton = () => {
	const currentValues = useSubgraphInfo();
	const sdh = new SubgraphDataHelper(currentValues.data);
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
