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
import { ItemContainer, ItemRow, ItemTitle } from './common';
import Routes from '@/lib/constants/Routes';
import { ETheme } from '@/features/general/general.slice';

const giveconomyItems = [
	{
		title: 'The economy of giving',
		label: 'Giveconomy',
		href: Routes.GIVECONOMY,
	},
	{ title: 'The governance', label: 'GIVgarden', href: Routes.GIVgarden },
	{ title: 'Liquidity to earn', label: 'GIVfarm', href: Routes.GIVfarm },
	{ title: 'Donors reward', label: 'GIVbacks', href: Routes.GIVbacks },
	{ title: 'Invest your GIV', label: 'GIVpower', href: Routes.GIVpower },
	{ title: 'Giveth rewards', label: 'GIVstream', href: Routes.GIVstream },
];

export const GIVeconomyItems = () => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<>
			<Link href={Routes.GIVfarm}>
				<ItemContainer isHighlighted theme={theme}>
					<ItemTitle theme={theme}>Liquidity</ItemTitle>
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
				</ItemContainer>
			</Link>
			<LabelStyle medium>Learn about</LabelStyle>
			{giveconomyItems.map((item, idx) => (
				<Link key={idx} href={item.href}>
					<ItemContainer theme={theme}>
						<ItemTitle theme={theme}>{item.title}</ItemTitle>
						<ItemRow>
							<GLink>{item.label}</GLink>
						</ItemRow>
					</ItemContainer>
				</Link>
			))}
		</>
	);
};

const LabelStyle = styled(Caption)`
	margin: 24px 8px 16px;
`;
