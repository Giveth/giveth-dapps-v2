import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	Caption,
	FlexCenter,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/apollo/apolloClient';
import { EInputs } from '../types';
import { SectionTitle } from '@/components/modals/StakeLock/StakeLock.sc';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { EProjectsFilter, IProject } from '@/apollo/types/types';

import CheckBox from '@/components/Checkbox';

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

	// Handle project selection
	const handleProjectSelect = (projectId: string, checked: boolean) => {
		let updatedProjects: string[];
		if (checked) {
			updatedProjects = [...selectedProjectIds, projectId];
		} else {
			updatedProjects = selectedProjectIds.filter(
				(id: string) => id !== projectId,
			);
		}
		setValue(EInputs.selectedProjects, updatedProjects);
	};

	// Check if project is selected
	const isProjectSelected = (projectId: string) => {
		return selectedProjectIds.includes(projectId);
	};

	return (
		<div>
			{/* Projects List */}
			<div>
				<SectionTitle>
					{formatMessage({ id: 'label.available_projects' })}
					{projects.length > 0 && <span>({projects.length})</span>}
				</SectionTitle>

				{isLoading ? (
					<LoadingContainer>
						<FlexCenter>
							{formatMessage({ id: 'label.loading' })}...
						</FlexCenter>
					</LoadingContainer>
				) : projects.length === 0 ? (
					<EmptyState>
						<Caption>
							{formatMessage({ id: 'label.no_projects_found' })}
						</Caption>
					</EmptyState>
				) : (
					<ProjectsList>
						{data?.projects.map((project: IProject) => (
							<ProjectItem key={project.id}>
								<ProjectCheckbox>
									<CheckBox
										label=''
										checked={isProjectSelected(project.id)}
										onChange={(checked: boolean) =>
											handleProjectSelect(
												project.id,
												checked,
											)
										}
										size={18}
									/>
								</ProjectCheckbox>
								<ProjectInfo>
									<ProjectImage
										src={
											project.image ||
											'/images/placeholders/project-image.png'
										}
										alt={project.title}
									/>
									<ProjectDetails>
										<ProjectTitle>
											{project.title}
										</ProjectTitle>
										<ProjectDescription>
											{project.descriptionSummary ||
												project.description}
										</ProjectDescription>
										{project.verified && (
											<VerifiedBadge>
												{formatMessage({
													id: 'label.verified',
												})}
											</VerifiedBadge>
										)}
									</ProjectDetails>
								</ProjectInfo>
							</ProjectItem>
						))}
					</ProjectsList>
				)}
			</div>
		</div>
	);
};

const ProjectCount = styled.span`
	color: ${neutralColors.gray[600]};
	font-weight: 400;
`;

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
	flex-direction: column;
	gap: 16px;
	max-height: 400px;
	overflow-y: auto;
`;

const ProjectItem = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 16px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	background: white;
	transition: all 0.2s ease;

	&:hover {
		border-color: ${brandColors.giv[300]};
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
`;

const ProjectCheckbox = styled.div`
	margin-top: 4px;
`;

const ProjectInfo = styled.div`
	display: flex;
	gap: 12px;
	flex: 1;
`;

const ProjectImage = styled.img`
	width: 60px;
	height: 60px;
	border-radius: 8px;
	object-fit: cover;
	background: ${neutralColors.gray[200]};
`;

const ProjectDetails = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
`;

const ProjectTitle = styled.div`
	font-weight: 500;
	font-size: 16px;
	color: ${neutralColors.gray[900]};
	line-height: 1.4;
`;

const ProjectDescription = styled.div`
	font-size: 14px;
	color: ${neutralColors.gray[700]};
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

const VerifiedBadge = styled.div`
	display: inline-block;
	padding: 4px 8px;
	background: ${semanticColors.jade[100]};
	color: ${semanticColors.jade[700]};
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
	width: fit-content;
`;

const SelectedSummary = styled.div`
	padding: 12px 16px;
	background: ${brandColors.giv[50]};
	border-radius: 8px;
	border-left: 4px solid ${brandColors.giv[500]};
`;
