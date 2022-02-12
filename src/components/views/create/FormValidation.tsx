import { client } from '@/apollo/apolloClient';
import { TITLE_IS_VALID } from '@/apollo/gql/gqlProjects';

export const TitleValidationError = async (title: string) => {
	if (title.length < 1) {
		return 'Title is required';
	}
	client
		.query({
			query: TITLE_IS_VALID,
			variables: {
				title,
			},
		})
		.then(() => {
			return false;
		})
		.catch((err: any) => {
			console.log(err);
			return 'Title is already taken';
		});
};
