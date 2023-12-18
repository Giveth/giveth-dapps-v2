import { createAsyncThunk } from '@reduxjs/toolkit';
import { connect, getWalletClient } from '@wagmi/core';
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
import { createSiweMessage, signWithEvm } from '@/lib/authentication';

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
		signToGetToken: ISignToGetToken | ISolanaSignToGetToken,
		{ getState, dispatch },
	) => {
		const {
			address,
			safeAddress,
			chainId,
			connector,
			connectors,
			isGSafeConnector,
			expiration,
		} = signToGetToken;

		const solanaSignToGetToken = signToGetToken as ISolanaSignToGetToken;
		const isSolana = !!solanaSignToGetToken.solanaSignedMessage;

		const isSAFE = isGSafeConnector;
		let siweMessage,
			safeMessage: any = null;
	
		if (isSAFE) {
			siweMessage = (await signWithEvm(address, chainId!)) || {};
			safeMessage = await createSiweMessage(
				address!,
				chainId!,
				'Login into Giveth services',
			);
		} else {
			siweMessage = isSolana
				? {
						signature: solanaSignToGetToken.solanaSignedMessage,
						nonce: solanaSignToGetToken.nonce,
						message: solanaSignToGetToken.message,
				  }
				: (await signWithEvm(address, chainId!)) || {};
		}

		const { signature, nonce, message } = siweMessage;
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
					console.log({
						activeSafeToken,
						sessionPending,
						connectors,
					});

					if (sessionPending)
						return Promise.reject('Gnosis Safe Session pending');
					if (!sessionPending && !!activeSafeToken) {
						// returns active token - SUCCESS
						saveTokenToLocalstorage(safeAddress!, activeSafeToken);
						return activeSafeToken;
					}

					try {
						// Connect to gnosis safe
						await connect({
							chainId,
							connector: connectors[3],
						});
					} catch (error) {}

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
					// calls the backend to create gnosis safe token
					console.log({
						safeMessageTimestamp,
						safeAddress,
						network: chainId,
						jwt: currentUserToken,
						approvalExpirationDays: expiration || 8,
					});
					const safeToken = await postRequest(
						`${config.MICROSERVICES.authentication}/multisigAuthentication`,
						false,
						{
							safeMessageTimestamp,
							safeAddress,
							network: chainId,
							jwt: currentUserToken,
							approvalExpirationDays: expiration || 8, // defaults to 1 week
						},
					);
					console.log({ safeToken });

					if (safeToken?.jwt) {
						//save to localstorage if token is created
						saveTokenToLocalstorage(safeAddress!, safeToken?.jwt);
						await dispatch(fetchUserByAddress(safeAddress!));
						return currentUserToken;
					} else {
						return Promise.reject('Signing pending');
					}
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
