import { createAsyncThunk } from '@reduxjs/toolkit';
import { gqlRequest } from '@/helpers/requests';
import { GET_USER_BY_ADDRESS } from './user.queries';
import { ISignToGetToken } from './user.types';
import { createSiweMessage } from '@/lib/helpers';
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
		{ address, chainId, signer, pathname }: ISignToGetToken,
		{ getState, dispatch },
	) => {
		try {
			const siweMessage: any = await createSiweMessage(
				address!,
				chainId!,
				pathname!,
				'Login into Giveth services',
			);
			const { nonce, message } = siweMessage;
			const signature = await signer.signMessage(message);
			if (signature) {
				const state = getState() as RootState;
				console.log('getToken State', state.user.userData);
				if (!state.user.userData) {
					await dispatch(fetchUserByAddress(address));
				}
				const token = await getToken(signature, message, nonce);
				return token.jwt;
			} else {
				return Promise.reject('Signing failed');
			}
		} catch (error) {
			console.log({ error });
			return Promise.reject('Signing failed');
		}
	},
);
