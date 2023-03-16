import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { IntlProvider } from 'react-intl';
import { AppStore, RootState, setupStore } from '@/features/store';
import { IntlMessages } from 'pages/_app';
import type { PreloadedState } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // Deprecated
		removeListener: jest.fn(), // Deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
	preloadedState?: PreloadedState<RootState>;
	store?: AppStore;
	locale?: string;
}

export function renderWithProviders(
	ui: React.ReactElement,
	{
		preloadedState = {},
		locale = 'en',
		// Automatically create a store instance if no store was passed in
		store = setupStore(preloadedState),
		...renderOptions
	}: ExtendedRenderOptions = {},
) {
	function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
		return (
			<Provider store={store}>
				<IntlProvider
					locale={locale}
					messages={IntlMessages[locale as keyof typeof IntlMessages]}
					defaultLocale='en'
				>
					{children}
				</IntlProvider>
			</Provider>
		);
	}
	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
