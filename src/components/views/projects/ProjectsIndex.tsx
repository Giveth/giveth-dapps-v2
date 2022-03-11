import { useEffect, useRef, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import Debounced from 'lodash.debounce';
import { useRouter } from 'next/router';
import {
	brandColors,
	P,
	neutralColors,
	Subline,
	H3,
	OulineButton,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { BigArc } from '@/components/styled-components/Arc';
import ProjectCard from '@/components/project-card/ProjectCard';
import SearchBox from '@/components/SearchBox';
import Routes from '@/lib/constants/Routes';
import { capitalizeFirstLetter, isUserRegistered } from '@/lib/helpers';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { initializeApollo } from '@/apollo/apolloClient';
import { ICategory, IProject } from '@/apollo/types/types';
import { IFetchAllProjects } from '@/apollo/types/gqlTypes';
import { gqlEnums } from '@/apollo/types/gqlEnums';
import ProjectsNoResults from '@/components/views/projects/ProjectsNoResults';
import { Shadow } from '../../styled-components/Shadow';
import useUser from '@/context/UserProvider';
import { mediaQueries } from '@/utils/constants';

interface IProjectsView {
	projects: IProject[];
	totalCount: number;
	categories: ICategory[];
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
		direction: gqlEnums.ASC,
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
	const { projects, totalCount: _totalCount, categories } = props;

	const {
		state: { user },
		actions: { showCompleteProfile },
	} = useUser();

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

	const isFirstRender = useRef(true);
	const debouncedSearch = useRef<any>();
	const pageNum = useRef(0);

	const router = useRouter();

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
		userIdChanged: boolean = false,
	) => {
		const categoryQuery = selectedCategory.value;

		const variables: IQueries = {
			orderBy: { field: sortBy.value, direction: gqlEnums.DESC },
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

		initializeApollo()
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
			.catch(() => {
				setIsLoading(false);
				/*TODO implement toast here for errors*/
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
			showCompleteProfile();
		}
	};

	const showLoadMore = totalCount > filteredProjects.length;

	return (
		<>
			<BigArc />
			<Wrapper>
				<Title weight={700}>Projects</Title>

				<FiltersSection>
					<SelectComponent>
						<Label>CATEGORY</Label>
						<Select
							classNamePrefix='select'
							styles={selectCustomStyles}
							value={selectedCategory}
							onChange={e => handleChange('category', e)}
							options={categoriesObj}
						/>
					</SelectComponent>
					<SelectComponent>
						<Label>SORT BY</Label>
						<Select
							classNamePrefix='select'
							styles={selectCustomStyles}
							value={sortBy}
							onChange={e => handleChange('sortBy', e)}
							options={sortByObj}
							isOptionSelected={(option, selectValue) =>
								selectValue.some((i: any) => i.label === option)
							}
						/>
					</SelectComponent>
					<SearchComponent>
						<Label />
						<SearchBox
							onChange={(e: string) => handleChange('search', e)}
							reset={clearSearch}
							placeholder='Search Projects ...'
							value={searchValue}
						/>
					</SearchComponent>
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

const selectCustomStyles: StylesConfig = {
	menu: styles => ({
		...styles,
		border: '0px',
		borderRadius: '8px',
		boxShadow: Shadow.Neutral[500],
		'&:focus-within': {
			border: `2px solid ${brandColors.pinky[500]}`,
		},
	}),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		width: '95%',
		height: '38px',
		margin: '4px auto',
		borderRadius: '8px',
		backgroundColor: isSelected
			? neutralColors.gray[300]
			: isFocused
			? neutralColors.gray[200]
			: 'white',
		color: isSelected ? neutralColors.gray[900] : neutralColors.gray[800],
	}),
	control: base => ({
		...base,
		border: 0,
		boxShadow: 'none',
	}),
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

const SelectComponent = styled(P)`
	width: calc(50% - 8px);

	${mediaQueries.laptopL} {
		width: 345px;
	}
`;

const SearchComponent = styled.div`
	flex-grow: 1;
`;

const LoadingDotIcon = styled.div`
	padding: 4px 37px;
`;

const Label = styled(Subline)`
	color: ${brandColors.deep[500]};
	height: 18px;
`;

const FiltersSection = styled.div`
	padding: 32px 21px;
	background: white;
	border-radius: 16px;
	margin-bottom: 14px;
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	align-items: center;
	position: relative;
	font-weight: 500;
	color: ${neutralColors.gray[900]};
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

	${mediaQueries.desktop} {
		grid-template-columns: repeat(4, 1fr);
	}
`;

const Wrapper = styled.div`
	padding: 166px 30px 4px 30px;
`;

const Title = styled(H3)`
	margin-bottom: 25px;
`;

export default ProjectsIndex;
