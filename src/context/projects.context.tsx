import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useRouter } from 'next/router';
import { EProjectsFilter, IMainCategory, IQFRound } from '@/apollo/types/types';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { sortMap } from '@/helpers/projects';
import { useAppSelector } from '@/features/hooks';
import useMiniApp from '@/hooks/useMiniApp';

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
	isCauses?: boolean;
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
	isCauses: false,
});

ProjectsContext.displayName = 'ProjectsContext';

const allCategoriesItem = {
	title: 'All',
	description: '',
	banner: '',
	slug: 'all',
	categories: [],
	selected: false,
};

export const ProjectsProvider = (props: {
	children: ReactNode;
	archivedQFRound?: IQFRound;
	isQF?: boolean;
	isArchivedQF?: boolean;
	isCauses?: boolean;
}) => {
	const { children, isQF, isArchivedQF, archivedQFRound, isCauses } = props;
	const mainCategories = useAppSelector(
		state => state.general.mainCategories,
	);

	const router = useRouter();
	const {
		isInMiniApp,
		isLoading: isMiniAppLoading,
		miniAppHost,
	} = useMiniApp();
	const updatedMainCategory = [allCategoriesItem, ...mainCategories];
	const selectedMainCategory = updatedMainCategory.find(
		mainCategory => mainCategory.slug === router.query?.slug,
	);

	const [_isQF, setIsQF] = useState(!!isQF);

	/**
	 * Mini-app behavior:
	 * - Base App: force `AcceptFundOnBase`
	 * - Farcaster: force `AcceptFundOnPolygon`
	 *
	 * We enforce via URL query so SSR/links are consistent (`/projects/all?filter=...`).
	 */
	useEffect(() => {
		// Only apply for projects list routes (not causes and not QF pages)
		if (!router.isReady) return;
		if (isCauses) return;
		if (router.pathname !== '/projects/[slug]') return;
		if (isMiniAppLoading) return;
		if (!isInMiniApp || !miniAppHost) return;

		const requiredFilter =
			miniAppHost === 'base'
				? EProjectsFilter.ACCEPT_FUND_ON_BASE
				: EProjectsFilter.ACCEPT_FUND_ON_POLYGON;

		const raw = router.query.filter;
		const existingFilters = (
			raw ? (Array.isArray(raw) ? raw : [raw]) : []
		).map(String);

		// Remove any chain filters (AcceptFundOn*) and enforce the required one.
		const nonChainFilters = existingFilters.filter(
			f => !f.startsWith('AcceptFundOn'),
		);
		const nextFilters = [...nonChainFilters, requiredFilter];

		const normalize = (arr: string[]) => [...arr].sort().join('|');
		if (normalize(existingFilters) === normalize(nextFilters)) return;

		router.replace(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					filter: nextFilters,
				},
			},
			undefined,
			// IMPORTANT: do NOT use shallow routing here.
			// We need Next.js to re-run `getServerSideProps` so SSR props (and react-query initialData)
			// are consistent with the enforced mini-app chain filter.
			{ shallow: false },
		);
	}, [
		router.isReady,
		router.pathname,
		router.asPath,
		isCauses,
		isMiniAppLoading,
		isInMiniApp,
		miniAppHost,
	]);

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
				isCauses: isCauses || false,
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
