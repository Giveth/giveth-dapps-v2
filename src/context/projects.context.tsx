import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react';
import { useRouter } from 'next/router';
import { EProjectsFilter, IMainCategory, IQFRound } from '@/apollo/types/types';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { sortMap } from '@/helpers/projects';

interface IVariables {
	sortingBy?: EProjectsSortBy;
	filters?: EProjectsFilter[];
	mainCategory?: string;
	category?: string;
	campaignSlug?: string;
	searchTerm?: string;
}

interface IProjectsContext {
	variables: IVariables;
	mainCategories: IMainCategory[];
	selectedMainCategory?: IMainCategory;
	archivedQFRound?: IQFRound;
	isQF: boolean;
	isArchivedQF?: boolean;
	setIsQF: Dispatch<SetStateAction<boolean>>;
}

const variablesDefaultValue = {
	sortingBy: EProjectsSortBy.INSTANT_BOOSTING,
	filters: undefined,
};

const ProjectsContext = createContext<IProjectsContext>({
	variables: variablesDefaultValue,
	mainCategories: [],
	isQF: false,
	isArchivedQF: false,
	setIsQF: () => console.log('setIsQF not initialed yet!'),
});

ProjectsContext.displayName = 'ProjectsContext';

export const ProjectsProvider = (props: {
	children: ReactNode;
	mainCategories: IMainCategory[];
	selectedMainCategory?: IMainCategory;
	archivedQFRound?: IQFRound;
	isQF: boolean;
	isArchivedQF?: boolean;
}) => {
	const {
		children,
		mainCategories,
		selectedMainCategory,
		isQF,
		isArchivedQF,
		archivedQFRound,
	} = props;

	const [_isQF, setIsQF] = useState(isQF);
	const router = useRouter();

	let sort = EProjectsSortBy.INSTANT_BOOSTING;
	const sortValue = router.query.sort as string;
	if (sortValue) sort = sortMap[sortValue.toLowerCase()];

	let filters: EProjectsFilter[] | undefined;
	if (router.query.filter) {
		filters = (
			Array.isArray(router.query.filter)
				? router.query.filter
				: [router.query.filter]
		) as EProjectsFilter[];
	}
	if (_isQF && !isArchivedQF) {
		filters
			? filters.push(EProjectsFilter.ACTIVE_QF_ROUND)
			: (filters = [EProjectsFilter.ACTIVE_QF_ROUND]);
	}

	let searchTerm = router.query.searchTerm as string;
	let campaignSlug = router.query.campaign as string;
	let category = router.query.category as string;

	return (
		<ProjectsContext.Provider
			value={{
				variables: {
					sortingBy: sort,
					searchTerm,
					filters,
					campaignSlug,
					mainCategory: router.query?.slug?.toString(),
					category,
				},
				mainCategories,
				selectedMainCategory,
				isQF: _isQF || false,
				isArchivedQF: isArchivedQF || false,
				archivedQFRound,
				setIsQF,
			}}
		>
			{children}
		</ProjectsContext.Provider>
	);
};

export function useProjectsContext() {
	const context = useContext(ProjectsContext);

	if (!context) {
		throw new Error('Projects context not found!');
	}

	return context;
}
