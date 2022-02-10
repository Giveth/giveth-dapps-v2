import { ethers } from 'ethers';
import { initializeApollo } from '../apollo/apolloClient';
import { LOGIN_USER } from '../apollo/gql/gqlAuth';
import { IUserByAddress } from '../apollo/types/gqlTypes';

const apolloClient = initializeApollo();

export async function getToken(
	walletAddress: string | null | undefined,
	signature: string,
	networkId: number | undefined,
	user?: IUserByAddress,
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
			console.log('Error in token login: ', error);
		}
	} else {
		console.log('Input data for getting token is incomplete');
	}
}

export const fetchPrice = async (
	chain: string,
	tokenAddress: string | undefined,
	catchFunction: any,
) => {
	try {
		const fetchCall = await fetch(
			`https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${tokenAddress}&vs_currencies=usd`,
		);
		const data = await fetchCall.json();
		return parseFloat(data[Object.keys(data)[0]]?.usd?.toFixed(2));
	} catch (error) {
		catchFunction(0);
	}
};
