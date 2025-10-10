import React from 'react';
import styled from 'styled-components';
import { GLink, IconSearch24, Flex } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { SidebarParentItem } from './SidebarItem';

import { ProjectsItems } from '../menu/ProjectsItems';
import { GIVeconomyItems } from '../menu/GIVeconomyItems';
import { Item } from '../menu/Item';
import { setShowSearchModal } from '@/features/modal/modal.slice';
import { CommunityItems } from '../menu/CommunityItems';

export const HomeSidebar = () => {
	const { theme } = useAppSelector(state => state.general);
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	return (
		<HomeSidebarContainer>
			<Link href='/'>
				<Item baseTheme={theme}>
					<GLink size='Big'>
						{formatMessage({ id: 'label.home' })}
					</GLink>
				</Item>
			</Link>
			<SidebarParentItem
				item={{
					title: formatMessage({ id: 'label.donate' }),
					href: '/projects',
				}}
			>
				<ProjectsItems />
			</SidebarParentItem>
			<SidebarParentItem item={{ title: 'GIVeconomy' }}>
				<GIVeconomyItems />
			</SidebarParentItem>
			<SidebarParentItem
				item={{ title: formatMessage({ id: 'label.community' }) }}
			>
				<CommunityItems />
			</SidebarParentItem>

			<SearchButton
				baseTheme={theme}
				isHighlighted
				onClick={() => dispatch(setShowSearchModal(true))}
			>
				<Flex $alignItems='center' $justifyContent='space-between'>
					<GLink size='Big'>
						{formatMessage({ id: 'label.search' })}
					</GLink>
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
