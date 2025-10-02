import React, { FC } from 'react';
import Link from 'next/link';
import { GLink } from '@giveth/ui-design-system';

import { useIntl } from 'react-intl';
import { useAppSelector } from '@/features/hooks';
import { ItemRow } from './common';
import { Item } from './Item';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';

export const communityItems = [
	{
		label: 'label.get_started',
		href: Routes.Onboarding,
	},
	{
		label: 'label.givers_nft',
		href: Routes.NFT,
	},
	{
		label: 'component.title.about_us',
		href: Routes.AboutUs,
	},
	{
		label: 'label.qf.vote',
		href: links.GIVERNANCE_VOTING,
	},
	{
		label: 'label.join_us',
		href: Routes.Join,
	},
	{
		label: `label.leave_feedback`,
		href: links.FEEDBACK,
	},
];

export const CommunityItems = () => {
	return (
		<>
			{communityItems.map((item, idx) =>
				item.href !== links.FEEDBACK ? (
					<Link key={idx} href={item.href}>
						<CommunityItem item={item} />
					</Link>
				) : (
					<a
						key={idx}
						href={item.href}
						target='_blank'
						rel='noreferrer noopener'
					>
						<CommunityItem item={item} />
					</a>
				),
			)}
		</>
	);
};
interface ICommunityItemProps {
	item: {
		label: string;
		href: string;
	};
}

export const CommunityItem: FC<ICommunityItemProps> = ({ item }) => {
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
