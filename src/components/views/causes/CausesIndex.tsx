// components/CausesIndex.tsx

import { Fragment, useCallback, useEffect, useRef } from 'react';
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
import CausesNoResults from '@/components/views/causes/CausesNoResults';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';
import { CausesBanner } from '@/components/views/causes/CausesBanner';
import { CausesMiddleGivethVaultBanner } from '@/components/views/causes/MiddleBanners/CausesMiddleGivethVaultBanner';
import { CauseActiveQFBanner } from '@/components/views/causes/qfBanner/CauseActiveQFBanner';
import { PassportBanner } from '@/components/PassportBanner';
import { CauseQFMiddleBanner } from '@/components/views/causes/MiddleBanners/CauseQFMiddleBanner';
import { QFNoResultBanner } from '@/components/views/projects/MiddleBanners/QFNoResultBanner';
import { Spinner } from '@/components/Spinner';
import { CausesFilterContainer } from '@/components/views/causes/filter/CausesFilterContainer';
import { SortContainer } from '@/components/views/projects/sort/SortContainer';
import { ArchivedQFRoundStats } from '@/components/views/projects/ArchivedQFRoundStats';
import { ActiveQFRoundStats } from '@/components/views/projects/ActiveQFRoundStats';
import useMediaQuery from '@/hooks/useMediaQuery';
import { DefaultQFBanner } from '@/components/DefaultQFBanner';
import { fetchCauses, IQueries } from '@/components/views/causes/services';
import { ICause } from '@/apollo/types/types';
import { LAST_CAUSE_CLICKED } from '@/components/views/causes/constants';
import { hasRoundStarted } from '@/helpers/qf';
import config from '@/configuration';
import { useCausesContext } from '@/context/causes.context';
import { CausesArchivedQFBanner } from './qfBanner/CausesArchivedQFBanner';
import { EProjectType } from '@/apollo/types/gqlEnums';

export interface ICausesView {
	causes: ICause[];
	totalCount: number;
}

const CausesIndex = (props: ICausesView) => {
	const { formatMessage } = useIntl();
	const { causes, totalCount: _totalCount } = props;
	const user = useAppSelector(state => state.user.userData);
	const { activeQFRound, mainCategories } = useAppSelector(
		state => state.general,
	);
	const isMobile = useMediaQuery(`(max-width: ${deviceSize.tablet - 1}px)`);
	const dispatch = useAppDispatch();
	const {
		variables: contextVariables,
		selectedMainCategory,
		isQF,
		isArchivedQF,
	} = useCausesContext();

	const activeRoundStarted = hasRoundStarted(activeQFRound);

	const router = useRouter();
	const lastElementRef = useRef<HTMLDivElement>(null);
	const isInfiniteScrolling = useRef(true);

	// Define the fetch function for React Query
	const fetchProjectsPage = async ({ pageParam = 0 }) => {
		const variables: IQueries = {
			limit: 20, // Adjust the limit as needed
			skip: 20 * pageParam,
			projectType: EProjectType.CAUSE,
		};

		if (user?.id) {
			variables.connectedWalletUserId = Number(user.id);
		}

		return await fetchCauses(
			pageParam,
			variables,
			contextVariables,
			isArchivedQF,
			selectedMainCategory,
			router.query.slug,
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
			'causes',
			contextVariables,
			isArchivedQF,
			selectedMainCategory,
		],
		queryFn: fetchProjectsPage,
		getNextPageParam: lastPage => lastPage.nextCursor,
		getPreviousPageParam: firstPage => firstPage.previousCursor,
		initialPageParam: 0,
		// placeholderData: keepPreviousData,
		placeholderData: {
			pageParams: [0],
			pages: [{ data: causes, totalCount: _totalCount }],
		},
	});

	console.log('DATA FETCHED', data);

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

	const onProjectsPageOrActiveQFPage = !isQF || (isQF && activeQFRound);

	// Intersection Observer for infinite scrolling
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
			!isArchivedQF
		) {
			isInfiniteScrolling.current = false;
		} else {
			isInfiniteScrolling.current = true;
		}
	}, [selectedMainCategory, mainCategories.length, isArchivedQF]);

	// Save last clicked project
	const handleProjectClick = (slug: string) => {
		sessionStorage.setItem(LAST_CAUSE_CLICKED, slug);
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
				sessionStorage.getItem(LAST_CAUSE_CLICKED);
			if (lastProjectClicked) {
				const element = document.getElementById(lastProjectClicked);
				if (element) {
					window.scrollTo({
						top: element.offsetTop,
						behavior: 'smooth',
					});
				}
				sessionStorage.removeItem(LAST_CAUSE_CLICKED);
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
			{isQF && !isStellarOnlyQF && <PassportBanner />}
			<Wrapper>
				{isQF && !isArchivedQF && (
					<>
						{activeQFRound ? (
							<CauseActiveQFBanner />
						) : (
							<DefaultQFBanner />
						)}
					</>
				)}
				{isArchivedQF && !isMobile && <CausesArchivedQFBanner />}
				{isArchivedQF ? (
					<ArchivedQFRoundStats />
				) : (
					<>
						{!isQF && <CausesBanner />}
						{onProjectsPageOrActiveQFPage && (
							<CausesFilterContainer />
						)}
						{isQF && activeQFRound && <ActiveQFRoundStats />}
					</>
				)}
				{onProjectsPageOrActiveQFPage && (
					<SortingContainer>
						<SortContainer totalCount={totalCount} />
					</SortingContainer>
				)}
				{isFetchingNextPage && <Loader className='dot-flashing' />}
				{data?.pages.some(page => page.data.length > 0) ? (
					<ProjectsWrapper>
						<ProjectsContainer>
							{isQF ? (
								<CauseQFMiddleBanner />
							) : (
								<CausesMiddleGivethVaultBanner />
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
					<CausesNoResults />
				)}
				{hasNextPage && <div ref={lastElementRef} />}
				{!isFetching && !isFetchingNextPage && hasNextPage && (
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

export default CausesIndex;
