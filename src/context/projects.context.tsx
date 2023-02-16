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
import { ESortbyAllProjects } from '@/apollo/types/gqlEnums';

interface IVariables {
	sortingBy?: ESortbyAllProjects;
	filters?: EProjectsFilter[];
	mainCategory?: string;
	category?: string;
	searchTerm?: string;
}

interface IProjectsContext {
	variables: IVariables;
	setVariables: Dispatch<SetStateAction<IVariables>>;
	mainCategories: IMainCategory[];
	selectedMainCategory?: IMainCategory;
}

const variablesDefaultValue = {
	sortingBy: ESortbyAllProjects.GIVPOWER,
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
				case ESortbyAllProjects.MOSTFUNDED.toLowerCase():
					sort = ESortbyAllProjects.MOSTFUNDED;
					break;
				case ESortbyAllProjects.MOSTLIKED.toLowerCase():
					sort = ESortbyAllProjects.MOSTLIKED;
					break;
				case ESortbyAllProjects.NEWEST.toLowerCase():
					sort = ESortbyAllProjects.NEWEST;
					break;
				case ESortbyAllProjects.OLDEST.toLowerCase():
					sort = ESortbyAllProjects.OLDEST;
					break;
				case ESortbyAllProjects.QUALITYSCORE.toLowerCase():
					sort = ESortbyAllProjects.QUALITYSCORE;
					break;
				case ESortbyAllProjects.GIVPOWER.toLowerCase():
					sort = ESortbyAllProjects.GIVPOWER;
					break;
				case ESortbyAllProjects.RECENTLY_UPDATED.toLowerCase():
					sort = ESortbyAllProjects.RECENTLY_UPDATED;
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
		setVariables({
			sortingBy: sort,
			searchTerm: term,
			filters,
		});
	}, [router.query.sort, router.query.term, router.query.filter]);

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
