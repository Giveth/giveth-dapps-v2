import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendGQLRequest } from '@/helpers/requests';
import {
	GET_USER_BY_ADDRESS,
	REGISTER_ON_CHAINVINE,
	REGISTER_CLICK_ON_REFERRAL,
} from './user.queries';
import {
	ISignToGetToken,
	IChainvineSetReferral,
	IChainvineClickCount,
	ISolanaSignToGetToken,
} from './user.types';
import { RootState } from '../store';
import { postRequest } from '@/helpers/requests';
import config from '@/configuration';
import StorageLabel from '@/lib/localStorage';
import { getTokens } from '@/helpers/user';
import { signWithEvm } from '@/lib/authentication';

export const fetchUserByAddress = createAsyncThunk(
	'user/fetchUser',
	async (address: string) => {
		return backendGQLRequest(GET_USER_BY_ADDRESS, { address });
	},
);

export const signToGetToken = createAsyncThunk(
	'user/signToGetToken',
	async (
		signToGetToken: ISignToGetToken | ISolanaSignToGetToken,
		{ getState, dispatch },
	) => {
		const { address, chainId } = signToGetToken;

		const solanaSignToGetToken = signToGetToken as ISolanaSignToGetToken;
		const isSolana = !!solanaSignToGetToken.solanaSignedMessage;

		const { signature, nonce, message } = isSolana
			? {
					signature: solanaSignToGetToken.solanaSignedMessage,
					nonce: solanaSignToGetToken.nonce,
					message: solanaSignToGetToken.message,
				}
			: (await signWithEvm(address, chainId!)) || {};

		console.log('signature', signature);
		console.log('nonce', nonce);
		console.log('message', message);
		try {
			if (signature) {
				const state = getState() as RootState;
				if (!state.user.userData) {
					await dispatch(fetchUserByAddress(address));
				}

				const path = isSolana
					? 'solanaAuthentication'
					: 'authentication';

				const data: Record<string, any> = {
					signature,
					message,
					nonce,
				};

				if (isSolana) {
					data.address = address;
				}

				const token = await postRequest(
					`${config.MICROSERVICES.authentication}/${path}`,
					true,
					data,
				);

				const _address = address.toLowerCase();
				localStorage.setItem(StorageLabel.USER, _address);
				localStorage.setItem(StorageLabel.TOKEN, token.jwt);
				const tokens = getTokens();
				tokens[_address] = token.jwt;
				localStorage.setItem(
					StorageLabel.TOKENS,
					JSON.stringify(tokens),
				);
				// When token is fetched, user should be fetched again to get email address
				await dispatch(fetchUserByAddress(address));
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
		console.log(Date.now(), 'signOut in user thunk');

		return await postRequest(
			`${config.MICROSERVICES.authentication}/logout`,
			true,
			{
				jwt: token,
			},
		);
	},
);

export const startChainvineReferral = createAsyncThunk(
	'user/startChainvineReferral',
	async ({ address }: IChainvineSetReferral, { dispatch }) => {
		try {
			const res = await backendGQLRequest(REGISTER_ON_CHAINVINE);
			dispatch(fetchUserByAddress(address));
			return res?.payload;
		} catch (error) {
			console.log({ error });
			return Promise.reject('Referral start failed');
		}
	},
);

export const countReferralClick = createAsyncThunk(
	'user/countReferralClick',
	async ({ referrerId, walletAddress }: IChainvineClickCount) => {
		try {
			const response = await backendGQLRequest(
				REGISTER_CLICK_ON_REFERRAL,
				{ referrerId, walletAddress },
			);
			return response?.payload;
		} catch (error) {
			console.log({ error });
			return Promise.reject('Referral start failed');
		}
	},
);
