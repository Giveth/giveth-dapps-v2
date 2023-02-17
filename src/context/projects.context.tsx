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
import { EProjectsFilter, IMainCategory } from '@/apollo/types/types';
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
}

const variablesDefaultValue = {
	sortingBy: EProjectsSortBy.GIVPOWER,
	filters: undefined,
};

const ProjectsContext = createContext<IProjectsContext>({
	variables: variablesDefaultValue,
	setVariables: () => console.log('setVariables not initialed yet!'),
	mainCategories: [],
});

ProjectsContext.displayName = 'ProjectsContext';

export const ProjectsProvider = (props: {
	children: ReactNode;
	mainCategories: IMainCategory[];
	selectedMainCategory?: IMainCategory;
}) => {
	const { children, mainCategories, selectedMainCategory } = props;

	const [variables, setVariables] = useState<IVariables>(
		variablesDefaultValue,
	);
	const router = useRouter();

	useEffect(() => {
		let sort;
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
		let filters;
		if (router.query.filter) {
			filters = (
				Array.isArray(router.query.filter)
					? router.query.filter
					: [router.query.filter]
			) as EProjectsFilter[];
		}

		let term = router.query.term as string;
		let campaignSlug = router.query.campaign as string;
		setVariables({
			sortingBy: sort,
			searchTerm: term,
			filters,
			campaignSlug,
		});
	}, [
		router.query.sort,
		router.query.term,
		router.query.filter,
		router.query.campaign,
	]);

	return (
		<ProjectsContext.Provider
			value={{
				variables,
				setVariables,
				mainCategories,
				selectedMainCategory,
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
