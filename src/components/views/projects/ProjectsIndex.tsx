import { useEffect, useRef, useState } from 'react';
import Debounced from 'lodash.debounce';
import { useRouter } from 'next/router';
import {
	brandColors,
	neutralColors,
	H3,
	OulineButton,
	Lead,
	IconSearch,
	IconOptions16,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { captureException } from '@sentry/nextjs';
import { BigArc } from '@/components/styled-components/Arc';
import ProjectCard from '@/components/project-card/ProjectCard';
import Routes from '@/lib/constants/Routes';
import {
	capitalizeFirstLetter,
	isUserRegistered,
	showToastError,
} from '@/lib/helpers';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { ICategory, IMainCategory, IProject } from '@/apollo/types/types';
import { IFetchAllProjects } from '@/apollo/types/gqlTypes';
import { EDirection, gqlEnums } from '@/apollo/types/gqlEnums';
import ProjectsNoResults from '@/components/views/projects/ProjectsNoResults';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';
import ProjectsBanner from './ProjectsBanner';
import ProjectsFilter from './ProjectsFilter';
import { Shadow } from '@/components/styled-components/Shadow';
import type { IProjectsRouteProps } from 'pages/projects';

export interface IProjectsView extends IProjectsRouteProps {
	selectedMainCategory?: IMainCategory;
}

interface ISelectObj {
	value: string;
	label: string;
	direction?: string;
}

interface IQueries {
	orderBy: { field: string; direction: string };
	skip?: number;
	limit?: number;
	category?: string;
	searchTerm?: string;
	connectedWalletUserId?: number;
}

const allCategoryObj = { value: 'All', label: 'All' };
const sortByObj = [
	{ label: 'Default', value: gqlEnums.QUALITYSCORE },
	{ label: 'Amount Raised', value: gqlEnums.DONATIONS },
	{ label: 'Accepts GIV Token', value: gqlEnums.ACCEPTGIV },
	{ label: 'Hearts', value: gqlEnums.HEARTS },
	{ label: 'Newest', value: gqlEnums.CREATIONDATE },
	{
		label: 'Oldest',
		value: gqlEnums.CREATIONDATE,
		direction: EDirection.ASC,
	},
	{ label: 'Verified', value: gqlEnums.VERIFIED },
	{ label: 'Traceable', value: gqlEnums.TRACEABLE },
];

const buildCategoryObj = (array: ICategory[]) => {
	const newArray = [allCategoryObj];
	array.forEach(e => {
		const obj: ISelectObj = {
			label: capitalizeFirstLetter(e.name),
			value: e.name,
		};
		newArray.push(obj);
	});
	return newArray;
};

const ProjectsIndex = (props: IProjectsView) => {
	const {
		projects,
		selectedMainCategory,
		totalCount: _totalCount,
		categories,
	} = props;
	const user = useAppSelector(state => state.user.userData);
	console.log('Props', props);
	const [categoriesObj, setCategoriesObj] = useState<ISelectObj[]>();
	const [selectedCategory, setSelectedCategory] =
		useState<ISelectObj>(allCategoryObj);
	const [isLoading, setIsLoading] = useState(false);
	const [filteredProjects, setFilteredProjects] =
		useState<IProject[]>(projects);
	const [sortBy, setSortBy] = useState<ISelectObj>(sortByObj[0]);
	const [search, setSearch] = useState<string>('');
	const [searchValue, setSearchValue] = useState<string>('');
	const [totalCount, setTotalCount] = useState(_totalCount);
	//Slider next and prev button refs
	const navigationPrevRef = useRef<HTMLButtonElement>(null);
	const navigationNextRef = useRef<HTMLButtonElement>(null);

	const dispatch = useAppDispatch();
	const router = useRouter();
	const isFirstRender = useRef(true);
	const debouncedSearch = useRef<any>();
	const pageNum = useRef(0);

	useEffect(() => {
		setCategoriesObj(buildCategoryObj(categories));
		debouncedSearch.current = Debounced(setSearch, 1000);
	}, []);

	useEffect(() => {
		if (!isFirstRender.current) fetchProjects();
		else isFirstRender.current = false;
	}, [selectedCategory.value, sortBy.label, search]);

	const fetchProjects = (
		isLoadMore?: boolean,
		loadNum?: number,
		userIdChanged = false,
	) => {
		const categoryQuery = selectedCategory.value;

		const variables: IQueries = {
			orderBy: { field: sortBy.value, direction: EDirection.DESC },
			limit: userIdChanged ? filteredProjects.length : projects.length,
			skip: userIdChanged ? 0 : projects.length * (loadNum || 0),
		};

		if (user?.id) {
			variables.connectedWalletUserId = Number(user?.id);
		}

		if (sortBy.direction) variables.orderBy.direction = sortBy.direction;
		if (categoryQuery && categoryQuery !== 'All')
			variables.category = categoryQuery;
		if (search) variables.searchTerm = search;

		if (!userIdChanged) setIsLoading(true);

		client
			.query({
				query: FETCH_ALL_PROJECTS,
				variables,
				fetchPolicy: 'network-only',
			})
			.then((res: { data: { projects: IFetchAllProjects } }) => {
				const data = res.data?.projects?.projects;
				const count = res.data?.projects?.totalCount;
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

	const handleChange = (type: string, input: any) => {
		pageNum.current = 0;
		if (type === 'search') {
			setSearchValue(input);
			debouncedSearch.current(input);
		} else if (type === 'sortBy') setSortBy(input);
		else if (type === 'category') setSelectedCategory(input);
	};

	const clearSearch = () => {
		setSearch('');
		setSearchValue('');
	};

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

	const showLoadMore = totalCount > filteredProjects.length;

	return (
		<>
			{selectedMainCategory && (
				<ProjectsBanner mainCategory={selectedMainCategory} />
			)}
			<BigArc />
			<Wrapper>
				<Title weight={700}>Projects</Title>
				<Subtitle>
					Support for-good projects, nonprofits & charities with
					crypto donations. Give directly with zero added fees. Get
					rewarded when you donate to verified projects!
				</Subtitle>

				<FiltersSection>
					<FiltersSwiper>
						<PrevIcon ref={navigationPrevRef}>
							<img
								src={'/images/caret_right.svg'}
								alt='caret right'
							/>
						</PrevIcon>
						<ProjectsFilter
							projectsProps={props}
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
					<FilterAndSearchContainer>
						<SearchButton>
							<IconSearch />
						</SearchButton>
						<FiltersButton>
							Filters
							<IconOptions16 />
						</FiltersButton>
					</FilterAndSearchContainer>
				</FiltersSection>

				{isLoading && <Loader className='dot-flashing' />}

				{filteredProjects.length > 0 ? (
					<ProjectsContainer>
						{filteredProjects.map(project => (
							<ProjectCard key={project.id} project={project} />
						))}
					</ProjectsContainer>
				) : (
					<ProjectsNoResults trySearch={clearSearch} />
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
const FiltersSection = styled.div`
	padding: 32px 21px;
	background: white;
	border-radius: 16px;
	margin-bottom: 32px;
	margin-top: 50px;
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	align-items: center;
	position: relative;
	font-weight: 500;
	color: ${neutralColors.gray[900]};
	justify-content: space-between;
`;

export const ProjectsContainer = styled.div`
	display: grid;
	gap: 25px;
	margin-bottom: 64px;

	${mediaQueries.laptop} {
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const Wrapper = styled.div`
	padding: 166px 30px 4px 30px;
	max-width: ${deviceSize.desktop + 'px'};
	margin: 0 auto;
`;

const Title = styled(H3)`
	margin-bottom: 18px;
`;

const Subtitle = styled(Lead)`
	position: relative;
	margin-bottom: 25px;
	font-weight: 400;
	max-width: 1026px;
`;

const FilterAndSearchContainer = styled.div`
	display: flex;
	gap: 16px;
`;

const SearchButton = styled.button`
	border-radius: 50%;
	width: 48px;
	height: 48px;
	background: white;
	box-shadow: ${Shadow.Neutral[500]};
	border: none;
	cursor: pointer;
`;

const FiltersButton = styled.button`
	display: flex;
	gap: 8px;
	border-radius: 50px;
	padding: 16px;
	background: white;
	box-shadow: ${Shadow.Neutral[500]};
	border: none;
	font-weight: 700;
	text-transform: uppercase;
	cursor: pointer;
`;

const FiltersSwiper = styled.div`
	position: relative;
	width: 60%;
	padding-right: 60px;
`;

const NextIcon = styled.button<{ disabled?: boolean }>`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: white;
	box-shadow: ${Shadow.Neutral[500]};
	cursor: ${props => (props.disabled ? 'default' : 'pointer')};
	position: absolute;
	top: calc(50% - 24px);
	right: 0;
	border: none;
	z-index: 1;
	:disabled {
		display: none;
	}
`;

const PrevIcon = styled(NextIcon)<{ disabled?: boolean }>`
	-ms-transform: rotate(180deg);
	transform: rotate(180deg);
	left: 0;
	z-index: 2;
	:disabled {
		display: none;
	}
`;

export default ProjectsIndex;
