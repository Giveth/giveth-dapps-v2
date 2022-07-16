import { client } from '@/apollo/apolloClient';
import {
	TITLE_IS_VALID,
	WALLET_ADDRESS_IS_VALID,
} from '@/apollo/gql/gqlProjects';
import config from '@/configuration';
import { getAddressFromENS, isAddressENS, isAddressValid } from '@/lib/wallet';

export const titleValidation = async (title: string) => {
	try {
		const { data } = await client.query({
			query: TITLE_IS_VALID,
			variables: { title },
		});
		return data.isValidTitleForProject;
	} catch (error: any) {
		return error.message;
	}
};

export const walletAddressValidation = async (
	walletAddress: string,
	web3: any,
	chainId?: number, // User wallet provider chainId
	networkId?: number, // Input Ethereum or Gnosis address
) => {
	let address = walletAddress;

	const queryFunc = async () => {
		try {
			const { data } = await client.query({
				query: WALLET_ADDRESS_IS_VALID,
				variables: { address },
			});
			return data.walletAddressIsValid;
		} catch (error: any) {
			return error.message;
		}
	};

	if (isAddressENS(walletAddress)) {
		if (networkId !== config.PRIMARY_NETWORK.id) {
			return 'ENS is only supported on Ethereum Mainnet';
		}
		if (chainId !== 1) {
			return 'Please switch to the Ethereum Mainnet to handle ENS';
		}
		const _address = await getAddressFromENS(walletAddress, web3);
		if (!_address) {
			return 'Invalid ENS address';
		}
		address = _address;
		return await queryFunc();
	} else if (!(await isAddressValid(walletAddress, web3))) {
		return 'Eth address not valid';
	} else {
		return await queryFunc();
	}
};
