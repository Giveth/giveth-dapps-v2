import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationInfo } from './notification.services';

export const fetchNotificationInfoAsync = createAsyncThunk(
	'notification/fetchNotificationInfo',
	async () => {
		const response = await fetchNotificationInfo();
		// The value we return becomes the `fulfilled` action payload
		return response;
	},
);
