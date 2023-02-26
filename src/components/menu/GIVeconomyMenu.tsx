import React from 'react';
import styled from 'styled-components';

import { useAppSelector } from '@/features/hooks';
import { BaseMenuContainer } from './common';
import { GIVeconomyItems } from './GIVeconomyItems';

export const GIVeconomyMenu = () => {
	const theme = useAppSelector(state => state.general.theme);
	return (
		<MenuContainer theme={theme}>
			<GIVeconomyItems />
		</MenuContainer>
	);
};

const MenuContainer = styled(BaseMenuContainer)`
	display: flex;
	flex-direction: column;
	width: 239px;
	gap: 4px;
`;
