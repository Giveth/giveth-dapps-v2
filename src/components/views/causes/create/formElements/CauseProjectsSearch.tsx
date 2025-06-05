import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	H5,
	Caption,
	neutralColors,
	brandColors,
	FlexCenter,
	IconSearch,
	semanticColors,
} from '@giveth/ui-design-system';
import { useFormContext } from 'react-hook-form';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { EProjectsFilter, IProject } from '@/apollo/types/types';
import { EInputs } from '../types';
import CheckBox from '@/components/Checkbox';
import { useAppSelector } from '@/features/hooks';

interface ICauseProjectsSearchProps {
	// Add any props if needed
}

export const CauseProjectsSearch = (props: ICauseProjectsSearchProps) => {
	const { formatMessage } = useIntl();
	const { watch, setValue, getValues } = useFormContext();

	// Form state
	const selectedProjectIds = watch(EInputs.selectedProjects) || [];

	// Local state
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedMainCategories, setSelectedMainCategories] = useState<
		string[]
	>([]);
	const [projects, setProjects] = useState<IProject[]>([]);
	const [loading, setLoading] = useState(false);

	// Get main categories from Redux store
	const mainCategories = useAppSelector(
		state => state.general.mainCategories,
	);

	// GraphQL query for projects with Polygon filter by default
	const {
		data: projectsData,
		loading: projectsLoading,
		refetch,
	} = useQuery(FETCH_ALL_PROJECTS, {
		variables: {
			limit: 50,
			skip: 0,
			searchTerm: searchTerm || undefined,
			mainCategory:
				selectedMainCategories.length > 0
					? selectedMainCategories[0]
					: undefined,
			filters: [EProjectsFilter.ACCEPT_FUND_ON_POLYGON], // Default to Polygon projects
		},
		fetchPolicy: 'cache-and-network',
		notifyOnNetworkStatusChange: true,
	});

	// Update projects when data changes
	useEffect(() => {
		if (projectsData?.allProjects?.projects) {
			setProjects(projectsData.allProjects.projects);
		}
	}, [projectsData]);

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	// Handle main category selection
	const handleMainCategoryChange = (
		categorySlug: string,
		checked: boolean,
	) => {
		let updatedCategories: string[];
		if (checked) {
			updatedCategories = [...selectedMainCategories, categorySlug];
		} else {
			updatedCategories = selectedMainCategories.filter(
				slug => slug !== categorySlug,
			);
		}
		setSelectedMainCategories(updatedCategories);
	};

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
		<Container>
			<HeaderSection>
				<H5>{formatMessage({ id: 'label.search_projects' })}</H5>
				<Caption>
					{formatMessage({
						id: 'label.cause.search_projects_description',
					})}
				</Caption>
			</HeaderSection>

			{/* Search Input */}
			<SearchSection>
				<SearchInputWrapper>
					<IconSearch size={16} color={neutralColors.gray[600]} />
					<SearchInput
						type='text'
						placeholder={formatMessage({
							id: 'label.search_projects_placeholder',
						})}
						value={searchTerm}
						onChange={handleSearchChange}
					/>
				</SearchInputWrapper>
			</SearchSection>

			{/* Main Categories Filter */}
			<CategorySection>
				<CategoryTitle>
					{formatMessage({ id: 'label.filter_by_categories' })}
				</CategoryTitle>
				<CategoryGrid>
					{mainCategories.map(category => (
						<CategoryItem key={category.slug}>
							<CheckBox
								label={formatMessage({
									id: `projects_${category.slug}`,
								})}
								checked={selectedMainCategories.includes(
									category.slug,
								)}
								onChange={checked =>
									handleMainCategoryChange(
										category.slug,
										checked,
									)
								}
								size={16}
							/>
						</CategoryItem>
					))}
				</CategoryGrid>
			</CategorySection>

			{/* Network Info */}
			<NetworkInfo>
				<InfoBadge>
					{formatMessage({ id: 'label.polygon_projects_only' })}
				</InfoBadge>
			</NetworkInfo>

			{/* Projects List */}
			<ProjectsSection>
				<SectionTitle>
					{formatMessage({ id: 'label.available_projects' })}
					{projects.length > 0 && (
						<ProjectCount>({projects.length})</ProjectCount>
					)}
				</SectionTitle>

				{projectsLoading ? (
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
						{projects.map(project => (
							<ProjectItem key={project.id}>
								<ProjectCheckbox>
									<CheckBox
										label=''
										checked={isProjectSelected(project.id)}
										onChange={checked =>
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
			</ProjectsSection>

			{/* Selected Projects Summary */}
			{selectedProjectIds.length > 0 && (
				<SelectedSummary>
					<Caption>
						{formatMessage({ id: 'label.selected_projects' })}:{' '}
						{selectedProjectIds.length}
					</Caption>
				</SelectedSummary>
			)}
		</Container>
	);
};

// Styled Components
const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 24px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 12px;
	background: white;
`;

const HeaderSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const SearchSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const SearchInputWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	background: white;

	&:focus-within {
		border-color: ${brandColors.giv[500]};
	}
`;

const SearchInput = styled.input`
	flex: 1;
	border: none;
	outline: none;
	font-size: 14px;
	color: ${neutralColors.gray[900]};

	&::placeholder {
		color: ${neutralColors.gray[600]};
	}
`;

const CategorySection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const CategoryTitle = styled.div`
	font-weight: 500;
	font-size: 14px;
	color: ${neutralColors.gray[900]};
`;

const CategoryGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 12px;
`;

const CategoryItem = styled.div`
	display: flex;
	align-items: center;
`;

const NetworkInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const InfoBadge = styled.div`
	padding: 6px 12px;
	background: ${brandColors.giv[100]};
	color: ${brandColors.giv[700]};
	border-radius: 16px;
	font-size: 12px;
	font-weight: 500;
`;

const ProjectsSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const SectionTitle = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	font-weight: 500;
	font-size: 16px;
	color: ${neutralColors.gray[900]};
`;

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
