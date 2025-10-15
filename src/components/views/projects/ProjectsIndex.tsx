// components/ProjectsIndex.tsx

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
	brandColors,
	Container,
	deviceSize,
	FlexCenter,
	mediaQueries,
	OutlineButton,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';
import { useInfiniteQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import ProjectCard from '@/components/project-card/ProjectCard';
import Routes from '@/lib/constants/Routes';
import { isUserRegistered, showToastError } from '@/lib/helpers';
import ProjectsNoResults from '@/components/views/projects/ProjectsNoResults';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';
import { useProjectsContext } from '@/context/projects.context';
import { ProjectsMiddleGivethVaultBanner } from './MiddleBanners/ProjectsMiddleGivethVaultBanner';
import { ActiveQFProjectsBanner } from './qfBanner/ActiveQFProjectsBanner';
import { PassportBanner } from '@/components/PassportBanner';
import { QFProjectsMiddleBanner } from './MiddleBanners/QFMiddleBanner';
import { QFNoResultBanner } from './MiddleBanners/QFNoResultBanner';
import { Spinner } from '@/components/Spinner';
import { FilterContainer } from './filter/FilterContainer';
import { SortContainer } from './sort/SortContainer';
import { ArchivedQFRoundStats } from './ArchivedQFRoundStats';
import { ArchivedQFProjectsBanner } from './qfBanner/ArchivedQFProjectsBanner';
import { ActiveQFRoundStats } from './ActiveQFRoundStats';
import useMediaQuery from '@/hooks/useMediaQuery';
import { fetchProjects, IQueries } from './services';
import { IProject, IQFRound } from '@/apollo/types/types';
import { LAST_PROJECT_CLICKED } from './constants';
import { hasRoundStarted } from '@/helpers/qf';
import config from '@/configuration';
import { EProjectType } from '@/apollo/types/gqlEnums';
import { ProjectsBanner } from '@/components/views/projects/ProjectsBanner';

export interface IProjectsView {
	projects: IProject[];
	totalCount: number;
	qfRound?: IQFRound;
}

const ProjectsIndex = (props: IProjectsView) => {
	const { formatMessage } = useIntl();
	const { projects, totalCount: _totalCount, qfRound } = props;
	const user = useAppSelector(state => state.user.userData);
	const { mainCategories } = useAppSelector(state => state.general);

	// Check if the round is started
	const [activeQFRound, setActiveQFRound] = useState<IQFRound | undefined>(
		qfRound,
	);
	const [activeRoundStarted, setActiveRoundStarted] = useState(
		qfRound ? hasRoundStarted(qfRound) && qfRound.isActive : false,
	);

	useEffect(() => {
		if (qfRound) {
			setActiveQFRound(qfRound);
			setActiveRoundStarted(hasRoundStarted(qfRound) && qfRound.isActive);
		} else {
			setActiveQFRound(undefined);
			setActiveRoundStarted(false);
		}
	}, [qfRound]);

	const isMobile = useMediaQuery(`(max-width: ${deviceSize.tablet - 1}px)`);
	const dispatch = useAppDispatch();
	const {
		variables: contextVariables,
		selectedMainCategory,
		isQF,
		isArchivedQF,
	} = useProjectsContext();

	const router = useRouter();
	const PAGE_SIZE = 15;
	const lastElementRef = useRef<HTMLDivElement>(null);
	const isInfiniteScrolling = useRef(true);

	// Define the fetch function for React Query
	const fetchProjectsPage = async ({ pageParam = 0 }) => {
		// Fetch all projects and causes if qf round page or search page
		const projectType =
			router.pathname === '/qf/[slug]' ||
			(typeof router.query.searchTerm === 'string' &&
				router.query.searchTerm.trim() !== '')
				? EProjectType.ALL
				: EProjectType.PROJECT;
		const variables: IQueries = {
			limit: PAGE_SIZE,
			skip: PAGE_SIZE * pageParam,
			projectType,
		};

		if (user?.id) {
			variables.connectedWalletUserId = Number(user.id);
		}

		if (isQF && qfRound) {
			variables.qfRoundId = Number(qfRound.id);
		}

		return await fetchProjects(
			pageParam,
			variables,
			contextVariables,
			isArchivedQF,
			selectedMainCategory,
			router.query.slug,
			isQF ? Number(qfRound?.id) || 0 : undefined, 
		);
	};

	// Use the useInfiniteQuery hook with the new v5 API
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isError,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: [
			'projects',
			contextVariables,
			isArchivedQF,
			selectedMainCategory,
			isQF,
			qfRound?.id,
			router.query.slug,
			,
			PAGE_SIZE,
		],
		queryFn: fetchProjectsPage,
		getNextPageParam: lastPage => lastPage.nextCursor,
		getPreviousPageParam: firstPage => firstPage.previousCursor,
		initialPageParam: 0,
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		initialData:
			projects && projects.length > 0
				? {
						pageParams: [0],
						pages: [
							{
								data: projects,
								totalCount: _totalCount,
								nextCursor:
									_totalCount > projects.length
										? 1
										: undefined, // <-- only if more pages exist
								previousCursor: undefined,
							},
						],
					}
				: undefined,
	});

	// Function to load more data when scrolling
	const loadMore = useCallback(() => {
		if (hasNextPage) {
			fetchNextPage();
		}
	}, [fetchNextPage, hasNextPage]);

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			dispatch(setShowCompleteProfile(true));
		}
	};

	useEffect(() => {
		const handleObserver = (entries: IntersectionObserverEntry[]) => {
			if (!isInfiniteScrolling.current) return;
			const target = entries[0];
			if (target.isIntersecting) {
				loadMore();
			}
		};
		const option = {
			root: null,
			threshold: 1.0,
		};
		const observer = new IntersectionObserver(handleObserver, option);
		if (lastElementRef.current) {
			observer.observe(lastElementRef.current);
		}
		return () => {
			if (observer && lastElementRef.current) {
				observer.unobserve(lastElementRef.current);
			}
		};
	}, [loadMore]);

	useEffect(() => {
		if (
			mainCategories.length > 0 &&
			!selectedMainCategory &&
			!isArchivedQF &&
			!isQF
		) {
			isInfiniteScrolling.current = false;
		} else {
			isInfiniteScrolling.current = true;
		}
	}, [selectedMainCategory, mainCategories.length, isArchivedQF, isQF]);

	// Save last clicked project
	const handleProjectClick = (slug: string) => {
		sessionStorage.setItem(LAST_PROJECT_CLICKED, slug);
	};

	const isStellarOnlyQF =
		activeRoundStarted &&
		activeQFRound?.eligibleNetworks?.length === 1 &&
		activeQFRound?.eligibleNetworks?.includes(
			config.STELLAR_NETWORK_NUMBER,
		);

	// Scroll to last clicked project
	useEffect(() => {
		if (!isFetching && !isFetchingNextPage) {
			const lastProjectClicked =
				sessionStorage.getItem(LAST_PROJECT_CLICKED);
			if (lastProjectClicked) {
				const element = document.getElementById(lastProjectClicked);
				if (element) {
					window.scrollTo({
						top: element.offsetTop,
						behavior: 'smooth',
					});
				}
				sessionStorage.removeItem(LAST_PROJECT_CLICKED);
			}
		}
	}, [isFetching, isFetchingNextPage]);

	// Handle errors
	useEffect(() => {
		if (isError && error) {
			showToastError(error);
			captureException(error, {
				tags: {
					section: 'fetchAllProjects',
				},
			});
		}
	}, [isError, error]);

	const totalCount = data?.pages[data.pages.length - 1].totalCount || 0;

	return (
		<>
			{(isFetching || isFetchingNextPage) && (
				<Loading>
					<Spinner />
				</Loading>
			)}
			{isQF &&
				qfRound &&
				qfRound.isActive &&
				!isStellarOnlyQF &&
				!isArchivedQF &&
				activeRoundStarted && <PassportBanner />}
			<Wrapper>
				{qfRound && qfRound.isActive && !isArchivedQF && (
					<>
						<ActiveQFProjectsBanner qfRound={qfRound} />
						<ActiveQFRoundStats qfRound={qfRound} />
					</>
				)}
				{!qfRound && !isArchivedQF && (
					<>
						<ProjectsBanner />
						<FilterContainer />
					</>
				)}
				{qfRound && (!qfRound.isActive || isArchivedQF) && (
					<>
						<ArchivedQFProjectsBanner />
						<ArchivedQFRoundStats />
					</>
				)}
				<SortingContainer>
					<SortContainer totalCount={totalCount} />
				</SortingContainer>
				{isFetchingNextPage && <Loader className='dot-flashing' />}
				{data?.pages.some(page => page.data.length > 0) ? (
					<ProjectsWrapper>
						<ProjectsContainer>
							{isQF && qfRound ? (
								<QFProjectsMiddleBanner qfRound={qfRound} />
							) : (
								<ProjectsMiddleGivethVaultBanner />
							)}
							{data.pages.map((page, pageIndex) => (
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
												project={project}
												order={idx}
												providedQFRoundId={Number(
													qfRound?.id,
												)}
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
				{hasNextPage && <div ref={lastElementRef} />}

				{/* Show manual Load More button ONLY on non-QF pages */}
				{!isQF && !isFetching && !isFetchingNextPage && hasNextPage && (
					<>
						<StyledButton
							onClick={() => fetchNextPage()}
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

	justify-content: stretch;
	align-items: stretch;
	justify-items: stretch;

	grid-template-columns: repeat(1, minmax(310px, 1fr));

	${mediaQueries.tablet} {
		padding: 0;
		grid-template-columns: repeat(2, minmax(310px, 1fr));
	}

	${mediaQueries.laptopL} {
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
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
