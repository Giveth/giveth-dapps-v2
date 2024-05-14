import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
	useEffect,
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
	variables?: IVariables;
	mainCategories: IMainCategory[];
	selectedMainCategory?: IMainCategory;
	qfRounds: IQFRound[];
	isQF: boolean;
	isArchivedQF?: boolean;
	setIsQF: Dispatch<SetStateAction<boolean>>;
}

const ProjectsContext = createContext<IProjectsContext>({
	variables: undefined,
	mainCategories: [],
	qfRounds: [],
	isQF: false,
	isArchivedQF: false,
	setIsQF: () => console.log('setIsQF not initialed yet!'),
});

ProjectsContext.displayName = 'ProjectsContext';

export const ProjectsProvider = (props: {
	children: ReactNode;
	mainCategories: IMainCategory[];
	selectedMainCategory?: IMainCategory;
	qfRounds: IQFRound[];
	isQF: boolean;
	isArchivedQF?: boolean;
}) => {
	const {
		children,
		mainCategories,
		selectedMainCategory,
		isQF,
		isArchivedQF,
		qfRounds,
	} = props;

	const router = useRouter();
	const [_isQF, setIsQF] = useState(props.isQF);
	const [variables, setVariables] = useState<IVariables>();

	useEffect(() => {
		if (!router.isReady) return;
		let sort = EProjectsSortBy.INSTANT_BOOSTING;
		const sortValue = router.query.sort as string;
		if (sortValue && sortMap[sortValue.toLowerCase()]) {
			sort = sortMap[sortValue.toLowerCase()];
		}

		let filters: EProjectsFilter[] | undefined;
		if (router.query.filter) {
			filters = (
				Array.isArray(router.query.filter)
					? router.query.filter
					: [router.query.filter]
			) as EProjectsFilter[];
		}
		if (_isQF) {
			filters
				? filters.push(EProjectsFilter.ACTIVE_QF_ROUND)
				: (filters = [EProjectsFilter.ACTIVE_QF_ROUND]);
		}

		let searchTerm = router.query.searchTerm as string;
		let campaignSlug = router.query.campaign as string;
		let category = router.query.category as string;

		// After setting initial params based on URL
		setVariables({
			sortingBy: sort,
			searchTerm,
			filters,
			campaignSlug,
			mainCategory: router.query?.slug?.toString(),
			category,
		});

		return () => {
			setVariables(undefined); // Reset on component unmount if needed
		};
	}, [_isQF, router.query, router.isReady]);

	return (
		<ProjectsContext.Provider
			value={{
				variables,
				mainCategories,
				selectedMainCategory,
				qfRounds: qfRounds || [],
				isQF: _isQF || false,
				isArchivedQF: isArchivedQF || false,
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
