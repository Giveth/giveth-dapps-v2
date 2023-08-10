import React, { FC } from 'react';
import Link from 'next/link';
import { GLink } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useAppSelector } from '@/features/hooks';
import { ItemRow, ItemTitle } from './common';
import Routes from '@/lib/constants/Routes';
import { Item } from './Item';
import links from '@/lib/constants/links';

const communityItems = [
	{
		title: 'label.get_a',
		label: 'label.givers_nft',
		href: Routes.NFT,
	},
	{
		title: 'label.learn_how_to',
		label: 'label.join_us',
		href: Routes.Join,
	},
	{
		title: 'label.discover_our',
		label: 'label.mission',
		href: links.OUR_MISSION,
		isExternal: true,
	},
];

export const CommunityItems = () => {
	return (
		<>
			{communityItems.map((item, idx) =>
				item.isExternal ? (
					<a
						key={idx}
						href={item.href}
						target='_blank'
						rel='noopener noreferrer'
					>
						<CommunityItem item={item} />
					</a>
				) : (
					<Link key={idx} href={item.href}>
						<CommunityItem item={item} />
					</Link>
				),
			)}
		</>
	);
};

interface ICommunityItemProps {
	item: {
		title: string;
		label: string;
		href: string;
		isExternal?: boolean;
	};
}

export const CommunityItem: FC<ICommunityItemProps> = ({ item }) => {
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();

	return (
		<Item theme={theme}>
			<ItemTitle theme={theme}>
				{formatMessage({ id: item.title })}
			</ItemTitle>
			<ItemRow>
				<GLink>{formatMessage({ id: item.label })}</GLink>
			</ItemRow>
		</Item>
	);
};
