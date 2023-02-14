import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationCount } from './notification.services';

export const fetchNotificationCountAsync = createAsyncThunk(
	'notification/fetchNotificationCount',
	async (address: string) => {
		const response = await fetchNotificationCount(address);
		// The value we return becomes the `fulfilled` action payload
		return response;
	},
);
