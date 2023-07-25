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
	setVariables: Dispatch<SetStateAction<IVariables>>;
	mainCategories: IMainCategory[];
	selectedMainCategory?: IMainCategory;
	isQF: boolean;
	qfRounds: IQFRound[];
}

const variablesDefaultValue = {
	sortingBy: EProjectsSortBy.INSTANT_BOOSTING,
	filters: undefined,
};

const variablesDefaultValueWithQF = {
	sortingBy: EProjectsSortBy.INSTANT_BOOSTING,
	filters: [EProjectsFilter.ACTIVE_QF_ROUND],
};

const ProjectsContext = createContext<IProjectsContext>({
	variables: variablesDefaultValue,
	setVariables: () => console.log('setVariables not initialed yet!'),
	mainCategories: [],
	isQF: false,
	qfRounds: [],
});

ProjectsContext.displayName = 'ProjectsContext';

export const ProjectsProvider = (props: {
	children: ReactNode;
	mainCategories: IMainCategory[];
	selectedMainCategory?: IMainCategory;
	isQF?: boolean;
	qfRounds?: IQFRound[];
}) => {
	const { children, mainCategories, selectedMainCategory, isQF, qfRounds } =
		props;

	const [variables, setVariables] = useState<IVariables>(
		isQF ? variablesDefaultValueWithQF : variablesDefaultValue,
	);
	const router = useRouter();

	useEffect(() => {
		let sort = EProjectsSortBy.INSTANT_BOOSTING;
		if (router.query.sort) {
			switch ((router.query.sort as string).toLowerCase()) {
				case EProjectsSortBy.MOST_FUNDED.toLowerCase():
					sort = EProjectsSortBy.MOST_FUNDED;
					break;
				case EProjectsSortBy.MOST_LIKED.toLowerCase():
					sort = EProjectsSortBy.MOST_LIKED;
					break;
				case EProjectsSortBy.NEWEST.toLowerCase():
					sort = EProjectsSortBy.NEWEST;
					break;
				case EProjectsSortBy.OLDEST.toLowerCase():
					sort = EProjectsSortBy.OLDEST;
					break;
				case EProjectsSortBy.QUALITY_SCORE.toLowerCase():
					sort = EProjectsSortBy.QUALITY_SCORE;
					break;
				case EProjectsSortBy.INSTANT_BOOSTING.toLowerCase():
					sort = EProjectsSortBy.INSTANT_BOOSTING;
					break;
				case EProjectsSortBy.GIVPOWER.toLowerCase():
					sort = EProjectsSortBy.GIVPOWER;
					break;
				case EProjectsSortBy.RECENTLY_UPDATED.toLowerCase():
					sort = EProjectsSortBy.RECENTLY_UPDATED;
					break;
				default:
					break;
			}
		}
		let filters: EProjectsFilter[] | undefined;
		if (router.query.filter) {
			filters = (
				Array.isArray(router.query.filter)
					? router.query.filter
					: [router.query.filter]
			) as EProjectsFilter[];
		}

		if (isQF) {
			filters
				? filters.push(EProjectsFilter.ACTIVE_QF_ROUND)
				: (filters = [EProjectsFilter.ACTIVE_QF_ROUND]);
		}

		let term = router.query.term as string;
		let campaignSlug = router.query.campaign as string;
		let category =
			router.query?.slug === variables.mainCategory
				? variables.category
				: undefined;
		const variablesObject = router.query?.slug
			? {
					...variables,
					sortingBy: sort,
					searchTerm: term,
					filters,
					campaignSlug,
					mainCategory: router.query?.slug?.toString(),
					category,
			  }
			: {
					...variables,
					sortingBy: sort,
					searchTerm: term,
					filters,
					campaignSlug,
			  };
		setVariables(variablesObject);
	}, [
		router.query.sort,
		router.query.term,
		router.query.filter,
		router.query.campaign,
		router.query?.slug,
		isQF,
	]);

	return (
		<ProjectsContext.Provider
			value={{
				variables,
				setVariables,
				mainCategories,
				selectedMainCategory,
				isQF: isQF || false,
				qfRounds: qfRounds || [],
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
