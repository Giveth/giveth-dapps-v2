import { client } from '@/apollo/apolloClient';
import {
	TITLE_IS_VALID,
	WALLET_ADDRESS_IS_VALID,
} from '@/apollo/gql/gqlProjects';

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

export const addressValidation = async (address: string) => {
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
