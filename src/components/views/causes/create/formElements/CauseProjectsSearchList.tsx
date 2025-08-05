import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Caption, FlexCenter, neutralColors } from '@giveth/ui-design-system';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/apollo/apolloClient';
import { FETCH_ALL_PROJECTS_CAUSES } from '@/apollo/gql/gqlCauses';
import { EProjectsFilter, IProject } from '@/apollo/types/types';

import { CauseCreateProjectCard } from '@/components/views/causes/create/CauseCreateProjectCard';
import Pagination from '@/components/Pagination';

/**
 * Fetch projects from the database
 * @param searchFilters - The search filters
 * @returns The projects
 */
const fetchProjectsPage = async (
	searchFilters: {
		searchTerm: string;
		selectedMainCategory: string;
		filters: EProjectsFilter[];
	},
	page?: number,
) => {
	const filterBy =
		searchFilters.filters.length > 0
			? [
					...searchFilters.filters,
					EProjectsFilter.ACCEPT_FUND_ON_POLYGON,
					EProjectsFilter.VERIFIED,
				]
			: [
					EProjectsFilter.ACCEPT_FUND_ON_POLYGON,
					EProjectsFilter.VERIFIED,
				];

	const { data: projectsData } = await client.query({
		query: FETCH_ALL_PROJECTS_CAUSES,
		variables: {
			limit: 16,
			skip: page ? page * 16 : 0,
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
	showErrorModal,
}: {
	searchFilters: {
		searchTerm: string;
		selectedMainCategory: string;
		filters: EProjectsFilter[];
	};
	showErrorModal: (show: boolean) => void;
}) => {
	const [projects, setProjects] = useState<IProject[]>([]);
	const { watch, setValue } = useFormContext();
	const selectedProjects = watch('selectedProjects') || [];
	const [page, setPage] = useState(0);

	const { formatMessage } = useIntl();

	// GraphQL query for projects with Polygon filter by default
	const { data, isLoading } = useQuery({
		queryKey: ['projects', searchFilters, page],
		queryFn: () => fetchProjectsPage(searchFilters, page),
	});

	// Update projects when data changes
	useEffect(() => {
		if (data?.projects) {
			setProjects(data.projects);
		}
	}, [data]);

	// Reset page when search filters change
	useEffect(() => {
		setPage(0);
	}, [searchFilters]);

	const itemPerPage = 16;

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
				<>
					<ProjectsList>
						{data?.projects.map((project: IProject) => (
							<CauseCreateProjectCard
								key={project.id}
								project={project}
								onProjectSelect={(
									updatedProjects: IProject[],
								) => {
									setValue(
										'selectedProjects',
										updatedProjects,
									);
								}}
								selectedProjects={selectedProjects}
								isSelected={selectedProjects.some(
									(selectedProject: IProject) =>
										selectedProject.id === project.id,
								)}
								showErrorModal={showErrorModal}
							/>
						))}
					</ProjectsList>
					<Pagination
						currentPage={page}
						totalCount={data?.totalCount ?? 0}
						setPage={setPage}
						itemPerPage={itemPerPage}
					/>
				</>
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
	align-items: flex-end;
	gap: 16px;
	flex-wrap: wrap;
	padding: 16px 0;

	& > * {
		flex: 0 0 calc(50% - 8px);
		max-width: calc(50% - 8px);
	}
`;
