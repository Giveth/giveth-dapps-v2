import { createSlice } from '@reduxjs/toolkit';
import { fetchNotificationCountAsync } from './notification.thunks';

import type { INotificationCountState } from './notification.types';

export const defaultNotificationValues: INotificationCountState = {
	general: 0,
	givEconomyRelated: 0,
	projectsRelated: 0,
	supportedProjects: 0,
	lastNotificationId: 0,
	total: 0,
};

const initialState: {
	notificationInfo: INotificationCountState;
	isLoaded: boolean;
} = {
	notificationInfo: defaultNotificationValues,
	isLoaded: false,
};

export const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(
			fetchNotificationCountAsync.fulfilled,
			(state, action) => {
				state.notificationInfo = action.payload;
			},
		);
	},
});

export default notificationSlice.reducer;
