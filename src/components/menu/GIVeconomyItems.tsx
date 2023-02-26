import React from 'react';
import Link from 'next/link';
import {
	B,
	Caption,
	GLink,
	IconGIVFarm,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { ItemRow, ItemTitle } from './common';
import Routes from '@/lib/constants/Routes';
import { ETheme } from '@/features/general/general.slice';
import { Item } from './Item';

const giveconomyItems = [
	{
		title: 'An Economy of Giving',
		label: 'Giveconomy',
		href: Routes.GIVECONOMY,
	},
	{ title: 'Governance', label: 'GIVgarden', href: Routes.GIVgarden },
	{ title: 'Earn with Liqudity', label: 'GIVfarm', href: Routes.GIVfarm },
	{ title: 'Donor Rewards', label: 'GIVbacks', href: Routes.GIVbacks },
	{ title: 'Curate Projects', label: 'GIVpower', href: Routes.GIVpower },
	{ title: 'Streamed Rewards', label: 'GIVstream', href: Routes.GIVstream },
];

export const GIVeconomyItems = () => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<>
			<Link href={Routes.GIVfarm}>
				<Item isHighlighted theme={theme}>
					<ItemTitle theme={theme}>Use your GIV</ItemTitle>
					<ItemRow>
						<B>GIVfarm</B>
						<IconGIVFarm
							size={24}
							color={
								theme === ETheme.Dark
									? neutralColors.gray[100]
									: neutralColors.gray[900]
							}
						/>
					</ItemRow>
				</Item>
			</Link>
			<LabelStyle medium>Explore</LabelStyle>
			{giveconomyItems.map((item, idx) => (
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
	margin: 24px 8px 16px;
`;
