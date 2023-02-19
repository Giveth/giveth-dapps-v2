import { B, Caption, GLink } from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { HighlightSection } from './common';
import { Item } from './Item';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import Routes from '@/lib/constants/Routes';

const projectsItems = {
	explore: [
		// { name: 'Trending', query: '?q=?q=trending' },
		{
			name: 'Recently updated',
			query: '?sort=' + EProjectsSortBy.RECENTLY_UPDATED,
		},
		{
			name: 'Just launched',
			query: '?sort=' + EProjectsSortBy.NEWEST,
		},
		// { name: 'Popular', query: '?q=popular' },
		{ name: 'All projects', query: '' },
	],
};

interface IProjectsItems {
	inSidebar?: boolean;
}

export const ProjectsItems: FC<IProjectsItems> = ({ inSidebar = false }) => {
	const { theme, mainCategories } = useAppSelector(state => state.general);

	return (
		<>
			<HighlightSection theme={theme}>
				<Label medium>Explore by</Label>
				<ExploreByRow
					gap='6px'
					flexDirection={inSidebar ? 'column' : undefined}
				>
					{projectsItems.explore.map((explore, idx) => (
						<Link
							key={idx}
							href={`${Routes.Projects}${explore.query}`}
						>
							<Item theme={theme} isHighlighted>
								<B>{explore.name}</B>
							</Item>
						</Link>
					))}
				</ExploreByRow>
			</HighlightSection>
			<NormalSection inSidebar={inSidebar}>
				<Label medium>BY CATEGORY</Label>
				<CategoriesGrid inSidebar={inSidebar}>
					{mainCategories.map((category, idx) => (
						<Link
							key={idx}
							href={`${Routes.Projects}/${category.slug}`}
						>
							<Item theme={theme}>
								<GLink size='Big'>{category.title}</GLink>
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
`;

const NormalSection = styled.div<{ inSidebar?: boolean }>`
	margin-top: 16px;
	padding: 8px;
	border-radius: 16px;
`;

const CategoriesGrid = styled.div<{ inSidebar?: boolean }>`
	display: grid;
	grid-template: ${props =>
		props.inSidebar ? 'auto' : 'auto auto auto auto / auto auto auto'};
	column-gap: 24px;
	row-gap: 16px;
	margin-top: 16px;
	margin-bottom: 8px;
`;

const Label = styled(Caption)`
	padding-left: 8px;
`;
