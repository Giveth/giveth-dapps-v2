import React from 'react';
import Link from 'next/link';
import { GLink } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useAppSelector } from '@/features/hooks';
import { ItemRow, ItemTitle } from './common';
import Routes from '@/lib/constants/Routes';
import { Item } from './Item';
import links from '@/lib/constants/links';

export const CommunityItems = () => {
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();

	const handleClick = (e: React.MouseEvent, outsideLink?: boolean) => {
		if (outsideLink) {
			e.stopPropagation();
		}
	};

	const communityItems = [
		{
			title: formatMessage({ id: 'label.get_a' }),
			label: formatMessage({ id: 'label.givers_nft' }),
			href: Routes.NFT,
		},
		{
			title: formatMessage({ id: 'label.learn_how_to' }),
			label: formatMessage({ id: 'label.join_us' }),
			href: Routes.Join,
		},
		{
			title: formatMessage({ id: 'label.discover_our' }),
			label: formatMessage({ id: 'label.mission' }),
			href: links.OUR_MISSION,
			outsideLink: true,
		},
	];

	return (
		<>
			{communityItems.map((item, idx) => (
				<Link
					key={idx}
					href={item.href}
					target={item.outsideLink ? '_blank' : '_self'}
					rel={item.outsideLink ? 'noopener noreferrer' : ''} //For security reasons
					onClick={e => handleClick(e, item.outsideLink)}
				>
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
