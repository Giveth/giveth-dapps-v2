import { createSlice } from '@reduxjs/toolkit';
import { IGiverPFPToken } from '@/apollo/types/types';

export interface IPfpList {
	[key: string]: IGiverPFPToken | false;
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
	},
});

export const { addAccountToPfpPending, clearPfpPendingList, updatePfpList } =
	pfpSlice.actions;

export default pfpSlice.reducer;
