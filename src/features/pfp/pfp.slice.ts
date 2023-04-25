import { createSlice } from '@reduxjs/toolkit';
import { IGiverPFPToken } from '@/apollo/types/types';

export interface IPfpList {
	[key: string]: IGiverPFPToken | false | undefined;
}

interface IPfpPending {
	[key: string]: string;
}

const initialState: {
	pendingList: IPfpPending;
	List: IPfpList;
} = {
	pendingList: {},
	List: {},
};

export const pfpSlice = createSlice({
	name: 'pfp',
	initialState,
	reducers: {
		addAccountToPfpPending: (state, action) => {
			state.pendingList[action.payload.address.toLowerCase()] =
				action.payload.avatar;
		},
		clearPfpPendingList: state => {
			state.pendingList = {};
		},
		updatePfpList: (state, action) => {
			state.List = { ...state.List, ...action.payload };
		},
		removeUserFromList: (state, action) => {
			state.List[action.payload.address.toLowerCase()] = undefined;
		},
		updateUserFromList: (state, action) => {
			state.List[action.payload.address.toLowerCase()] = undefined;
			state.pendingList[action.payload.address.toLowerCase()] =
				action.payload.avatar;
		},
	},
});

export const {
	addAccountToPfpPending,
	clearPfpPendingList,
	updatePfpList,
	removeUserFromList,
	updateUserFromList,
} = pfpSlice.actions;

export default pfpSlice.reducer;
