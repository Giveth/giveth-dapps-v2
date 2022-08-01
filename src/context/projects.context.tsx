import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import { IMainCategory } from '@/apollo/types/types';

interface IVariables {
	orderBy: { field: string; direction: string };
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
	orderBy: OPTIONS_HOME_PROJECTS.variables.orderBy,
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
