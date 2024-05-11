import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
	brandColors,
	OutlineButton,
	FlexCenter,
	Container,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';

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

export interface IProjectsView {
	projects: IProject[];
	totalCount: number;
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
	const isMobile = useMediaQuery(`(max-width: ${deviceSize.tablet - 1}px)`);

	const dispatch = useAppDispatch();

	const {
		variables: contextVariables,
		mainCategories,
		selectedMainCategory,
		isQF,
		isArchivedQF,
		qfRounds,
	} = useProjectsContext();

	const router = useRouter();
	const pageNum = useRef(0);
	const lastElementRef = useRef<HTMLDivElement>(null);
	const isInfiniteScrolling = useRef(true);

	router?.events?.on('routeChangeStart', () => setIsLoading(true));

	const fetchProjects = useCallback(
		(isLoadMore?: boolean, loadNum?: number, userIdChanged = false) => {
			const variables: IQueries = {
				limit: userIdChanged
					? filteredProjects.length > 50
						? BACKEND_QUERY_LIMIT
						: filteredProjects.length
					: projects.length,
				skip: userIdChanged ? 0 : projects.length * (loadNum || 0),
			};

			if (user?.id) {
				variables.connectedWalletUserId = Number(user?.id);
			}

			setIsLoading(true);
			if (
				contextVariables.mainCategory !== router.query?.slug?.toString()
			)
				return;

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
					fetchPolicy: 'network-only',
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

	useEffect(() => {
		pageNum.current = 0;
		fetchProjects(false, 0, true);
	}, [user?.id]);

	useEffect(() => {
		pageNum.current = 0;
		fetchProjects(false, 0);
	}, [contextVariables]);

	const loadMore = useCallback(() => {
		if (isLoading) return;
		fetchProjects(true, pageNum.current + 1);
		pageNum.current = pageNum.current + 1;
	}, [fetchProjects, isLoading]);

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			dispatch(setShowCompleteProfile(true));
		}
	};

	const showLoadMore =
		totalCount > filteredProjects?.length && !isInfiniteScrolling.current;

	const activeRound = qfRounds.find(round => round.isActive);

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
					) : (
						<ActiveQFProjectsBanner />
					)}
				</>
			) : (
				<ProjectsBanner mainCategory={selectedMainCategory} />
			)}
			<Wrapper>
				{isQF ? (
					isArchivedQF ? (
						<ArchivedQFRoundStats />
					) : (
						<>
							<ActiveQFRoundStats />
							<FilterContainer />
						</>
					)
				) : null}
				<SortingContainer>
					<SortContainer totalCount={totalCount} />
				</SortingContainer>
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
				) : isQF && !activeRound ? (
					<QFNoResultBanner />
				) : (
					<ProjectsNoResults mainCategories={mainCategories} />
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
