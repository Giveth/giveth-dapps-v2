import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react';

interface IVariables {
	sortingBy?: string;
	filters?: string[];
	mainCategory?: string;
	category?: string;
	searchTerm?: string;
}

interface IProjectsContext {
	variables: IVariables;
	setVariables: Dispatch<SetStateAction<IVariables>>;
}

const variablesDefaultValue = {
	// sortingBy: ESortby.QUALITYSCORE,
	sortingBy: undefined,
	filters: undefined,
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
		throw new Error('Projects context not found!');
	}

	return context;
}
