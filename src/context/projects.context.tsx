import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';

interface IVariables {
	orderBy: { field: string; direction: string };
	mainCategory?: string;
	category?: string;
	searchTerm?: string;
}

interface IProjectsContext {
	variables: IVariables;
	setVariables: Dispatch<SetStateAction<IVariables>>;
}

const variablesDefaultValue = {
	orderBy: OPTIONS_HOME_PROJECTS.variables.orderBy,
};

const ProjectsContext = createContext<IProjectsContext>({
	variables: variablesDefaultValue,
	setVariables: () => console.log('setVariables not initialed yet!'),
});

ProjectsContext.displayName = 'ProjectsContext';

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
	const [variables, setVariables] = useState<IVariables>(
		variablesDefaultValue,
	);
	return (
		<ProjectsContext.Provider value={{ variables, setVariables }}>
			{children}
		</ProjectsContext.Provider>
	);
};

export function useProjectsContext() {
	const context = useContext(ProjectsContext);

	if (!context) {
		throw new Error('Token balance context not found!');
	}

	return context;
}
