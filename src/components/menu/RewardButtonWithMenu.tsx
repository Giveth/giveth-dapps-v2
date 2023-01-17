import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatWeiHelper } from '@/helpers/number';
import {
	MenuAndButtonContainer,
	BalanceButton,
	HBContainer,
	HBContent,
	CoverLine,
	HeaderSidebarButtonWrapper,
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

interface IRewardButtonWithMenuProps extends IHeaderButtonProps {
	chainId?: number;
}

export const RewardButtonWithMenu: FC<IRewardButtonWithMenuProps> = ({
	isHeaderShowing,
	theme,
	chainId,
}) => {
	const [showRewardMenuModal, setShowRewardMenuModal] = useState(false);
	const [showRewardMenu, setShowRewardMenu] = useState(false);

	const isDesktop = useMediaQuery(device.laptopL);
	const [showMenu, MenuCondition, openMenu, closeMenu] = useDelayedState();
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
			<BalanceButton outline theme={theme}>
				<HeaderRewardButton chainId={chainId} />
				<CoverLine theme={theme} />
			</BalanceButton>
			{MenuCondition && (
				<MenuContainer isAnimating={showMenu}>
					<RewardItems
						showWhatIsGIVstreamModal={showRewardMenuModal}
						setShowWhatIsGIVstreamModal={setShowRewardMenuModal}
						theme={theme}
					/>
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
								<HeaderRewardButton chainId={chainId} />
							</HeaderSidebarButtonWrapper>
						</>
					}
				>
					<RewardInnerSidebarContainer>
						<RewardItems
							showWhatIsGIVstreamModal={showRewardMenuModal}
							setShowWhatIsGIVstreamModal={setShowRewardMenuModal}
							theme={theme}
						/>
					</RewardInnerSidebarContainer>
				</SideBar>
			)}
		</MenuAndButtonContainer>
	);
};

interface IRewardButtonProps {
	chainId?: number;
}

const HeaderRewardButton: FC<IRewardButtonProps> = ({ chainId }) => {
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

const RewardInnerSidebarContainer = styled.div`
	padding: 4px 16px 16px;
`;
