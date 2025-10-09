import { createAsyncThunk } from '@reduxjs/toolkit';
import { connect, signMessage } from '@wagmi/core';
import config from '@/configuration';
import { backendGQLRequest, postRequest } from '@/helpers/requests';
import { getTokens } from '@/helpers/user';
import { createSiweMessage, signWithEvm } from '@/lib/authentication';
import StorageLabel from '@/lib/localStorage';
import { wagmiConfig } from '@/wagmiConfigs';
import { RootState } from '../store';
import {
	GET_USER_BY_ADDRESS,
	REGISTER_CLICK_ON_REFERRAL,
	REGISTER_ON_CHAINVINE,
} from './user.queries';
import {
	IChainvineClickCount,
	IChainvineSetReferral,
	ISignToGetToken,
	ISolanaSignToGetToken,
} from './user.types';

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
			secondarySignerAddress,
			chainId,
			connectors,
			connector,
			isGSafeConnector,
			expiration,
		} = signToGetToken;

		const returnToGnosisSafe = async () => {
			try {
				dispatch(signOut());
				localStorage.removeItem(StorageLabel.WALLET);
				// Connect to gnosis safe
				const safeConnector = connectors.find(
					(i: any) => i.id === 'safe',
				);
				safeConnector &&
					(await connect(wagmiConfig, {
						chainId,
						connector: safeConnector,
					}));
			} catch (error) {
				console.error('Failed to connect to Gnosis Safe:', error);
			}
		};

		const solanaSignToGetToken = signToGetToken as ISolanaSignToGetToken;
		const isSolana = !!solanaSignToGetToken.solanaSignedMessage;

		const isSAFE = isGSafeConnector;
		let siweMessage,
			safeMessage: any = null;
		if (isSAFE && secondarySignerAddress) {
			siweMessage =
				(await signWithEvm(
					secondarySignerAddress,
					chainId!,
					connector,
				)) || {};
			safeMessage = await createSiweMessage(
				safeAddress!,
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
						console.error({ error });
					}

					if (sessionPending) {
						console.log('Gnosis Safe Session pending');
						await returnToGnosisSafe();
						return Promise.reject('Gnosis Safe Session pending');
					}
					if (!sessionPending && !!activeSafeToken) {
						// returns active token - SUCCESS
						saveTokenToLocalstorage(safeAddress!, activeSafeToken);
						return activeSafeToken;
					}

					await returnToGnosisSafe();

					let _safeSignature;
					try {
						_safeSignature = await signMessage(wagmiConfig, {
							message: safeMessage.message,
						});
					} catch (error) {
						// user will close the transaction but it will create anyway
						console.error({ error });
					}
					const safeMessageTimestamp = new Date().getTime();
					// small delay to allow Safe service to index the message
					await new Promise(resolve => setTimeout(resolve, 1500));
					// calls the backend to create gnosis safe token
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
						return safeToken?.jwt;
					} else {
						return Promise.reject('Signing pending');
					}
				} else if (!isSAFE) {
					return currentUserToken;
				}
			} else {
				return Promise.reject('Signing failed');
			}
		} catch (error) {
			console.error({ error });
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

export const startChainvineReferral = createAsyncThunk(
	'user/startChainvineReferral',
	async ({ address }: IChainvineSetReferral, { dispatch }) => {
		try {
			const res = await backendGQLRequest(REGISTER_ON_CHAINVINE);
			dispatch(fetchUserByAddress(address));
			return res?.payload;
		} catch (error) {
			console.error({ error });
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
			console.error({ error });
			return Promise.reject('Referral start failed');
		}
	},
);
