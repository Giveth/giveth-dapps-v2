import { createAsyncThunk } from '@reduxjs/toolkit';
import { FETCH_QF_ROUNDS_QUERY } from '@/apollo/gql/gqlQF';
import { client } from '@/apollo/apolloClient';
import { FETCH_MAIN_CATEGORIES } from '@/apollo/gql/gqlProjects';

export const fetchMainCategories = createAsyncThunk(
	'general/fetchMainCategories',
	async () => {
		const {
			data: { mainCategories },
		} = await client.query({
			query: FETCH_MAIN_CATEGORIES,
			variables: { activeOnly: true },
			fetchPolicy: 'no-cache',
		});
		return mainCategories;
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
