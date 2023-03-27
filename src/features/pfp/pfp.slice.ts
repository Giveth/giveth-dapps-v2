import { createSlice } from '@reduxjs/toolkit';

interface IPfpInfo {}

interface IPfpState {
	[key: string]: IPfpInfo | undefined;
}

const initialState: {
	pendingList: string[];
	List: IPfpState[];
} = {
	pendingList: [],
	List: [],
};

export const pfpSlice = createSlice({
	name: 'pfp',
	initialState,
	reducers: {
		addAccountToPfpPending: (state, action) => {
			state.pendingList.push(action.payload.toLowerCase());
		},
		clearPfpPendingList: state => {
			state.pendingList = [];
		},
		updatePfpList: (state, action) => {
			state.List.push(action.payload);
		},
	},
});

export const { addAccountToPfpPending, clearPfpPendingList, updatePfpList } =
	pfpSlice.actions;

export default pfpSlice.reducer;
