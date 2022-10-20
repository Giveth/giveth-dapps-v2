import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
	brandColors,
	neutralColors,
	OutlineButton,
	H5,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';

import ProjectCard from '@/components/project-card/ProjectCard';
import Routes from '@/lib/constants/Routes';
import { useIntl } from 'react-intl';
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
import { useProjectsContext } from '@/context/projects.context';
import ProjectsFiltersDesktop from '@/components/views/projects/ProjectsFiltersDesktop';
import ProjectsFiltersTablet from '@/components/views/projects/ProjectsFiltersTablet';
import ProjectsFiltersMobile from '@/components/views/projects/ProjectsFiltersMobile';
import LottieControl from '@/components/animations/lottieControl';
import LoadingAnimation from '@/animations/loading_giv.json';
import useDetectDevice from '@/hooks/useDetectDevice';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import ProjectsSortSelect from './ProjectsSortSelect';
import useMediaQuery from '@/hooks/useMediaQuery';
import ProjectsMiddleBanner from './ProjectsMiddleBanner';

export interface IProjectsView {
	projects: IProject[];
	totalCount: number;
	categories: ICategory[];
}

interface IQueries {
	skip?: number;
	limit?: number;
	connectedWalletUserId?: number;
}

const ProjectsIndex = (props: IProjectsView) => {
	const { formatMessage } = useIntl();
	const { projects, totalCount: _totalCount } = props;

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
	const { isDesktop, isTablet, isMobile, isLaptopL } = useDetectDevice();

	const fetchProjects = (
		isLoadMore?: boolean,
		loadNum?: number,
		userIdChanged = false,
	) => {
		const variables: IQueries = {
			limit: userIdChanged ? filteredProjects.length : projects.length,
			skip: userIdChanged ? 0 : projects.length * (loadNum || 0),
		};

		if (user?.id) {
			variables.connectedWalletUserId = Number(user?.id);
		}

		if (!userIdChanged) setIsLoading(true);
		if (contextVariables.mainCategory !== router.query?.slug?.toString())
			return;

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
		pageNum.current = 0;
		fetchProjects(false, 0, true);
	}, [user?.id]);

	useEffect(() => {
		pageNum.current = 0;
		fetchProjects(false, 0);
	}, [contextVariables]);

	useEffect(() => {
		if (router.query?.slug) {
			setVariables(prevVariables => {
				return {
					...prevVariables,
					mainCategory: router.query?.slug?.toString(),
				};
			});
		}
	}, [router.query?.slug]);

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
	const isTabletSlice = useMediaQuery(device.tablet);

	const handleSliceNumber = () => {
		if (isMobile) {
			return 1;
		} else if (isTabletSlice && !isLaptopL) {
			return 2;
		} else {
			return 3;
		}
	};

	const handleArraySlice = () => {
		const sliceIndex = handleSliceNumber();
		const firstSlice = filteredProjects.slice(0, sliceIndex);
		const secondSlice = filteredProjects.slice(sliceIndex);
		return [firstSlice, secondSlice];
	};

	const renderProjects = () => {
		const [firstSlice, secondSlice] = handleArraySlice();
		if (filteredProjects?.length > 0) {
			return (
				<ProjectsWrapper>
					<ProjectsContainer>
						{firstSlice.map(project => (
							<ProjectCard key={project.id} project={project} />
						))}
					</ProjectsContainer>
					<ProjectsMiddleBanner />
					<ProjectsContainer>
						{secondSlice.map(project => (
							<ProjectCard key={project.id} project={project} />
						))}
					</ProjectsContainer>
				</ProjectsWrapper>
			);
		} else {
			return <ProjectsNoResults mainCategories={mainCategories} />;
		}
	};

	return (
		<>
			{isLoading && (
				<Loading>
					<LottieControl
						animationData={LoadingAnimation}
						size={150}
					/>
				</Loading>
			)}

			<ProjectsBanner mainCategory={selectedMainCategory} />
			<Wrapper>
				<FiltersContainer>
					{isDesktop && <ProjectsFiltersDesktop />}
					{isTablet && <ProjectsFiltersTablet />}
					{isMobile && <ProjectsFiltersMobile />}
				</FiltersContainer>
				<SortingContainer>
					<Flex
						justifyContent='space-between'
						flexDirection={isMobile ? 'column' : 'row'}
						gap={isMobile ? '16px' : undefined}
						alignItems={isMobile ? 'stretch' : 'center'}
					>
						<Title>
							{formatMessage({
								id: 'page.projects.title.explore',
							})}
							<span>{totalCount} Projects</span>
						</Title>
						<ProjectsSortSelect />
					</Flex>
				</SortingContainer>
				{isLoading && <Loader className='dot-flashing' />}
				{renderProjects()}
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

const StyledButton = styled(OutlineButton)<{ transparent?: boolean }>`
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
	border-radius: 0;
	margin-bottom: 24px;
	margin-top: 50px;
	gap: 16px;
	${mediaQueries.tablet} {
		border-radius: 16px;
	}
`;

const ProjectsWrapper = styled.div`
	margin-bottom: 64px;
`;

const ProjectsContainer = styled.div`
	display: grid;
	gap: 25px;
	padding: 0 23px;

	${mediaQueries.tablet} {
		padding: 0;
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const Wrapper = styled.div`
	max-width: ${deviceSize.desktop + 'px'};
	margin: 0 auto;
	${mediaQueries.tablet} {
		padding: 0 33px;
	}
	${mediaQueries.laptopS} {
		padding: 0 40px;
	}
`;

const Loading = styled(FlexCenter)`
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	height: 100%;
	width: 100%;
	background-color: gray;
	transition: opacity 0.3s ease-in-out;
	opacity: 0.9;
`;

const Title = styled(H5)`
	font-weight: 700;
	position: relative;

	span {
		color: ${neutralColors.gray[700]};
	}
`;

const SortingContainer = styled.div`
	margin-bottom: 24px;
	padding: 0 23px;
	${mediaQueries.tablet} {
		padding: 0;
	}
`;

export default ProjectsIndex;
