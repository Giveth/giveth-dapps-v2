import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendGQLRequest } from '@/helpers/requests';
import { GET_USER_BY_ADDRESS } from './user.queries';
import { ISignToGetToken } from './user.types';
import { createSiweMessage } from '@/lib/helpers';
import { RootState } from '../store';
import { postRequest } from '@/helpers/requests';
import config from '@/configuration';

export const fetchUserByAddress = createAsyncThunk(
	'user/fetchUser',
	async (address: string) => {
		return backendGQLRequest(GET_USER_BY_ADDRESS, { address });
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
				const token = await postRequest(
					`${config.MICROSERVICES.authentication}/authentication`,
					true,
					{
						signature,
						message,
						nonce,
					},
				);
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

export const signOut = createAsyncThunk(
	'user/signOut',
	async (token?: string | null) => {
		// this is in the case we fail to grab the token from local storage
		//  but still want to remove the whole user
		if (!token) return Promise.resolve(true);

		return await postRequest(
			`${config.MICROSERVICES.authentication}/logout`,
			true,
			{
				jwt: token,
			},
		);
	},
);
