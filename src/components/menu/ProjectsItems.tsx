import {
	B,
	brandColors,
	Caption,
	GLink,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { HighlightSection } from './common';
import { Item } from './Item';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import Routes from '@/lib/constants/Routes';
import { ETheme } from '@/features/general/general.slice';

const projectsItems = {
	explore: [
		// { name: 'Trending', query: '?q=?q=trending' },
		{
			name: 'All Projects',
			url: Routes.Projects,
			label: 'label.all_projects',
		},
		{
			name: 'Recently Updated',
			url: Routes.Projects + '?sort=' + EProjectsSortBy.RECENTLY_UPDATED,
			label: 'label.recently_updated',
		},
		{
			name: 'Just Launched',
			url: Routes.Projects + '?sort=' + EProjectsSortBy.NEWEST,
			label: 'label.just_launched',
		},
		{
			name: 'Quadratic Funding',
			url: Routes.QuadraticFunding,
			label: 'label.quadratic_funding',
		},
		// { name: 'Popular', query: '?q=popular' },
	],
};

interface IProjectsItems {
	inSidebar?: boolean;
}

export const ProjectsItems: FC<IProjectsItems> = ({ inSidebar = false }) => {
	const { theme, mainCategories } = useAppSelector(state => state.general);
	const { formatMessage } = useIntl();

	return (
		<>
			<HighlightSection theme={theme}>
				<Label medium>
					{formatMessage({ id: 'label.explore_by' })}
				</Label>
				<ExploreByRow
					gap='16px'
					flexDirection={inSidebar ? 'column' : undefined}
				>
					{projectsItems.explore.map((explore, idx) => (
						<Link key={idx} href={explore.url}>
							<Item
								className={`${
									explore.url === Routes.QuadraticFunding
										? 'quadratic-menu-item'
										: ''
								} projects-menu-items`}
								theme={theme}
								isHighlighted
							>
								<B>{formatMessage({ id: explore.label })}</B>
							</Item>
						</Link>
					))}
				</ExploreByRow>
			</HighlightSection>
			<NormalSection inSidebar={inSidebar}>
				<Label medium>{formatMessage({ id: 'label.category' })}</Label>
				<CategoriesGrid inSidebar={inSidebar} theme={theme}>
					{mainCategories.map((category, idx) => (
						<Link
							key={idx}
							href={`${Routes.Projects}/${category.slug}`}
						>
							<Item className='menu-category-item' theme={theme}>
								<GLink size='Big'>
									{formatMessage({ id: category.slug })}
								</GLink>
							</Item>
						</Link>
					))}
				</CategoriesGrid>
			</NormalSection>
		</>
	);
};

const ExploreByRow = styled(Flex)`
	margin-top: 16px;
	.quadratic-menu-item {
		background: ${brandColors.cyan[600]};
		border-radius: 16px;
		color: white;
	}
	.projects-menu-items {
		padding: 2px 8px;
	}
`;

const NormalSection = styled.div<{ inSidebar?: boolean }>`
	margin-top: 16px;
	padding: 8px 8px 0;
	border-radius: 16px;
`;

const CategoriesGrid = styled.div<{ inSidebar?: boolean; theme: ETheme }>`
	display: grid;
	grid-template: ${props =>
		props.inSidebar ? 'auto' : 'auto auto auto auto / auto auto auto'};
	margin-top: 8px;
	.menu-category-item {
		padding: 8px;
		:hover {
			background: transparent;
			color: ${({ theme }) =>
				theme === ETheme.Dark
					? brandColors.giv[200]
					: brandColors.giv[500]};
		}
	}
`;

const Label = styled(Caption)`
	padding-left: 8px;
	text-transform: uppercase;
	color: ${neutralColors.gray[600]};
`;
