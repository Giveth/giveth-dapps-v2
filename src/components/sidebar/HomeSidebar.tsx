import React from 'react';
import styled from 'styled-components';
import { GLink } from '@giveth/ui-design-system';
import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { SidebarItem } from './SidebarItem';

import { ProjectsItems } from '../menu/ProjectsItems';
import { GIVeconomyItems } from '../menu/GIVeconomyItems';
import { Item } from '../menu/Item';
import { ItemSpacer } from '../menu/common';
import Routes from '@/lib/constants/Routes';

export const HomeSidebar = () => {
	const { theme, mainCategories } = useAppSelector(state => state.general);

	return (
		<HomeSidebarContainer>
			<Link href='/'>
				<Item theme={theme}>
					<GLink size='Big'>Home</GLink>
				</Item>
			</Link>
			<SidebarItem item={{ title: 'Projects', href: '/projects' }}>
				<ProjectsItems inSidebar />
			</SidebarItem>
			<SidebarItem item={{ title: 'GIVeconomy' }}>
				<GIVeconomyItems />
			</SidebarItem>
			<ItemSpacer />
			<Link href={Routes.NFT}>
				<Item theme={theme}>
					<GLink size='Big'>NFT</GLink>
				</Item>
			</Link>
		</HomeSidebarContainer>
	);
};

const HomeSidebarContainer = styled(Flex)`
	padding: 0 16px 16px;
	gap: 16px;
	justify-content: stretch;
	flex-direction: column;
`;
