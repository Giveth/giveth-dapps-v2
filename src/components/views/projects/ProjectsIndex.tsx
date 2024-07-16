import { useCallback, useEffect, useRef, useState } from 'react';
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

import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import ProjectCard from '@/components/project-card/ProjectCard';
import Routes from '@/lib/constants/Routes';
import { isUserRegistered, showToastError } from '@/lib/helpers';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { IProject } from '@/apollo/types/types';
import { IFetchAllProjects } from '@/apollo/types/gqlTypes';
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

interface FetchProjectsResponse {
	data: IProject[];
	totalCount: number;
	lastPage: number;
}

// interface FetchProjectsParams {
// 	queryKey: [
// 		string,
// 		{
// 			isLoadMore: boolean;
// 			loadNum: number;
// 			userIdChanged: boolean;
// 		},
// 	];
// 	pageParam?: number;
// }

const ProjectsIndex = (props: IProjectsView) => {
	const { formatMessage } = useIntl();
	const { projects, totalCount: _totalCount } = props;
	const user = useAppSelector(state => state.user.userData);
	const { activeQFRound, mainCategories } = useAppSelector(
		state => state.general,
	);
	const [isLoading, setIsLoading] = useState(false);
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
	const pageNum = useRef(0);
	const lastElementRef = useRef<HTMLDivElement>(null);
	const isInfiniteScrolling = useRef(true);

	router?.events?.on('routeChangeStart', () => setIsLoading(true));

	// Default values for queryKey
	const [isLoadMore, setIsLoadMore] = useState(false);
	const [loadNum, setLoadNum] = useState(0);
	const [userIdChanged, setUserIdChanged] = useState(false);

	const fetchProjects = useCallback(
		async (pageParam: number | unknown): Promise<FetchProjectsResponse> => {
			const currentPage = pageParam === undefined ? pageParam : 0;

			console.log({ currentPage });

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

			setIsLoading(true);
			if (
				contextVariables.mainCategory !== router.query?.slug?.toString()
			) {
				return { data: [], totalCount: 0, lastPage: 0 };
			}

			client
				.query({
					query: FETCH_ALL_PROJECTS,
					variables: {
						...variables,
						...contextVariables,
						mainCategory: isArchivedQF
							? undefined
							: getMainCategorySlug(selectedMainCategory),
						qfRoundSlug: isArchivedQF ? router.query.slug : null,
					},
				})
				.then((res: { data: { allProjects: IFetchAllProjects } }) => {
					const data = res.data?.allProjects?.projects;
					const count = res.data?.allProjects?.totalCount;
					setTotalCount(count);

					setFilteredProjects(prevProjects => {
						isInfiniteScrolling.current =
							(data.length + prevProjects.length) % 45 !== 0;
						return isLoadMore ? [...prevProjects, ...data] : data;
					});
					setIsLoading(false);

					const result = {
						data: data,
						lastPage: currentPage,
						totalCount: count,
					};

					console.log('fetchProjects result', result);
					return result;
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

			return { data: [], totalCount: 0, lastPage: 0 };
		},
		[
			contextVariables,
			filteredProjects.length,
			isArchivedQF,
			projects.length,
			router.query.slug,
			selectedMainCategory,
			user?.id,
		],
	);

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isError,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery<FetchProjectsResponse, Error>({
		queryKey: ['projects'],
		queryFn: ({ pageParam = 0 }: QueryFunctionContext) =>
			fetchProjects(pageParam),
		// queryFn: ({ pageParam }) => fetchProjects(pageParam),
		// queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
		// 	fetchProjects(pageParam),

		// getNextPageParam: lastPage => lastPage?.nextPage,
		// getNextPageParam: (lastPage, pages: FetchProjectsResponse[]) => {
		// 	console.log('getNextPageParam called', pages);
		// 	// return lastPage?.nextPage ?? false;
		// 	return lastPage.nextPage + 1;
		// },
		// getNextPageParam: (returnedData: FetchProjectsResponse) => {
		getNextPageParam: (lastPage, allPages, lastPageParam) => {
			console.log('getNextPageParam called', lastPage);
			console.log('getNextPageParam called', allPages);
			console.log('getNextPageParam called', allPages);
			console.log('getNextPageParam zadnja stranica', lastPage.lastPage);
			return lastPage.lastPage + 1;
		},
		initialPageParam: 0,
	});

	useEffect(() => {
		if (data) {
			console.log('Data from React Query:', data);
		}
		if (hasNextPage !== undefined) {
			console.log('Has Next Page:', hasNextPage);
		}
		if (isFetchingNextPage !== undefined) {
			console.log('Is Fetching Next Page:', isFetchingNextPage);
		}
	}, [data, hasNextPage, isFetchingNextPage]);

	// useEffect(() => {
	// 	pageNum.current = 0;
	// 	fetchProjects(false, 0, true);
	// }, [user?.id]);

	// useEffect(() => {
	// 	pageNum.current = 0;
	// 	fetchProjects(false, 0);
	// }, [contextVariables]);

	const loadMore = useCallback(() => {
		// if (isLoading) return;
		// fetchProjects(true, pageNum.current + 1);
		// pageNum.current = pageNum.current + 1;
		console.log('LOAD MORE');
		fetchNextPage();
		// }, [fetchProjects, isLoading]);
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

	const onProjectsPageOrActiveQFPage = !isQF || (isQF && activeQFRound);

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

	if (isNotFound)
		return <NotAvailable description='Oops! Page Not Found...' />;

	return (
		<>
			{isLoading && (
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
				{isLoading && <Loader className='dot-flashing' />}
				{filteredProjects?.length > 0 ? (
					<ProjectsWrapper>
						<ProjectsContainer>
							{isQF ? (
								<QFProjectsMiddleBanner />
							) : (
								<ProjectsMiddleBanner />
							)}
							{filteredProjects.map((project, idx) => (
								<ProjectCard
									key={project.id}
									project={project}
									order={idx}
								/>
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
								isLoading
									? ''
									: formatMessage({
											id: 'component.button.load_more',
										})
							}
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
