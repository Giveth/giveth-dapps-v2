import { CAUSE_TITLE_IS_VALID } from '@/apollo/gql/gqlCauses';
import { backendGQLRequest } from '@/helpers/requests';

export const gqlCauseTitleValidation = async (
	title: string,
	locale: string,
) => {
	try {
		const { data, errors } = await backendGQLRequest(
			CAUSE_TITLE_IS_VALID,
			{ title },
			{ 'accept-language': locale },
		);
		if (errors) throw new Error(errors[0].message);
		return data.isValidTitleForCause;
	} catch (error: any) {
		return error.message;
	}
};
