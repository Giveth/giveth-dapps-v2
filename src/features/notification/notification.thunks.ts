import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationCount } from './notification.services';

export const fetchNotificationCountAsync = createAsyncThunk(
	'notification/fetchNotificationCount',
	async () => {
		const response = await fetchNotificationCount();
		// The value we return becomes the `fulfilled` action payload
		return response;
	},
);
