import React, { FC, useEffect, useState } from 'react';
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
import { RewardMenu } from './RewardMenu';
import { useAppSelector, currentValuesHelper } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { IHeaderButtonProps } from './UserButtonWithMenu';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { useDelayedState } from '@/hooks/useDelayedState';
import { SideBar, ESideBarDirection } from '../sidebar/SideBar';
import { FlexSpacer } from '../styled-components/Flex';

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
	const [showSidebar, sidebarCondition, openSidebar, closeSidebar] =
		useDelayedState();

	const handleRewardMenuOnLeave = () => {
		if (!showRewardMenuModal) {
			setShowRewardMenu(false);
		}
	};

	useEffect(() => {
		if (!isHeaderShowing) {
			setShowRewardMenu(false);
		}
	}, [isHeaderShowing]);

	const props = isDesktop
		? {
				onMouseEnter: () => setShowRewardMenu(true),
				onMouseLeave: handleRewardMenuOnLeave,
		  }
		: { onClick: openSidebar };

	return (
		<MenuAndButtonContainer {...props}>
			<BalanceButton outline theme={theme}>
				<HeaderRewardButton chainId={chainId} />
				<CoverLine theme={theme} />
			</BalanceButton>
			{showRewardMenu && (
				<RewardMenu
					showWhatIsGIVstreamModal={showRewardMenuModal}
					setShowWhatIsGIVstreamModal={setShowRewardMenuModal}
				/>
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
					<RewardMenu
						showWhatIsGIVstreamModal={showRewardMenuModal}
						setShowWhatIsGIVstreamModal={setShowRewardMenuModal}
					/>
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
