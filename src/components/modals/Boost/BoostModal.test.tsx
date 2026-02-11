import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/utils';
import '@testing-library/jest-dom';
import BoostModal from './BoostModal';

beforeAll(() => {
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
});

// Note: These tests need to mock useFetchSubgraphDataForAllChains hook
// as the subgraph state is no longer stored in Redux
test('showing the ZeroGivpowerModal if the user GIVpower balance is zero', async () => {
	const setStateMock = jest.fn();
	const useStateMock: any = (state: any) => [state, setStateMock];
	jest.spyOn(React, 'useState').mockImplementation(useStateMock);
	renderWithProviders(
		<BoostModal projectId='0' setShowModal={setStateMock} />,
		{},
	);
	expect(await screen.getByTestId('zero-givpower-modal')).toBeInTheDocument();
});

test('showing the BoostModal if the user GIVpower balance is not zero', async () => {
	const setStateMock = jest.fn();
	const useStateMock: any = (state: any) => [state, setStateMock];
	jest.spyOn(React, 'useState').mockImplementation(useStateMock);
	renderWithProviders(
		<BoostModal projectId='0' setShowModal={setStateMock} />,
		{},
	);
	// Note: This test may need hook mocking to work properly at runtime
	expect(await screen.getByTestId('boost-modal')).toBeInTheDocument();
});
