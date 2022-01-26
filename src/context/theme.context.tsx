import { useContext, createContext, FC, ReactNode, useState } from 'react';

export enum ThemeType {
	Light,
	Dark,
}

const ligthTheme = {
	type: ThemeType.Light,
	bg: '#ffffff',
	fg: '#0D3382',
};

const darkTheme = {
	type: ThemeType.Dark,
	bg: '#1b1657',
	fg: '#ffffff',
};

export const ThemeContext = createContext({
	theme: darkTheme,
	setTheme: function (theme: ThemeType) {
		console.log('ThemeContextSetState Not Impemented ');
	},
});

type Props = {
	children?: ReactNode;
};

export const ThemeProvider: FC<Props> = ({ children }) => {
	const [_theme, setTheme] = useState(ThemeType.Dark);
	return (
		<ThemeContext.Provider
			value={{
				theme: _theme === ThemeType.Light ? ligthTheme : darkTheme,
				setTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export default function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('Theme context not found!');
	}

	return context;
}
