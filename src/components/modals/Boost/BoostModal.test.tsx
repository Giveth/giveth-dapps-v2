import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/utils';
import '@testing-library/jest-dom';
import BoostModal from './BoostModal';
import config from '@/configuration';
import { ISubgraphState } from '@/types/subgraph';

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

test('showing the ZeroGivpowerModal if the user GIVpower balance is zero', async () => {
	const setStateMock = jest.fn();
	const useStateMock: any = (state: any) => [state, setStateMock];
	jest.spyOn(React, 'useState').mockImplementation(useStateMock);
	const gnosisValues: ISubgraphState = {};
	gnosisValues[
		`unipoolBalance_${config.GNOSIS_CONFIG.GIVPOWER.LM_ADDRESS.toLowerCase()}`
	] = {
		balance: '0',
		rewards: '',
		rewardPerTokenPaid: '',
	};
	renderWithProviders(
		<BoostModal projectId='0' setShowModal={setStateMock} />,
		{
			preloadedState: {
				subgraph: {
					gnosisValues: gnosisValues,
					mainnetValues: {},
					currentValues: {},
					optimismValues: {},
				},
			},
		},
	);
	expect(await screen.getByTestId('zero-givpower-modal')).toBeInTheDocument();
});

test('showing the BoostModal if the user GIVpower balance is not zero', async () => {
	const setStateMock = jest.fn();
	const useStateMock: any = (state: any) => [state, setStateMock];
	jest.spyOn(React, 'useState').mockImplementation(useStateMock);
	const gnosisValues: ISubgraphState = {};
	gnosisValues[
		`unipoolBalance_${config.GNOSIS_CONFIG.GIVPOWER.LM_ADDRESS.toLowerCase()}`
	] = {
		balance: '1',
		rewards: '',
		rewardPerTokenPaid: '',
	};
	renderWithProviders(
		<BoostModal projectId='0' setShowModal={setStateMock} />,
		{
			preloadedState: {
				subgraph: {
					gnosisValues: gnosisValues,
					mainnetValues: {},
					currentValues: {},
					optimismValues: {},
				},
			},
		},
	);
	expect(await screen.getByTestId('boost-modal')).toBeInTheDocument();
});
