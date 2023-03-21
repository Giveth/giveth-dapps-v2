import { B, Caption, GLink } from '@giveth/ui-design-system';
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

const projectsItems = {
	explore: [
		// { name: 'Trending', query: '?q=?q=trending' },
		{
			name: 'Recently Updated',
			query: '?sort=' + EProjectsSortBy.RECENTLY_UPDATED,
			label: 'label.recently_updated',
		},
		{
			name: 'Just Launched',
			query: '?sort=' + EProjectsSortBy.NEWEST,
			label: 'label.just_launched',
		},
		// { name: 'Popular', query: '?q=popular' },
		{ name: 'All Projects', query: '', label: 'label.all_projects' },
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
					gap='6px'
					flexDirection={inSidebar ? 'column' : undefined}
				>
					{projectsItems.explore.map((explore, idx) => (
						<Link
							key={idx}
							href={`${Routes.Projects}${explore.query}`}
						>
							<Item theme={theme} isHighlighted>
								<B>{formatMessage({ id: explore.label })}</B>
							</Item>
						</Link>
					))}
				</ExploreByRow>
			</HighlightSection>
			<NormalSection inSidebar={inSidebar}>
				<Label medium>
					{formatMessage({ id: 'label.by_category' })}
				</Label>
				<CategoriesGrid inSidebar={inSidebar}>
					{mainCategories.map((category, idx) => (
						<Link
							key={idx}
							href={`${Routes.Projects}/${category.slug}`}
						>
							<Item theme={theme}>
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
	padding-left: 16px;
	text-transform: uppercase;
`;
