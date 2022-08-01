import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import {
	brandColors,
	neutralColors,
	OulineButton,
	IconSearch,
	IconOptions16,
	IconDots,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { captureException } from '@sentry/nextjs';
import ProjectCard from '@/components/project-card/ProjectCard';
import Routes from '@/lib/constants/Routes';
import { isUserRegistered, showToastError } from '@/lib/helpers';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { IMainCategory, IProject } from '@/apollo/types/types';
import { IFetchAllProjects } from '@/apollo/types/gqlTypes';
import ProjectsNoResults from '@/components/views/projects/ProjectsNoResults';
import { device, deviceSize, mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';
import ProjectsBanner from './ProjectsBanner';
import ProjectsMainCategories from './ProjectsMainCategories';
import { Shadow } from '@/components/styled-components/Shadow';
import useMediaQuery from '@/hooks/useMediaQuery';
import ProjectsSubCategories from './ProjectsSubCategories';
import { useProjectsContext } from '@/context/projects.context';
import { Flex } from '@/components/styled-components/Flex';
import { FilterMenu, PinkyColoredNumber } from '@/components/menu/FilterMenu';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import type { IProjectsRouteProps } from 'pages/projects';

export interface IProjectsView extends IProjectsRouteProps {
	selectedMainCategory?: IMainCategory;
}

interface IQueries {
	skip?: number;
	take?: number;
	connectedWalletUserId?: number;
}

const ProjectsIndex = (props: IProjectsView) => {
	const {
		projects,
		selectedMainCategory,
		totalCount: _totalCount,
		categories,
	} = props;
	const user = useAppSelector(state => state.user.userData);
	const [isLoading, setIsLoading] = useState(false);
	const [filteredProjects, setFilteredProjects] =
		useState<IProject[]>(projects);
	const [totalCount, setTotalCount] = useState(_totalCount);
	const [isTabletShowingSearchAndFilter, setIsTabletShowingSearchAndFilter] =
		useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	//Slider next and prev button refs
	const navigationPrevRef = useRef<HTMLButtonElement>(null);
	const navigationNextRef = useRef<HTMLButtonElement>(null);
	const filterMenuRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(filterMenuRef, () => setIsFilterOpen(false));

	const dispatch = useAppDispatch();
	const { variables: contextVariables, setVariables } = useProjectsContext();

	const router = useRouter();
	const pageNum = useRef(0);
	const isDesktop = useMediaQuery(device.laptopS);
	const isTablet = useMediaQuery(
		`(min-device-width: ${deviceSize.tablet}px) and (max-device-width: ${
			deviceSize.laptopS - 1
		}px)`,
	);

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

	const handleFilterClose = (e: MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setIsFilterOpen(false);
	};

	useEffect(() => {
		fetchProjects(false, 0, true);
	}, [user?.id]);

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
		contextVariables?.filters,
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
					<FiltersSection>
						{isTabletShowingSearchAndFilter && isTablet ? null : (
							<FiltersSwiper>
								<PrevIcon ref={navigationPrevRef}>
									<img
										src={'/images/caret_right.svg'}
										alt='caret right'
									/>
								</PrevIcon>
								<ProjectsMainCategories
									mainCategories={props.mainCategories}
									navigationNextRef={navigationNextRef}
									navigationPrevRef={navigationPrevRef}
								/>
								<NextIcon ref={navigationNextRef}>
									<img
										src={'/images/caret_right.svg'}
										alt='caret right'
									/>
								</NextIcon>
							</FiltersSwiper>
						)}
						{isDesktop && (
							<FilterAndSearchContainer>
								<IconContainer>
									<IconSearch />
								</IconContainer>
								<FiltersButton
									onClick={() => setIsFilterOpen(true)}
								>
									Filters
									{contextVariables.filtersCount !== 0 && (
										<PinkyColoredNumber>
											{contextVariables.filtersCount}
										</PinkyColoredNumber>
									)}
									<IconOptions16 />
								</FiltersButton>
								{isFilterOpen && (
									<FilterMenu
										handleClose={handleFilterClose}
										ref={filterMenuRef}
									/>
								)}
							</FilterAndSearchContainer>
						)}
						{isTablet && (
							<>
								{isTabletShowingSearchAndFilter ? (
									<TabletFilterAndSearchContainer
										justifyContent='space-between'
										alignItems='center'
										gap='16px'
									>
										<input
											style={{
												flexGrow: 1,
											}}
										/>
										<FiltersButton
											onClick={e => {
												setIsFilterOpen(true);
											}}
										>
											Filters
											{contextVariables.filtersCount !==
												0 && (
												<PinkyColoredNumber>
													{
														contextVariables.filtersCount
													}
												</PinkyColoredNumber>
											)}
											<IconOptions16 />
										</FiltersButton>
										{isFilterOpen && (
											<FilterMenu
												handleClose={handleFilterClose}
												ref={filterMenuRef}
											/>
										)}
										<IconContainer
											onClick={() =>
												setIsTabletShowingSearchAndFilter(
													false,
												)
											}
										>
											X
										</IconContainer>
									</TabletFilterAndSearchContainer>
								) : (
									<IconContainer
										onClick={() =>
											setIsTabletShowingSearchAndFilter(
												true,
											)
										}
									>
										<IconDots />
									</IconContainer>
								)}
							</>
						)}
					</FiltersSection>
					{props.selectedMainCategory?.categories && (
						<>
							<StyledLine />
							<ProjectsSubCategories
								subCategories={
									props.selectedMainCategory?.categories ?? []
								}
							/>
						</>
					)}
					{!isDesktop && !isTablet && (
						<Flex alignItems='center' gap='16px'>
							<input
								style={{
									flexGrow: 1,
								}}
							/>
							<FiltersButton
								onClick={e => {
									setIsFilterOpen(true);
								}}
							>
								Filters
								{contextVariables.filtersCount !== 0 && (
									<PinkyColoredNumber>
										{contextVariables.filtersCount}
									</PinkyColoredNumber>
								)}
								<IconOptions16 />
							</FiltersButton>
							{isFilterOpen && (
								<FilterMenu
									handleClose={handleFilterClose}
									ref={filterMenuRef}
								/>
							)}
						</Flex>
					)}
				</FiltersContainer>

				{isLoading && <Loader className='dot-flashing' />}

				{filteredProjects?.length > 0 ? (
					<ProjectsContainer>
						{filteredProjects.map(project => (
							<ProjectCard key={project.id} project={project} />
						))}
					</ProjectsContainer>
				) : (
					<ProjectsNoResults mainCategories={props.mainCategories} />
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

const FiltersSection = styled.div`
	display: flex;
	gap: 16px;
	align-items: center;
	position: relative;
	color: ${neutralColors.gray[900]};
	justify-content: space-between;
	flex-wrap: nowrap;
`;

export const ProjectsContainer = styled.div`
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

const FilterAndSearchContainer = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	gap: 16px;
`;

const FiltersButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	border-radius: 50px;
	padding: 16px;
	background: white;
	box-shadow: ${Shadow.Neutral[500]};
	border: 1px solid ${neutralColors.gray[400]};
	font-weight: 700;
	text-transform: uppercase;
	cursor: pointer;
	user-select: none;
`;

const FiltersSwiper = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	gap: 16px;
	width: 100%;
	${mediaQueries.tablet} {
		max-width: 90%;
	}
	${mediaQueries.laptopS} {
		padding-right: 60px;
		width: 70%;
	}
`;

const IconContainer = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	width: fit-content;
	height: fit-content;
	min-width: 42px;
	min-height: 42px;
	border-radius: 50%;
	background: ${neutralColors.gray[100]};
	box-shadow: ${Shadow.Neutral[500]};
	cursor: pointer;
	border: 1px solid ${neutralColors.gray[400]};
`;

const NextIcon = styled(IconContainer)`
	z-index: 1;
	display: none;
	:disabled {
		opacity: 0.5;
		cursor: default;
	}
	${mediaQueries.tablet} {
		display: inline-block;
	}
	${mediaQueries.laptopS} {
		width: 50px;
		height: 50px;
		position: absolute;
		top: calc(50% - 25px);
		right: 0;
		:disabled {
			display: none;
		}
	}
`;

const PrevIcon = styled(NextIcon)<{ disabled?: boolean }>`
	-ms-transform: rotate(180deg);
	transform: rotate(180deg);
	left: 0;
	z-index: 2;
	${mediaQueries.laptopS} {
		:disabled {
			display: none;
		}
	}
`;

const StyledLine = styled.hr`
	width: 100%;
	border: 1px solid ${neutralColors.gray[200]};
`;

const TabletFilterAndSearchContainer = styled(Flex)`
	flex-grow: 1;
`;

export default ProjectsIndex;
