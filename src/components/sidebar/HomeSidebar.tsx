import { B, Caption, GLink, IconGIVFarm } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { projectsMenuItem } from '../menu/ProjectsMenu';
import { SidebarItem } from './SidebarItem';
import { HighlightSection } from '../menu/common';
import {
	GIVeconomyItemTitle,
	giveconomyMenuItem,
} from '../menu/GIVeconomyMenu';

export const HomeSidebar = () => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<HomeSidebarContainer>
			<SidebarItem item={{ title: 'Home', href: '/' }} />
			<SidebarItem item={{ title: 'Projects', href: '/projects' }}>
				<SidebarHighlightSection theme={theme}>
					<ChildTitle>
						<Caption medium>Explore by</Caption>
					</ChildTitle>
					{projectsMenuItem.explore.map((explore, idx) => (
						<Link href={explore.url} key={idx}>
							<ChildItemBold>{explore.name}</ChildItemBold>
						</Link>
					))}
				</SidebarHighlightSection>
				<SidebarChildSection>
					<ChildTitle medium>BY CATEGORY</ChildTitle>
					{projectsMenuItem.categories.map((explore, idx) => (
						<ChildItem size='Big' key={idx}>
							{explore.name}
						</ChildItem>
					))}
				</SidebarChildSection>
			</SidebarItem>
			<SidebarItem item={{ title: 'GIVeconomy' }}>
				<SidebarHighlightSection theme={theme}>
					<ChildTitle>
						<Caption medium>Liquidity</Caption>
					</ChildTitle>
					<Link href='/givfarm'>
						<ChildItemBold>
							<Flex justifyContent='space-between'>
								<B>GIVfarm</B>
								<IconGIVFarm size={24} />
							</Flex>
						</ChildItemBold>
					</Link>
				</SidebarHighlightSection>
				<SidebarChildSection>
					<ChildTitle medium>Learn about</ChildTitle>
					{giveconomyMenuItem.map((item, idx) => (
						<Link key={idx} href={item.href}>
							<ChildItem theme={theme}>
								<GIVeconomyItemTitle size='Small'>
									{item.title}
								</GIVeconomyItemTitle>
								<GLink size='Big'>{item.label}</GLink>
							</ChildItem>
						</Link>
					))}
				</SidebarChildSection>
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

const ChildTitle = styled(Caption)`
	padding: 10px 16px;
`;

const ChildItem = styled(GLink)`
	padding: 4px 16px;
	display: flex;
	flex-direction: column;
`;

const ChildItemBold = styled(B)`
	padding: 4px 16px;
`;

const SidebarHighlightSection = styled(HighlightSection)`
	gap: 8px;
	padding: 8px;
`;

const SidebarChildSection = styled(Flex)`
	margin-top: 16px;
	gap: 8px;
	flex-direction: column;
`;
