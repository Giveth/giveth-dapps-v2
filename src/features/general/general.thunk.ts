import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendGQLRequest } from '@/helpers/requests';
import { FETCH_MAIN_CATEGORIES } from './genera.queries';

export const fetchMainCategories = createAsyncThunk(
	'general/fetchMainCategories',
	async () => {
		return backendGQLRequest(FETCH_MAIN_CATEGORIES);
	},
);
