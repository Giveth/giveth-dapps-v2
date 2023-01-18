import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { SidebarItem } from './SidebarItem';

import { ProjectsItems } from '../menu/ProjectsItems';
import { GIVeconomyItems } from '../menu/GIVeconomyItems';

export const HomeSidebar = () => {
	const { theme, mainCategories } = useAppSelector(state => state.general);

	return (
		<HomeSidebarContainer>
			<SidebarItem item={{ title: 'Home', href: '/' }} />
			<SidebarItem item={{ title: 'Projects', href: '/projects' }}>
				<ProjectsItems inSidebar />
			</SidebarItem>
			<SidebarItem item={{ title: 'GIVeconomy' }}>
				<GIVeconomyItems />
			</SidebarItem>
		</HomeSidebarContainer>
	);
};

const HomeSidebarContainer = styled(Flex)`
	padding: 0 16px 16px;
	gap: 16px;
	justify-content: stretch;
	flex-direction: column;
`;
