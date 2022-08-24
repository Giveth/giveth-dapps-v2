import { createSlice } from '@reduxjs/toolkit';
import { fetchNotificationInfoAsync } from './notification.thunks';

import type { INotificationState } from './notification.types';

export const defaultNotificationValues: INotificationState = {
	general: 0,
	givEconomyRelated: 0,
	projectsRelated: 0,
	lastNotificationId: '0',
	total: 0,
};

const initialState: {
	NotificationInfo: INotificationState;
	isLoaded: boolean;
} = {
	NotificationInfo: defaultNotificationValues,
	isLoaded: false,
};

export const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(
			fetchNotificationInfoAsync.fulfilled,
			(state, action) => {
				state.NotificationInfo = action.payload;
			},
		);
	},
});

export default notificationSlice.reducer;
