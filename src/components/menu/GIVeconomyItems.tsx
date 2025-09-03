import React, { FC } from 'react';
import Link from 'next/link';
import { GLink } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useAppSelector } from '@/features/hooks';
import { ItemRow } from './common';
import Routes from '@/lib/constants/Routes';
import { Item } from './Item';
import links from '@/lib/constants/links';

interface IGIVeconomyItems {
	item: {
		label: string;
		href: string;
	};
}

export const giveconomyItems = [
	{
		label: 'Stake GIV',
		href: Routes.GIVfarm,
	},
	{
		label: 'Vote',
		href: links.FEEDBACK,
	},
];

export const GIVeconomyItems = () => {
	return (
		<>
			{giveconomyItems.map((item, idx) =>
				item.href !== links.FEEDBACK ? (
					<Link key={idx} href={item.href}>
						<GIVeconomyItem item={item} />
					</Link>
				) : (
					<a
						key={idx}
						href={item.href}
						target='_blank'
						rel='noreferrer noopener'
					>
						<GIVeconomyItem item={item} />
					</a>
				),
			)}
		</>
	);
};

export const GIVeconomyItem: FC<IGIVeconomyItems> = ({ item }) => {
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();

	return (
		<Item baseTheme={theme}>
			<ItemRow>
				<GLink>{formatMessage({ id: item.label })}</GLink>
			</ItemRow>
		</Item>
	);
};
