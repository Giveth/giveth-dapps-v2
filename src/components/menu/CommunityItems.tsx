import React from 'react';
import Link from 'next/link';
import { Caption, GLink } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useAppSelector } from '@/features/hooks';
import { ItemRow, ItemTitle } from './common';
import Routes from '@/lib/constants/Routes';
import { Item } from './Item';

export const CommunityItems = () => {
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();

	const communityItems = [
		{
			title: formatMessage({ id: 'label.giver_nfts' }),
			label: formatMessage({ id: 'label.collection_of' }),
			href: Routes.NFT,
		},
		{
			title: formatMessage({ id: 'label.join_and_keep_in_touch' }),
			label: formatMessage({ id: 'label.community_of_makers' }),
			href: Routes.Join,
		},
	];

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
