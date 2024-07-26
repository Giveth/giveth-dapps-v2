import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
	brandColors,
	OutlineButton,
	FlexCenter,
	Container,
	deviceSize,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';
import {
	QueryFunctionContext,
	useInfiniteQuery,
	useQueryClient,
} from '@tanstack/react-query';
import ProjectCard from '@/components/project-card/ProjectCard';
import Routes from '@/lib/constants/Routes';
import { isUserRegistered, showToastError } from '@/lib/helpers';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { IProject } from '@/apollo/types/types';
import ProjectsNoResults from '@/components/views/projects/ProjectsNoResults';
import { BACKEND_QUERY_LIMIT, mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';
import { ProjectsBanner } from './ProjectsBanner';
import { useProjectsContext } from '@/context/projects.context';
import { ProjectsMiddleBanner } from './MiddleBanners/ProjectsMiddleBanner';
import { ActiveQFProjectsBanner } from './qfBanner/ActiveQFProjectsBanner';
import { PassportBanner } from '@/components/PassportBanner';
import { QFProjectsMiddleBanner } from './MiddleBanners/QFMiddleBanner';
import { QFNoResultBanner } from './MiddleBanners/QFNoResultBanner';
import { Spinner } from '@/components/Spinner';
import { getMainCategorySlug } from '@/helpers/projects';
import { FilterContainer } from './filter/FilterContainer';
import { SortContainer } from './sort/SortContainer';
import { ArchivedQFRoundStats } from './ArchivedQFRoundStats';
import { ArchivedQFProjectsBanner } from './qfBanner/ArchivedQFProjectsBanner';
import { ActiveQFRoundStats } from './ActiveQFRoundStats';
import useMediaQuery from '@/hooks/useMediaQuery';
import { QFHeader } from '@/components/views/archivedQFRounds/QFHeader';
import { DefaultQFBanner } from '@/components/DefaultQFBanner';
import NotAvailable from '@/components/NotAvailable';

export interface IProjectsView {
	projects: IProject[];
	totalCount: number;
}

interface IQueries {
	skip?: number;
	limit?: number;
	connectedWalletUserId?: number;
}

/**
 * A page of projects - return type in fetchProjects function
 */
interface Page {
	data: IProject[];
	previousCursor?: number;
	nextCursor?: number;
}

const ProjectsIndex = (props: IProjectsView) => {
	const queryClient = useQueryClient();
	const { formatMessage } = useIntl();
	const { projects, totalCount: _totalCount } = props;
	const user = useAppSelector(state => state.user.userData);
	const { activeQFRound, mainCategories } = useAppSelector(
		state => state.general,
	);
	const [isNotFound, setIsNotFound] = useState(false);
	const [filteredProjects, setFilteredProjects] =
		useState<IProject[]>(projects);
	const [totalCount, setTotalCount] = useState(_totalCount);
	const isMobile = useMediaQuery(`(max-width: ${deviceSize.tablet - 1}px)`);

	const dispatch = useAppDispatch();

	const {
		variables: contextVariables,
		selectedMainCategory,
		isQF,
		isArchivedQF,
	} = useProjectsContext();

	const router = useRouter();
	const lastElementRef = useRef<HTMLDivElement>(null);
	const isInfiniteScrolling = useRef(true);

	// Default values for queryKey
	const [isLoadMore, setIsLoadMore] = useState(false);
	const [userIdChanged, setUserIdChanged] = useState(false);

	const fetchProjects = useCallback(
		async (pageParam: number | unknown): Promise<Page> => {
			const currentPage = typeof pageParam === 'number' ? pageParam : 0;

			const variables: IQueries = {
				limit: userIdChanged
					? filteredProjects.length > 50
						? BACKEND_QUERY_LIMIT
						: filteredProjects.length
					: projects.length,
				skip: userIdChanged ? 0 : projects.length * (currentPage || 0),
			};

			if (user?.id) {
				variables.connectedWalletUserId = Number(user?.id);
			}

			const res = await client.query({
				query: FETCH_ALL_PROJECTS,
				variables: {
					...variables,
					...contextVariables,
					mainCategory: isArchivedQF
						? undefined
						: getMainCategorySlug(selectedMainCategory),
					qfRoundSlug: isArchivedQF ? router.query.slug : null,
				},
			});

			const data = res.data?.allProjects?.projects;
			const count = res.data?.allProjects?.totalCount;
			setTotalCount(count);

			setFilteredProjects(prevProjects => {
				isInfiniteScrolling.current =
					(data.length + prevProjects.length) % 45 !== 0;
				return isLoadMore ? [...prevProjects, ...data] : data;
			});

			return {
				data: data,
				previousCursor: currentPage - 1,
				nextCursor: currentPage + 1,
			};
		},
		[
			contextVariables,
			isArchivedQF,
			projects.length,
			router.query.slug,
			selectedMainCategory,
			user?.id,
			userIdChanged,
			isLoadMore,
			filteredProjects,
		],
	);

	const {
		data,
		error,
		fetchNextPage,
		isError,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery<Page, Error>({
		queryKey: ['projects'],
		queryFn: ({ pageParam = 0 }: QueryFunctionContext) =>
			fetchProjects(pageParam),
		getNextPageParam: (lastPage, someData) => {
			console.log('lastPage', lastPage);
			console.log('someData', someData);
			return lastPage.nextCursor;
		},
		initialPageParam: 0,
	});

	// User signied in or singout reset query
	// TODO: need to refactor, only change when user loggin or out
	// useEffect(() => {
	// 	console.log('user id changed');
	// 	if (user?.id) {
	// 		setUserIdChanged(prevState => !prevState);
	// 		queryClient.resetQueries({
	// 			queryKey: ['projects'],
	// 			exact: true,
	// 		});
	// 	}
	// }, [queryClient, user?.id]);

	// Reset query if contect variables change occurs
	// TODO: need to refactor,
	// useEffect(() => {
	// 	queryClient.resetQueries({
	// 		queryKey: ['projects'],
	// 		exact: true,
	// 	});
	// }, [contextVariables, queryClient]);

	// Function that triggers when you scroll down - infinite loading
	const loadMore = useCallback(() => {
		fetchNextPage();
	}, [fetchNextPage]);

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			dispatch(setShowCompleteProfile(true));
		}
	};

	const showLoadMore =
		totalCount > filteredProjects?.length && !isInfiniteScrolling.current;

	// Check if there any active QF
	const onProjectsPageOrActiveQFPage = !isQF || (isQF && activeQFRound);

	/*
	 * This function will be called when the observed elements intersect with the viewport.
	 * Observed element is last project on the list that trigger another fetch projects to load.
	 */
	useEffect(() => {
		const handleObserver = (entities: any) => {
			if (!isInfiniteScrolling.current) return;
			const target = entities[0];
			if (target.isIntersecting) {
				loadMore();
			}
		};
		const option = {
			root: null,
			threshold: 1,
		};
		const observer = new IntersectionObserver(handleObserver, option);
		if (lastElementRef.current) {
			observer.observe(lastElementRef.current);
		}
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, [loadMore]);

	useEffect(() => {
		if (
			mainCategories.length > 0 &&
			!selectedMainCategory &&
			!isArchivedQF
		) {
			setIsNotFound(true);
		}
	}, [selectedMainCategory, mainCategories.length]);

	// Save last clicked project
	const handleProjectClick = (slug: string) => {
		localStorage.setItem('lastProjectClicked', slug);
	};

	// Handle last clicked project, if it exist scroll to that position
	useEffect(() => {
		if (!isFetching && !isFetchingNextPage) {
			const lastProjectClicked =
				localStorage.getItem('lastProjectClicked');
			if (lastProjectClicked) {
				window.scrollTo({
					top: document.getElementById(lastProjectClicked)?.offsetTop,
					behavior: 'smooth',
				});
				localStorage.removeItem('lastProjectClicked');
			}
		}
	}, [isFetching, isFetchingNextPage]);

	if (isNotFound)
		return <NotAvailable description='Oops! Page Not Found...' />;

	// Handle fetching errors from React Query
	if (isError) {
		showToastError(error);
		captureException(error, {
			tags: {
				section: 'fetchAllProjects',
			},
		});
	}

	return (
		<>
			{(isFetching || isFetchingNextPage) && (
				<Loading>
					<Spinner />
				</Loading>
			)}

			{isQF ? (
				<>
					<PassportBanner />
					{isArchivedQF ? (
						!isMobile && <ArchivedQFProjectsBanner />
					) : activeQFRound ? (
						<ActiveQFProjectsBanner />
					) : (
						<DefaultQFBanner />
					)}
				</>
			) : (
				<ProjectsBanner />
			)}
			<Wrapper>
				{isQF && <QFHeader />}
				{isArchivedQF ? (
					<ArchivedQFRoundStats />
				) : (
					<>
						{isQF && activeQFRound && <ActiveQFRoundStats />}
						{onProjectsPageOrActiveQFPage && <FilterContainer />}
					</>
				)}
				{onProjectsPageOrActiveQFPage && (
					<SortingContainer>
						<SortContainer totalCount={totalCount} />
					</SortingContainer>
				)}
				{isFetchingNextPage && <Loader className='dot-flashing' />}
				{filteredProjects?.length > 0 ? (
					<ProjectsWrapper>
						<ProjectsContainer>
							{isQF ? (
								<QFProjectsMiddleBanner />
							) : (
								<ProjectsMiddleBanner />
							)}
							{data?.pages.map((page, pageIndex) => (
								<Fragment key={pageIndex}>
									{page.data.map((project, idx) => (
										<div
											key={project.id}
											id={project.slug}
											onClick={() =>
												handleProjectClick(project.slug)
											}
										>
											<ProjectCard
												key={project.id}
												project={project}
												order={idx}
											/>
										</div>
									))}
								</Fragment>
							))}
						</ProjectsContainer>
						{/* <FloatingButtonReferral /> */}
					</ProjectsWrapper>
				) : isQF && !activeQFRound ? (
					<QFNoResultBanner />
				) : (
					<ProjectsNoResults />
				)}
				{totalCount > filteredProjects?.length && (
					<div ref={lastElementRef} />
				)}
				{showLoadMore && (
					<>
						<StyledButton
							onClick={loadMore}
							label={
								isFetchingNextPage
									? ''
									: formatMessage({
											id: 'component.button.load_more',
										})
							}
							icon={
								isFetchingNextPage && (
									<LoadingDotIcon>
										<div className='dot-flashing' />
									</LoadingDotIcon>
								)
							}
						/>
						<StyledButton
							onClick={handleCreateButton}
							label={formatMessage({
								id: 'component.button.create_project',
							})}
							$transparent
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

const StyledButton = styled(OutlineButton)<{ $transparent?: boolean }>`
	color: ${brandColors.pinky[500]};
	border-color: ${props =>
		props.$transparent ? 'transparent' : brandColors.pinky[500]};
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

export const ProjectsWrapper = styled.div`
	margin-bottom: 64px;
`;

export const ProjectsContainer = styled.div`
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

const Wrapper = styled(Container)`
	${mediaQueries.tablet} {
		padding-top: 33px;
		padding-bottom: 33px;
	}
	${mediaQueries.laptopS} {
		padding-top: 40px;
		padding-bottom: 40px;
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

const SortingContainer = styled.div`
	margin-bottom: 24px;
	padding: 0 23px;
	${mediaQueries.tablet} {
		padding: 0;
	}
`;

export default ProjectsIndex;
