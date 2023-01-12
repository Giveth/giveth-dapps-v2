import { B, Caption, GLink } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { Flex } from '../styled-components/Flex';
import { HighlightSection, BaseMenuContainer } from './common';

const categories = [
	{ name: 'Art & Culture', slug: '' },
	{ name: 'Community', slug: '' },
	{ name: 'Education', slug: '' },
	{ name: 'Equality', slug: '' },
	{ name: 'Economics & Infrastructure', slug: '' },
	{ name: 'Environment & Energy', slug: '' },
	{ name: 'Finance', slug: '' },
	{ name: 'Health & Wellness', slug: '' },
	{ name: 'Nature', slug: '' },
	{ name: 'NGO', slug: '' },
	{ name: 'Technology', slug: '' },
];

export const ProjectsMenu = () => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<MenuContainer theme={theme}>
			<HighlightSection theme={theme}>
				<Caption medium>Explore by</Caption>
				<ExploreByRow gap='24px'>
					<B>Trending</B>
					<B>Recently updated</B>
					<B>Just launched</B>
					<B>Popular</B>
					<B>All projects</B>
				</ExploreByRow>
			</HighlightSection>
			<NormalSection>
				<CategoriesLabel medium>BY CATEGORY</CategoriesLabel>
				<CategoriesGrid>
					{categories.map((category, idx) => (
						<GLink size='Big' key={idx}>
							{category.name}
						</GLink>
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
