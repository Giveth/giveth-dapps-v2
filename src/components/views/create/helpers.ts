import { client } from '@/apollo/apolloClient';
import {
	TITLE_IS_VALID,
	WALLET_ADDRESS_IS_VALID,
} from '@/apollo/gql/gqlProjects';
import { backendGQLRequest } from '@/helpers/requests';

export const gqlTitleValidation = async (title: string, locale: string) => {
	try {
		const { data, errors } = await backendGQLRequest(
			TITLE_IS_VALID,
			{ title },
			{ 'accept-language': locale },
		);
		if (errors) throw new Error(errors[0].message);
		return data.isValidTitleForProject;
	} catch (error: any) {
		return error.message;
	}
};

export const gqlAddressValidation = async (address: string) => {
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
