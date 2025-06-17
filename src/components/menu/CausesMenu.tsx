import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { BaseMenuContainer } from './common';
import { CausesItems } from '@/components/menu/CausesItems';

export const CausesMenu = () => {
	const { theme } = useAppSelector(state => state.general);

	return (
		<MenuContainer $baseTheme={theme}>
			<CausesItems />
		</MenuContainer>
	);
};

const MenuContainer = styled(BaseMenuContainer)`
	width: 697px;
`;
