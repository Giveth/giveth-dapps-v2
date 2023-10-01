import { createAsyncThunk } from '@reduxjs/toolkit';
import { print } from 'graphql';
import { backendGQLRequest } from '@/helpers/requests';
import { FETCH_MAIN_CATEGORIES } from './genera.queries';
import { FETCH_QF_ROUNDS } from '@/apollo/gql/gqlQF';

export const fetchMainCategories = createAsyncThunk(
	'general/fetchMainCategories',
	async () => {
		return backendGQLRequest(FETCH_MAIN_CATEGORIES);
	},
);

export const fetchQFRounds = createAsyncThunk(
	'general/fetchQFRounds',
	async () => {
		return backendGQLRequest(print(FETCH_QF_ROUNDS));
	},
);
