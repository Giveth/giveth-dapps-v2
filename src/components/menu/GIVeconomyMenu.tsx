import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
	B,
	brandColors,
	Caption,
	GLink,
	IconGIVFarm,
	neutralColors,
} from '@giveth/ui-design-system';
import { useAppSelector } from '@/features/hooks';
import { HighlightSection, BaseMenuContainer } from './common';
import Routes from '@/lib/constants/Routes';
import { Flex } from '../styled-components/Flex';
import { ETheme } from '@/features/general/general.slice';

const items = [
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

export const GIVeconomyMenu = () => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<MenuContainer theme={theme}>
			<Link href={Routes.GIVfarm}>
				<HighlightSection theme={theme}>
					<Caption>Liquidity</Caption>
					<Flex justifyContent='space-between'>
						<B>GIVfarm</B>
						<IconGIVFarm
							size={24}
							color={
								theme === ETheme.Dark
									? neutralColors.gray[100]
									: neutralColors.gray[900]
							}
						/>
					</Flex>
				</HighlightSection>
				{items.map((item, idx) => (
					<Link key={idx} href={item.href}>
						<MenuItem theme={theme}>
							<Title size='Small'>{item.title}</Title>
							<Label size='Big'>{item.label}</Label>
						</MenuItem>
					</Link>
				))}
			</Link>
		</MenuContainer>
	);
};

const MenuContainer = styled(BaseMenuContainer)`
	width: 239px;
`;

const MenuItem = styled(Flex)`
	flex-direction: column;
	gap: 4px;
	padding: 4px 16px;
	&:hover {
		background-color: ${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[500]
				: neutralColors.gray[600]};
	}
	border-radius: 8px;
	margin: 8px 0;
	transition: background-color 0.3s ease;
`;

const Title = styled(GLink)`
	color: ${brandColors.giv[200]};
`;

const Label = styled(GLink)`
	color: ${neutralColors.gray[100]};
`;
