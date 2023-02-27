import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { BaseMenuContainer } from './common';
import { ProjectsItems } from './ProjectsItems';

export const ProjectsMenu = () => {
	const { theme } = useAppSelector(state => state.general);

	return (
		<MenuContainer theme={theme}>
			<ProjectsItems />
		</MenuContainer>
	);
};

const MenuContainer = styled(BaseMenuContainer)`
	width: 697px;
`;
