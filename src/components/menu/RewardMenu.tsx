import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MenuContainer } from './Menu.sc';
import { useAppSelector } from '@/features/hooks';
import { RewardItems } from './RewardItems';

export interface IRewardMenuProps {
	showWhatIsGIVstreamModal: boolean;
	setShowWhatIsGIVstreamModal: (value: boolean) => void;
}

export const RewardMenu: FC<IRewardMenuProps> = ({
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
				<RewardItems
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
