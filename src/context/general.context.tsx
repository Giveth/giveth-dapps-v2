import {
	createContext,
	FC,
	useContext,
	useState,
	Dispatch,
	SetStateAction,
} from 'react';

enum Theme {
	Light,
	Dark,
}

export interface IGeneralContext {
	theme: Theme;
	setTheme: Dispatch<SetStateAction<Theme>>;
	showHeader: boolean;
	setShowHeader: Dispatch<SetStateAction<boolean>>;
	showFooter: boolean;
	setShowFooter: Dispatch<SetStateAction<boolean>>;
}

export const GeneralContext = createContext<IGeneralContext>({
	theme: Theme.Light,
	setTheme: theme => {},
	showHeader: true,
	setShowHeader: showHeader => {},
	showFooter: true,
	setShowFooter: showFooter => {},
});

export const GeneralProvider: FC = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(Theme.Light);
	const [showHeader, setShowHeader] = useState(true);
	const [showFooter, setShowFooter] = useState(true);

	return (
		<GeneralContext.Provider
			value={{
				theme,
				setTheme,
				showHeader,
				setShowHeader,
				showFooter,
				setShowFooter,
			}}
		>
			{children}
		</GeneralContext.Provider>
	);
};

export function useGeneral() {
	const context = useContext(GeneralContext);

	if (!context) {
		throw new Error('Token balance context not found!');
	}

	return context;
}
