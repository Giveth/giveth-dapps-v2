import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Caption, FlexCenter, neutralColors } from '@giveth/ui-design-system';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/apollo/apolloClient';
import { EInputs } from '../types';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { EProjectsFilter, IProject } from '@/apollo/types/types';

import { CauseCreateProjectCard } from '@/components/views/causes/create/CauseCreateProjectCard';

const fetchProjectsPage = async (searchFilters: {
	searchTerm: string;
	selectedMainCategory: string;
	filters: EProjectsFilter[];
}) => {
	const filterBy =
		searchFilters.filters.length > 0
			? [...searchFilters.filters, EProjectsFilter.ACCEPT_FUND_ON_POLYGON]
			: [EProjectsFilter.ACCEPT_FUND_ON_POLYGON];

	const { data: projectsData } = await client.query({
		query: FETCH_ALL_PROJECTS,
		variables: {
			limit: 50,
			skip: 0,
			searchTerm: searchFilters.searchTerm,
			mainCategory: searchFilters.selectedMainCategory,
			filters: filterBy,
		},
		notifyOnNetworkStatusChange: true,
	});

	return {
		projects: projectsData?.allProjects?.projects || [],
		totalCount: projectsData?.allProjects?.totalCount || 0,
	};
};

export const CauseProjectsSearchList = ({
	searchFilters,
}: {
	searchFilters: {
		searchTerm: string;
		selectedMainCategory: string;
		filters: EProjectsFilter[];
	};
}) => {
	const [projects, setProjects] = useState<IProject[]>([]);
	const { watch, setValue } = useFormContext();
	const selectedProjectIds = watch(EInputs.selectedProjects) || [];

	const { formatMessage } = useIntl();

	// GraphQL query for projects with Polygon filter by default
	const { data, isLoading } = useQuery({
		queryKey: ['projects', searchFilters],
		queryFn: () => fetchProjectsPage(searchFilters),
	});

	// Update projects when data changes
	useEffect(() => {
		if (data?.projects) {
			setProjects(data.projects);
		}
	}, [data]);

	return (
		<>
			{isLoading ? (
				<LoadingContainer>
					<FlexCenter>
						{formatMessage({ id: 'label.loading' })}...
					</FlexCenter>
				</LoadingContainer>
			) : projects.length === 0 ? (
				<EmptyState>
					<Caption>
						{formatMessage({
							id: 'label.cause.no_projects_found',
						})}
					</Caption>
				</EmptyState>
			) : (
				<ProjectsList>
					{data?.projects.map((project: IProject) => (
						<CauseCreateProjectCard
							key={project.id}
							project={project}
						/>
					))}
				</ProjectsList>
			)}
		</>
	);
};

const LoadingContainer = styled.div`
	padding: 40px;
	color: ${neutralColors.gray[600]};
`;

const EmptyState = styled.div`
	padding: 40px;
	text-align: center;
	color: ${neutralColors.gray[600]};
`;

const ProjectsList = styled.div`
	display: flex;
	flex-direction: row;
	gap: 16px;
	flex-wrap: wrap;
	padding: 16px 0;

	& > * {
		flex: 0 0 calc(50% - 8px);
		max-width: calc(50% - 8px);
	}
`;
