import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationCount } from './notification.services';

export const fetchNotificationCountAsync = createAsyncThunk(
	'notification/fetchNotificationCount',
	async (address: string) => {
		// TODO: SOLUTION FOR NOW BUT WE SHOULD BRING IT BACK LATER
		// const response = await fetchNotificationCount(address);
		// The value we return becomes the `fulfilled` action payload
		// return response;
		return 0;
	},
);
