import React from 'react';
import { setupServer } from 'msw/node';
import { graphql } from 'msw';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/utils';
import '@testing-library/jest-dom';
import { BN } from '@/helpers/number';
import BoostInnerModal from './BoostInnerModal';
import { EBoostModalState } from './BoostModal';

export const handlers = [
	graphql.query('getPowerBoostingsQuery', (req, res, ctx) => {
		return res(
			ctx.data({
				getPowerBoosting: {
					powerBoostings: [],
				},
			}),
		);
	}),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test('showing user total GIVpower amount correctly', async () => {
	const setStateMock = jest.fn();
	const useStateMock: any = (useState: any) => [useState, setStateMock];
	jest.spyOn(React, 'useState').mockImplementation(useStateMock);
	renderWithProviders(
		<BoostInnerModal
			totalGIVpower={BN('1000000000000000000000')}
			projectId='0'
			setPercentage={setStateMock}
			setState={setStateMock}
			setShowModal={setStateMock}
			state={EBoostModalState.BOOSTING}
		/>,
		{
			preloadedState: {
				user: {
					userData: {
						id: '1',
						isSignedIn: true,
					},
					token: '',
					isEnabled: true,
					isSignedIn: true,
					balance: '1000',
					isLoading: false,
				},
			},
		},
	);
	expect(await screen.getByText(/1,000/)).toBeInTheDocument();
});

test('showing user total GIVpower amount correctly', async () => {
	const setStateMock = jest.fn();
	const useStateMock: any = (useState: any) => [useState, setStateMock];
	jest.spyOn(React, 'useState').mockImplementation(useStateMock);
	renderWithProviders(
		<BoostInnerModal
			totalGIVpower={BN('1000000000000000000000')}
			projectId='0'
			setPercentage={setStateMock}
			setState={setStateMock}
			setShowModal={setStateMock}
			state={EBoostModalState.BOOSTING}
		/>,
		{
			preloadedState: {
				user: {
					userData: {
						id: '1',
						isSignedIn: true,
					},
					token: '',
					isEnabled: true,
					isSignedIn: true,
					balance: '1000',
					isLoading: false,
				},
			},
		},
	);
	expect(await screen.getByText(/1,000/)).toBeInTheDocument();
});
