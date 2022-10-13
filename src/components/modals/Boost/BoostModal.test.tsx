import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/utils';
import '@testing-library/jest-dom';
import BoostModal from './BoostModal';
import config from '@/configuration';
import type { ISubgraphState } from '@/features/subgraph/subgraph.types';

// Please Don't remove these comment they will help us on mocking requests. Thanks
// We use msw to intercept the network request during the test,
// and return the response 'John Smith' after 150ms
// when receiving a get request to the `/api/user` endpoint
// export const handlers = [
// 	rest.post(config.XDAI_CONFIG.subgraphAddress, (req, res, ctx) => {
// 		console.log('called');

// 		return res(
// 			ctx.json({
// 				givpowerInfo: {
// 					id: '0xdaea66adc97833781139373df5b3bced3fdda5b1',
// 					initialDate: '1640617800',
// 					locksCreated: 18,
// 					roundDuration: 1209600,
// 					totalGIVLocked: '201271330350605663881960',
// 				},
// 				userGIVLocked: {
// 					givLocked: '10000',
// 				},
// 				// `unipoolBalance_${config.XDAI_CONFIG.GIV.LM_ADDRESS}`: "1000",
// 				unipoolBalance_0xdaea66adc97833781139373df5b3bced3fdda5b1:
// 					'1000',
// 			}),
// 			ctx.delay(150),
// 		);
// 	}),
// 	rest.post(config.MAINNET_CONFIG.subgraphAddress, (req, res, ctx) => {
// 		console.log('called');

// 		return res(
// 			ctx.json({
// 				givpowerInfo: {
// 					id: '0xdaea66adc97833781139373df5b3bced3fdda5b1',
// 					initialDate: '1640617800',
// 					locksCreated: 18,
// 					roundDuration: 1209600,
// 					totalGIVLocked: '201271330350605663881960',
// 				},
// 				userGIVLocked: {
// 					givLocked: '10000',
// 				},
// 				// `unipoolBalance_${config.XDAI_CONFIG.GIV.LM_ADDRESS}`: "1000",
// 				unipoolBalance_0xdaea66adc97833781139373df5b3bced3fdda5b1:
// 					'1000',
// 			}),
// 			ctx.delay(150),
// 		);
// 	}),
// 	// rest.get(config.MAINNET_CONFIG.subgraphAddress, (req, res, ctx) => {
// 	// 	return res(ctx.json('John Smith'), ctx.delay(150));
// 	// }),
// ];

// const server = setupServer(...handlers);

// // Enable API mocking before tests.
// beforeAll(() => server.listen());

// // Reset any runtime request handlers we may add during the tests.
// afterEach(() => server.resetHandlers());

// // Disable API mocking after the tests are done.
// afterAll(() => server.close());

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
