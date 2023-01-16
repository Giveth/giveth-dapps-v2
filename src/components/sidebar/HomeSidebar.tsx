import { B, Caption, GLink } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { projectsMenuItem } from '../menu/ProjectsMenu';
import { SidebarItem } from './SidebarItem';

export const HomeSidebar = () => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<HomeSidebarContainer>
			<SidebarItem item={{ title: 'Home', href: '/' }} />
			<SidebarItem item={{ title: 'Projects', href: '/projects' }}>
				<Caption medium>Explore by</Caption>
				{projectsMenuItem.explore.map((explore, idx) => (
					<B key={idx}>{explore.name}</B>
				))}
				<Caption medium>BY CATEGORY</Caption>
				{projectsMenuItem.categories.map((explore, idx) => (
					<GLink size='Big' key={idx}>
						{explore.name}
					</GLink>
				))}
			</SidebarItem>
		</HomeSidebarContainer>
	);
};

const HomeSidebarContainer = styled(Flex)`
	padding: 16px;
	gap: 16px;
	justify-content: stretch;
	flex-direction: column;
`;
