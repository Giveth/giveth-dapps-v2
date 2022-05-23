import { createAsyncThunk } from '@reduxjs/toolkit';
import gqlRequest from '@/helpers/gqlRequest';
import { GET_USER_BY_ADDRESS } from './user.queries';
import { ISignToGetToken } from './user.types';
import { signMessage } from '@/lib/helpers';
import { getToken } from '@/services/token';
import { RootState } from '../store';

export const fetchUserByAddress = createAsyncThunk(
	'user/fetchUser',
	async (address: string) => {
		return gqlRequest(GET_USER_BY_ADDRESS, { address });
	},
);

export const signToGetToken = createAsyncThunk(
	'user/signToGetToken',
	async (
		{ address, chainId, signer }: ISignToGetToken,
		{ getState, dispatch },
	) => {
		const signedMessage = await signMessage(
			process.env.NEXT_PUBLIC_OUR_SECRET as string,
			address,
			chainId,
			signer,
		);
		if (signedMessage) {
			const state = getState() as RootState;
			console.log('getToken State', state.user.userData);
			if (!state.user.userData) {
				await dispatch(fetchUserByAddress(address));
			}
			return getToken(
				address,
				signedMessage,
				chainId,
				state.user.userData,
			);
		} else {
			return Promise.reject('Signing failed');
		}
	},
);
