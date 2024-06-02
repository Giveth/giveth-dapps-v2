import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendGQLRequest } from '@/helpers/requests';
import { FETCH_QF_ROUNDS_QUERY } from '@/apollo/gql/gqlQF';
import { FETCH_MAIN_CATEGORIES } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';

export const fetchMainCategories = createAsyncThunk(
	'general/fetchMainCategories',
	async () => {
		return backendGQLRequest(FETCH_MAIN_CATEGORIES);
	},
);

export const fetchActiveQFRounds = createAsyncThunk(
	'general/fetchQFRounds',
	async () => {
		const {
			data: { qfRounds },
		} = await client.query({
			query: FETCH_QF_ROUNDS_QUERY,
			variables: { activeOnly: true },
			fetchPolicy: 'no-cache',
		});
		return qfRounds;
	},
);
