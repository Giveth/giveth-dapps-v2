import { createAsyncThunk } from '@reduxjs/toolkit';
import { connect, getWalletClient } from '@wagmi/core';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
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
} from './user.types';
import { createSiweMessage } from '@/lib/helpers';
import { RootState } from '../store';
import { postRequest } from '@/helpers/requests';
import config from '@/configuration';
import StorageLabel from '@/lib/localStorage';
import { getTokens } from '@/helpers/user';

const saveTokenToLocalstorage = (address: string, token: string) => {
	const _address = address.toLowerCase();
	localStorage.setItem(StorageLabel.USER, _address);
	localStorage.setItem(StorageLabel.TOKEN, token);
	const tokens = getTokens();
	tokens[_address] = token;
	localStorage.setItem(StorageLabel.TOKENS, JSON.stringify(tokens));
};

export const fetchUserByAddress = createAsyncThunk(
	'user/fetchUser',
	async (address: string) => {
		return backendGQLRequest(GET_USER_BY_ADDRESS, { address });
	},
);

export const signToGetToken = createAsyncThunk(
	'user/signToGetToken',
	async (
		{ address, chainId, connectors, isGSafeConnector }: ISignToGetToken,
		{ getState, dispatch },
	) => {
		try {
			const isSAFE = isGSafeConnector;
			let safeAddress = '';
			let siweMessage,
				safeMessage: any = null;
			if (isSAFE) {
				safeAddress = address!;
				await connect({ chainId, connector: new MetaMaskConnector() });
				const metamaskClient = await getWalletClient({ chainId });
				siweMessage = await createSiweMessage(
					metamaskClient?.account?.address!,
					chainId!,
					'Login into Giveth services',
				);
				safeMessage = await createSiweMessage(
					address!,
					chainId!,
					'Login into Giveth services',
				);
			} else {
				siweMessage = await createSiweMessage(
					address!,
					chainId!,
					'Login into Giveth services',
				);
			}

			const { nonce, message } = siweMessage as any;
			const walletClient = await getWalletClient({ chainId });

			const signature = await walletClient?.signMessage({ message });

			if (signature) {
				const state = getState() as RootState;
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
				saveTokenToLocalstorage(address!, token.jwt);
				await dispatch(fetchUserByAddress(address));

				const currentUserToken = token.jwt;
				if (isSAFE && !!safeMessage) {
					let activeSafeToken,
						sessionPending = false;

					try {
						const sessionCheck = await postRequest(
							`${config.MICROSERVICES.authentication}/multisigAuthentication`,
							false,
							{
								safeMessageTimestamp: null,
								safeAddress,
								network: chainId,
								jwt: currentUserToken,
							},
						);
						if (sessionCheck?.status === 'successful') {
							activeSafeToken = sessionCheck?.jwt;
						} else if (sessionCheck?.status === 'pending') {
							sessionPending = true;
						}
					} catch (error) {
						console.log({ error });
					}

					await connect({
						chainId,
						connector: connectors[4],
					});
					if (sessionPending)
						return Promise.reject('Gnosis Safe Session pending');
					if (!sessionPending && !!activeSafeToken) {
						// returns active token
						saveTokenToLocalstorage(safeAddress!, activeSafeToken);
						return activeSafeToken;
					}
					const gnosisClient = await getWalletClient({ chainId });
					let safeSignature;
					const safeMessageTimestamp = new Date().getTime();
					try {
						safeSignature = await gnosisClient?.signMessage({
							message: safeMessage.message,
						});
					} catch (error) {
						// user will close the transaction but it will create anyway
						console.log({ error });
					}

					console.log({
						safeMessageTimestamp,
						safeAddress,
						network: chainId,
						jwt: currentUserToken,
					});
					// calls the backend to create gnosis safe token
					const safeToken = await postRequest(
						`${config.MICROSERVICES.authentication}/multisigAuthentication`,
						false,
						{
							safeMessageTimestamp,
							safeAddress,
							network: chainId,
							jwt: currentUserToken,
						},
					);
					console.log({ safeToken });

					if (safeToken?.jwt) {
						//save to localstorage if token is created
						console.log('GOT IN YAY');
						saveTokenToLocalstorage(safeAddress!, safeToken?.jwt);
					}
					return currentUserToken;
				} else {
					return currentUserToken;
				}
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
