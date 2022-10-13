import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/utils';
import '@testing-library/jest-dom';
import BoostModal from './BoostModal';
import config from '@/configuration';
import type { ISubgraphState } from '@/features/subgraph/subgraph.types';

test('showing the ZeroGivpowerModal if the user GIVpower balance is zero', async () => {
	const setStateMock = jest.fn();
	const useStateMock: any = (useState: any) => [useState, setStateMock];
	jest.spyOn(React, 'useState').mockImplementation(useStateMock);
	const xDaiValues: ISubgraphState = {};
	xDaiValues[
		`unipoolBalance_${config.XDAI_CONFIG.GIV.LM_ADDRESS.toLowerCase()}`
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
					xDaiValues: xDaiValues,
					mainnetValues: {},
					currentValues: {},
				},
			},
		},
	);
	expect(await screen.getByTestId('zero-givpower-modal')).toBeInTheDocument();
});

test('showing the BoostModal if the user GIVpower balance is not zero', async () => {
	const setStateMock = jest.fn();
	const useStateMock: any = (useState: any) => [useState, setStateMock];
	jest.spyOn(React, 'useState').mockImplementation(useStateMock);
	const xDaiValues: ISubgraphState = {};
	xDaiValues[
		`unipoolBalance_${config.XDAI_CONFIG.GIV.LM_ADDRESS.toLowerCase()}`
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
					xDaiValues: xDaiValues,
					mainnetValues: {},
					currentValues: {},
				},
			},
		},
	);
	expect(await screen.getByTestId('boost-modal')).toBeInTheDocument();
});
