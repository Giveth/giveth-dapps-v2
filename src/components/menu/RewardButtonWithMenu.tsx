import React, { FC, useEffect, useState } from 'react';
import { formatWeiHelper } from '@/helpers/number';
import {
	MenuAndButtonContainer,
	BalanceButton,
	HBContainer,
	HBContent,
	CoverLine,
} from '../Header/Header.sc';
import { IconGIV } from '../Icons/GIV';
import { RewardMenu } from './RewardMenu';
import { useAppSelector, currentValuesHelper } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { IHeaderButtonProps } from './UserButtonWithMenu';

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

	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph[currentValuesHelper(chainId)]),
	);
	const givBalance = sdh.getGIVTokenBalance();

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

	return (
		<MenuAndButtonContainer
			onClick={() => setShowRewardMenu(true)}
			onMouseEnter={() => setShowRewardMenu(true)}
			onMouseLeave={handleRewardMenuOnLeave}
		>
			<BalanceButton outline theme={theme}>
				<HBContainer>
					<IconGIV size={24} />
					<HBContent size='Big'>
						{formatWeiHelper(givBalance.balance)}
					</HBContent>
				</HBContainer>
				<CoverLine theme={theme} />
			</BalanceButton>
			{showRewardMenu && (
				<RewardMenu
					showWhatIsGIVstreamModal={showRewardMenuModal}
					setShowWhatIsGIVstreamModal={setShowRewardMenuModal}
				/>
			)}
		</MenuAndButtonContainer>
	);
};
