import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationCount } from './notification.services';

const NOTIFICATION_ENABLED =
	process.env.NEXT_PUBLIC_NOTIFICATION_CENTER_ENABLED;

export const fetchNotificationCountAsync = createAsyncThunk(
	'notification/fetchNotificationCount',
	async (address: string) => {
		// SENDING ZERO FOR NOW ON ALL VALUES
		if (NOTIFICATION_ENABLED === 'true') {
			const response = await fetchNotificationCount(address);
			// The value we return becomes the `fulfilled` action payload
			return response;
		}
		return {
			general: 0,
			givEconomyRelated: 0,
			projectsRelated: 0,
			supportedProjects: 0,
			lastNotificationId: 0,
			total: 0,
		};
	},
);
