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
import { useIntl } from 'react-intl';
import { useAppSelector } from '@/features/hooks';
import { ItemRow, ItemTitle } from './common';
import Routes from '@/lib/constants/Routes';
import { ETheme } from '@/features/general/general.slice';
import { Item } from './Item';
import { useNavigationInfo } from '@/hooks/useNavigationInfo';

export const giveconomyItems = [
	{
		title: 'label.an_economy_of_giving',
		label: 'Giveconomy',
		href: Routes.GIVeconomy,
	},
	{
		title: 'label.governance',
		label: 'GIVgarden',
		href: Routes.GIVgarden,
	},
	{
		title: 'label.earn_with_liquidity',
		label: 'GIVfarm',
		href: Routes.GIVfarm,
	},
	{
		title: 'label.donor_rewards',
		label: 'GIVbacks',
		href: Routes.GIVbacks,
	},
	{
		title: 'label.curate_projects',
		label: 'GIVpower',
		href: Routes.GIVpower,
	},
	{
		title: 'label.streamed_rewards',
		label: 'GIVstream',
		href: Routes.GIVstream,
	},
];

export const GIVeconomyItems = () => {
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();
	const { giveconomyItems } = useNavigationInfo();

	return (
		<>
			<Link href={Routes.GIVfarm}>
				<Item isHighlighted theme={theme}>
					<ItemTitle theme={theme}>
						{formatMessage({ id: 'label.use_your_giv' })}
					</ItemTitle>
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
			<LabelStyle medium>
				{formatMessage({ id: 'page.projects.title.explore' })}
			</LabelStyle>
			{giveconomyItems.map((item, idx) => (
				<Link key={idx} href={item.href}>
					<Item theme={theme}>
						<ItemTitle theme={theme}>
							{formatMessage({ id: item.title })}
						</ItemTitle>
						<ItemRow>
							<GLink> {formatMessage({ id: item.label })}</GLink>
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
