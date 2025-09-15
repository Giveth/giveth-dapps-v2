import { createAsyncThunk } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
import { QF_ROUNDS_QUERY } from '@/apollo/gql/gqlQF';
import { client } from '@/apollo/apolloClient';
import { MAIN_CATEGORIES_QUERY } from '@/apollo/gql/gqlProjects';

const MAIN_CATEGORIES_AND_ACTIVE_QF_ROUND_QUERY = gql`
	query fetchMainCategoriesAndQFRounds($slug: String, $activeOnly: Boolean, $sortBy: QfRoundsSortType) {
		${QF_ROUNDS_QUERY}
		${MAIN_CATEGORIES_QUERY}
	}
`;

export const fetchMainCategoriesAndActiveQFRound = createAsyncThunk(
	'general/fetchMainCategoriesAndActiveQFRound',
	async () => {
		const {
			data: { mainCategories, qfRounds },
		} = await client.query({
			query: MAIN_CATEGORIES_AND_ACTIVE_QF_ROUND_QUERY,
			variables: { activeOnly: true },
			fetchPolicy: 'no-cache',
		});
		return { mainCategories, qfRounds };
	},
);
