import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MenuContainer } from './Menu.sc';
import { useAppSelector } from '@/features/hooks';
import { RewardInnerMenu } from './RewardInnerMenu';

export interface IRewardMenu {
	showWhatIsGIVstreamModal: boolean;
	setShowWhatIsGIVstreamModal: (value: boolean) => void;
}

export const RewardMenu: FC<IRewardMenu> = ({
	showWhatIsGIVstreamModal,
	setShowWhatIsGIVstreamModal,
}) => {
	const [isMounted, setIsMounted] = useState(false);
	const theme = useAppSelector(state => state.general.theme);

	useEffect(() => {
		setIsMounted(true);
	}, []);
	return (
		<>
			<RewardMenuContainer isMounted={isMounted} theme={theme}>
				<RewardInnerMenu
					showWhatIsGIVstreamModal={showWhatIsGIVstreamModal}
					setShowWhatIsGIVstreamModal={setShowWhatIsGIVstreamModal}
					theme={theme}
				/>
			</RewardMenuContainer>
		</>
	);
};

const RewardMenuContainer = styled(MenuContainer)`
	max-height: 380px;
`;
