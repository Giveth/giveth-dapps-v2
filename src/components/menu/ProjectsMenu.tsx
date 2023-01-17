import { B, Caption, GLink } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { HighlightSection, BaseMenuContainer } from './common';

export const projectsMenuItem = {
	explore: [
		{ name: 'Trending', query: '?q=?q=trending' },
		{ name: 'Recently updated', query: '?q=recently' },
		{ name: 'Just launched', query: '?q=new' },
		{ name: 'Popular', query: '?q=popular' },
		{ name: 'All projects', query: '' },
	],
};

export const ProjectsMenu = () => {
	const { theme, mainCategories } = useAppSelector(state => state.general);

	return (
		<MenuContainer theme={theme}>
			<HighlightSection theme={theme}>
				<Caption medium>Explore by</Caption>
				<ExploreByRow gap='24px'>
					{projectsMenuItem.explore.map((explore, idx) => (
						<Link key={idx} href={`/projects${explore.query}`}>
							<B key={idx}>{explore.name}</B>
						</Link>
					))}
				</ExploreByRow>
			</HighlightSection>
			<NormalSection>
				<CategoriesLabel medium>BY CATEGORY</CategoriesLabel>
				<CategoriesGrid>
					{mainCategories.map((category, idx) => (
						<Link key={idx} href={`/projects/${category.slug}`}>
							<GLink size='Big' key={idx}>
								{category.title}
							</GLink>
						</Link>
					))}
				</CategoriesGrid>
			</NormalSection>
		</MenuContainer>
	);
};

const MenuContainer = styled(BaseMenuContainer)`
	width: 697px;
`;

const ExploreByRow = styled(Flex)`
	margin-top: 16px;
`;

const NormalSection = styled.div`
	margin-top: 16px;
	padding: 8px 16px;
	border-radius: 16px;
`;

const CategoriesGrid = styled.div`
	display: grid;
	grid-template: auto auto auto auto / auto auto auto;
	column-gap: 24px;
	row-gap: 16px;
	margin-top: 16px;
	margin-bottom: 8px;
`;

const CategoriesLabel = styled(Caption)``;
