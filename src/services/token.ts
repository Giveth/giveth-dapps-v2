import { ethers } from 'ethers';

import { captureException } from '@sentry/nextjs';
import { IUser } from '@/apollo/types/types';
import { initializeApollo } from '@/apollo/apolloClient';
import { LOGIN_USER } from '@/apollo/gql/gqlAuth';
import { showToastError } from '@/lib/helpers';
import config from '@/configuration';

const apolloClient = initializeApollo();

export async function getToken(
	walletAddress: string | null | undefined,
	signature: string,
	networkId: number | undefined,
	user?: IUser,
) {
	if (signature && walletAddress && networkId) {
		try {
			const mutate = {
				mutation: LOGIN_USER,
				variables: {
					walletAddress: ethers.utils.getAddress(walletAddress),
					signature,
					email: user?.email,
					avatar: user?.avatar,
					name: user?.name,
					hostname: window?.location.hostname,
					networkId,
				},
			};
			const { data } = await apolloClient.mutate(mutate);
			return data?.loginWallet?.token;
		} catch (error) {
			showToastError(error);
			captureException(error, {
				tags: {
					section: 'getToken',
				},
			});
		}
	} else {
		showToastError('Input data for getting token is incomplete');
	}
}

export const fetchPrice = async (
	chainId: number,
	tokenAddress: string | undefined,
	catchFunction: any,
) => {
	try {
		const chain =
			chainId === config.PRIMARY_NETWORK.id ? 'ethereum' : 'xdai';
		const fetchCall = await fetch(
			`https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${tokenAddress}&vs_currencies=usd`,
		);
		const data = await fetchCall.json();
		return parseFloat(data[Object.keys(data)[0]]?.usd?.toFixed(2));
	} catch (error) {
		catchFunction(0);
		captureException(error, {
			tags: {
				section: 'fetchPrice',
			},
		});
	}
};
