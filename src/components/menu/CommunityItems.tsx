import React from 'react';
import Link from 'next/link';
import { Caption, GLink } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { ItemRow, ItemTitle } from './common';
import { Item } from './Item';
import { useNavigationInfo } from '@/hooks/useNavigationInfo';

export const CommunityItems = () => {
	const theme = useAppSelector(state => state.general.theme);
	const { communityItems } = useNavigationInfo();
	return (
		<>
			{communityItems.map((item, idx) => (
				<Link key={idx} href={item.href}>
					<Item theme={theme}>
						<ItemTitle theme={theme}>{item.title}</ItemTitle>
						<ItemRow>
							<GLink>{item.label}</GLink>
						</ItemRow>
					</Item>
				</Link>
			))}
		</>
	);
};

const LabelStyle = styled(Caption)`
	margin: 24px 16px 16px;
`;
