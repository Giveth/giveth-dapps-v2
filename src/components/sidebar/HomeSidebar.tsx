import { B } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { projectsMenuItem } from '../menu/ProjectsMenu';

export const HomeSidebar = () => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<HomeSidebarContainer>
			{projectsMenuItem.explore.map((explore, idx) => (
				<B key={idx}>{explore.name}</B>
			))}
		</HomeSidebarContainer>
	);
};

const HomeSidebarContainer = styled(Flex)`
	padding: 16px;
	gap: 16px;
	justify-content: stretch;
`;

// const HighlightSection

// interface ISidebarItem {
// 	title: string;
// 	href: string;
// 	subItems: ISidebarItemProps[];
// }

// interface ISidebarItemProps {
// 	items: ISidebarItem[];
// }

// const SidebarItem: FC<ISidebarItemProps> = () => {
// 	return <div></div>;
// };
