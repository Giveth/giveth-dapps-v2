import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { brandColors, OulineButton } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';

import ProjectCard from '@/components/project-card/ProjectCard';
import Routes from '@/lib/constants/Routes';
import { isUserRegistered, showToastError } from '@/lib/helpers';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { ICategory, IProject } from '@/apollo/types/types';
import { IFetchAllProjects } from '@/apollo/types/gqlTypes';
import ProjectsNoResults from '@/components/views/projects/ProjectsNoResults';
import { device, deviceSize, mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';
import ProjectsBanner from './ProjectsBanner';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useProjectsContext } from '@/context/projects.context';

import ProjectsFiltersDesktop from '@/components/views/projects/ProjectsFiltersDesktop';
import ProjectsFiltersTablet from '@/components/views/projects/ProjectsFiltersTablet';
import ProjectsFiltersMobile from '@/components/views/projects/ProjectsFiltersMobile';

export interface IProjectsView {
	projects: IProject[];
	totalCount: number;
	categories: ICategory[];
}

interface IQueries {
	skip?: number;
	take?: number;
	connectedWalletUserId?: number;
}

const ProjectsIndex = (props: IProjectsView) => {
	const { projects, totalCount: _totalCount, categories } = props;

	const user = useAppSelector(state => state.user.userData);

	const [isLoading, setIsLoading] = useState(false);
	const [filteredProjects, setFilteredProjects] =
		useState<IProject[]>(projects);
	const [totalCount, setTotalCount] = useState(_totalCount);

	const dispatch = useAppDispatch();

	const {
		variables: contextVariables,
		setVariables,
		mainCategories,
		selectedMainCategory,
	} = useProjectsContext();

	const router = useRouter();
	const pageNum = useRef(0);
	const isDesktop = useMediaQuery(device.laptopS);
	const isTablet = useMediaQuery(
		`(min-device-width: ${deviceSize.tablet}px) and (max-device-width: ${
			deviceSize.laptopS - 1
		}px)`,
	);
	const isMobile = !isDesktop && !isTablet;

	const fetchProjects = (
		isLoadMore?: boolean,
		loadNum?: number,
		userIdChanged = false,
	) => {
		const variables: IQueries = {
			take: userIdChanged ? filteredProjects.length : projects.length,
			skip: userIdChanged ? 0 : projects.length * (loadNum || 0),
		};

		if (user?.id) {
			variables.connectedWalletUserId = Number(user?.id);
		}

		if (!userIdChanged) setIsLoading(true);

		client
			.query({
				query: FETCH_ALL_PROJECTS,
				variables: {
					...variables,
					...contextVariables,
				},
				fetchPolicy: 'network-only',
			})
			.then((res: { data: { allProjects: IFetchAllProjects } }) => {
				const data = res.data?.allProjects?.projects;
				const count = res.data?.allProjects?.totalCount;
				setTotalCount(count);
				setFilteredProjects(
					isLoadMore ? filteredProjects.concat(data) : data,
				);
				setIsLoading(false);
			})
			.catch((err: any) => {
				setIsLoading(false);
				showToastError(err);
				captureException(err, {
					tags: {
						section: 'fetchAllProjects',
					},
				});
			});
	};

	useEffect(() => {
		fetchProjects(false, 0, true);
	}, [user?.id]);

	useEffect(() => {
		fetchProjects(false, 0);
	}, [contextVariables.searchTerm]);

	useEffect(() => {
		if (router.query?.slug) {
			setVariables(prevVariables => {
				return {
					...prevVariables,
					mainCategory: selectedMainCategory?.slug,
				};
			});
		}

		fetchProjects(false, 0);
	}, [
		contextVariables?.category,
		contextVariables?.mainCategory,
		router.query?.slug,
		contextVariables?.sortingBy,
	]);

	const loadMore = () => {
		if (isLoading) return;
		fetchProjects(true, pageNum.current + 1);
		pageNum.current = pageNum.current + 1;
	};

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			dispatch(setShowCompleteProfile(true));
		}
	};

	const showLoadMore = totalCount > filteredProjects?.length;

	return (
		<>
			<ProjectsBanner mainCategory={selectedMainCategory} />
			<Wrapper>
				<FiltersContainer>
					{isDesktop && <ProjectsFiltersDesktop />}
					{isTablet && <ProjectsFiltersTablet />}
					{isMobile && <ProjectsFiltersMobile />}
				</FiltersContainer>

				{isLoading && <Loader className='dot-flashing' />}

				{filteredProjects?.length > 0 ? (
					<ProjectsContainer>
						{filteredProjects.map(project => (
							<ProjectCard key={project.id} project={project} />
						))}
					</ProjectsContainer>
				) : (
					<ProjectsNoResults mainCategories={mainCategories} />
				)}

				{showLoadMore && (
					<>
						<StyledButton
							onClick={loadMore}
							label={isLoading ? '' : 'LOAD MORE'}
							icon={
								isLoading && (
									<LoadingDotIcon>
										<div className='dot-flashing' />
									</LoadingDotIcon>
								)
							}
						/>
						<StyledButton
							onClick={handleCreateButton}
							label='Create a Project'
							transparent
						/>
					</>
				)}
			</Wrapper>
		</>
	);
};

const Loader = styled.div`
	margin: 20px auto;
`;

const StyledButton = styled(OulineButton)<{ transparent?: boolean }>`
	color: ${brandColors.pinky[500]};
	border-color: ${props =>
		props.transparent ? 'transparent' : brandColors.pinky[500]};
	margin: 16px auto;
	padding: 22px 80px;

	&:hover {
		color: ${brandColors.pinky[500]};
		background: inherit;
	}
`;

const LoadingDotIcon = styled.div`
	padding: 4px 37px;
`;

const FiltersContainer = styled.div`
	display: flex;
	flex-direction: column;
	background: white;
	position: relative;
	padding: 32px 21px;
	border-radius: 16px;
	margin-bottom: 32px;
	margin-top: 50px;
	gap: 16px;
`;

const ProjectsContainer = styled.div`
	display: grid;
	gap: 25px;
	margin-bottom: 64px;

	${mediaQueries.laptopS} {
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const Wrapper = styled.div`
	max-width: ${deviceSize.desktop + 'px'};
	margin: 0 auto;
`;

export default ProjectsIndex;
