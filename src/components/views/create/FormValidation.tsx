import { client } from '@/apollo/apolloClient';
import {
	TITLE_IS_VALID,
	WALLET_ADDRESS_IS_VALID,
} from '@/apollo/gql/gqlProjects';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';

export const TitleValidation = async (title: string) => {
	if (title.length < 1) {
		throw { message: 'Title is required' };
	} else {
		return client
			.query({
				query: TITLE_IS_VALID,
				variables: {
					title,
				},
			})
			.then(() => {
				return;
			})
			.catch((err: any) => {
				throw err;
			});
	}
};

export const WalletAddressValidation = async (
	walletAddress: string,
	web3: any,
) => {
	let address = walletAddress;
	if (isAddressENS(walletAddress)) {
		address = await getAddressFromENS(walletAddress, web3);
		if (!address) {
			throw { message: 'Invalid ENS address' };
		}
	} else if (walletAddress.length !== 42) {
		throw { message: 'Eth address not valid' };
	}
	return client
		.query({
			query: WALLET_ADDRESS_IS_VALID,
			variables: {
				address,
			},
		})
		.then(() => {
			return;
		})
		.catch((err: any) => {
			throw err;
		});
};
