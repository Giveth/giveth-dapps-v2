import {
	createContext,
	FC,
	useContext,
	useState,
	Dispatch,
	SetStateAction,
} from 'react';
import { createGlobalStyle } from 'styled-components';

export enum ETheme {
	Light = 1,
	Dark,
}

const GlobalStyle = createGlobalStyle<{ theme: ETheme }>`
  body {
    background-color: ${props =>
		props.theme === ETheme.Dark ? '#1b1657' : 'white'};
	color: ${props => (props.theme === ETheme.Dark ? 'white' : '#212529')};
  }
`;

export interface IGeneralContext {
	theme: ETheme;
	setTheme: Dispatch<SetStateAction<ETheme>>;
	showHeader: boolean;
	setShowHeader: Dispatch<SetStateAction<boolean>>;
	showFooter: boolean;
	setShowFooter: Dispatch<SetStateAction<boolean>>;
}

export const GeneralContext = createContext<IGeneralContext>({
	theme: ETheme.Light,
	setTheme: theme => {},
	showHeader: true,
	setShowHeader: showHeader => {},
	showFooter: true,
	setShowFooter: showFooter => {},
});

export const GeneralProvider: FC = ({ children }) => {
	const [theme, setTheme] = useState<ETheme>(ETheme.Light);
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
			<GlobalStyle theme={theme} />
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
