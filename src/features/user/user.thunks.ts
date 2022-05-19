import { createAsyncThunk } from '@reduxjs/toolkit';
import gqlRequest from '@/helpers/gqlRequest';
import { getUserByAddress } from './user.queries';

export const fetchUserByAddress = createAsyncThunk(
	'user/fetchUser',
	async (address: string) => {
		return gqlRequest(getUserByAddress, { address });
	},
);
