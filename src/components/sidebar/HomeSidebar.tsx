import React from 'react';
import styled from 'styled-components';
import { GLink, IconSearch24 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { SidebarParentItem } from './SidebarItem';

import { ProjectsItems } from '../menu/ProjectsItems';
import { GIVeconomyItems } from '../menu/GIVeconomyItems';
import { Item } from '../menu/Item';
import { ItemSpacer } from '../menu/common';
import Routes from '@/lib/constants/Routes';
import { setShowSearchModal } from '@/features/modal/modal.slice';

export const HomeSidebar = () => {
	const { theme } = useAppSelector(state => state.general);
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	return (
		<HomeSidebarContainer>
			<Link href='/'>
				<Item theme={theme}>
					<GLink size='Big'>
						{formatMessage({ id: 'label.home' })}
					</GLink>
				</Item>
			</Link>
			<SidebarParentItem
				item={{
					title: formatMessage({ id: 'label.projects' }),
					href: '/projects',
				}}
			>
				<ProjectsItems inSidebar />
			</SidebarParentItem>
			<SidebarParentItem item={{ title: 'GIVeconomy' }}>
				<GIVeconomyItems />
			</SidebarParentItem>
			<ItemSpacer />
			<Link href={Routes.Join}>
				<Item theme={theme}>
					<GLink size='Big'>
						{formatMessage({ id: 'label.community' })}
					</GLink>
				</Item>
			</Link>
			<SearchButton
				theme={theme}
				isHighlighted
				onClick={() => dispatch(setShowSearchModal(true))}
			>
				<Flex alignItems='center' justifyContent='space-between'>
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
