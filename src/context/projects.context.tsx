import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';

interface IVariables {
	sortingBy?: string;
	filters?: string[];
	mainCategory?: string;
	category?: string;
	searchTerm?: string;
	filtersCount: number;
}

interface IProjectsContext {
	variables: IVariables;
	setVariables: Dispatch<SetStateAction<IVariables>>;
}

const variablesDefaultValue = {
	// sortingBy: ESortby.QUALITYSCORE,
	sortingBy: undefined,
	filters: undefined,
	filtersCount: 0,
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

	useEffect(() => {
		setVariables({
			...variables,
			filtersCount: variables.filters?.length ?? 0,
		});
	}, [variables.filters]);

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
