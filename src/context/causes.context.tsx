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
import { useAppSelector } from '@/features/hooks';

interface IVariables {
	sortingBy?: EProjectsSortBy;
	filters?: EProjectsFilter[];
	mainCategory?: string;
	category?: string;
	campaignSlug?: string;
	searchTerm?: string;
}

interface ICausesContext {
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

const CausesContext = createContext<ICausesContext>({
	variables: variablesDefaultValue,
	mainCategories: [],
	isQF: false,
	isArchivedQF: false,
	setIsQF: () => console.log('setIsQF not initialed yet!'),
});

CausesContext.displayName = 'CausesContext';

const allCategoriesItem = {
	title: 'All',
	description: '',
	banner: '',
	slug: 'all',
	categories: [],
	selected: false,
};

export const CausesProvider = (props: {
	children: ReactNode;
	archivedQFRound?: IQFRound;
	isQF?: boolean;
	isArchivedQF?: boolean;
}) => {
	const { children, isQF, isArchivedQF, archivedQFRound } = props;
	const mainCategories = useAppSelector(
		state => state.general.mainCategories,
	);

	const router = useRouter();
	const updatedMainCategory = [allCategoriesItem, ...mainCategories];
	const selectedMainCategory = updatedMainCategory.find(
		mainCategory => mainCategory.slug === router.query?.slug,
	);

	const [_isQF, setIsQF] = useState(!!isQF);

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
		<CausesContext.Provider
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
		</CausesContext.Provider>
	);
};

export function useCausesContext() {
	const context = useContext(CausesContext);

	if (!context) {
		throw new Error('Causes context not found!');
	}

	return context;
}
