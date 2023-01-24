import React from 'react';
import styled from 'styled-components';
import { GLink, IconSearch24 } from '@giveth/ui-design-system';
import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { SidebarParentItem } from './SidebarItem';

import { ProjectsItems } from '../menu/ProjectsItems';
import { GIVeconomyItems } from '../menu/GIVeconomyItems';
import { Item } from '../menu/Item';
import { ItemSpacer } from '../menu/common';
import Routes from '@/lib/constants/Routes';

export const HomeSidebar = () => {
	const { theme } = useAppSelector(state => state.general);

	return (
		<HomeSidebarContainer>
			<Link href='/'>
				<Item theme={theme}>
					<GLink size='Big'>Home</GLink>
				</Item>
			</Link>
			<SidebarParentItem item={{ title: 'Projects', href: '/projects' }}>
				<ProjectsItems inSidebar />
			</SidebarParentItem>
			<SidebarParentItem item={{ title: 'GIVeconomy' }}>
				<GIVeconomyItems />
			</SidebarParentItem>
			<ItemSpacer />
			<Link href={Routes.NFT}>
				<Item theme={theme}>
					<GLink size='Big'>NFT</GLink>
				</Item>
			</Link>
			<SearchButton theme={theme} isHighlighted>
				<Flex alignItems='center' justifyContent='space-between'>
					<GLink size='Big'>Search</GLink>
					<IconSearch24 />
				</Flex>
			</SearchButton>
		</HomeSidebarContainer>
	);
};

const HomeSidebarContainer = styled(Flex)`
	padding: 0 16px 16px;
	gap: 16px;
	justify-content: stretch;
	flex-direction: column;
`;

const SearchButton = styled(Item)`
	border-radius: 100px;
`;
