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
		{ message, address, chainId, signer }: ISignToGetToken,
		{ getState },
	) => {
		const signedMessage = await signMessage(
			message,
			address,
			chainId,
			signer,
		);
		console.log('signedMessage', signedMessage);
		if (!signedMessage) {
			Promise.reject(new Error('signIn failed'));
		}
		const { user } = getState() as { user: RootState['user'] };
		return getToken(address, signedMessage, chainId, user);
	},
);
