import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export enum ETheme {
	Light = 1,
	Dark,
}

const initialState = {
	theme: ETheme.Light,
	showHeader: true,
	showFooter: true,
};

export const GeneralSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setDarkTheme: state => {
			state.theme = ETheme.Dark;
		},
		setLightTheme: state => {
			state.theme = ETheme.Light;
		},
		showHeaderFooter: state => {
			state.showHeader = true;
			state.showFooter = true;
		},
		hideHeaderFooter: state => {
			state.showHeader = false;
			state.showFooter = false;
		},
		setShowHeader: (state, action: PayloadAction<boolean>) => {
			state.showHeader = action.payload;
		},
		setShowFooter: (state, action: PayloadAction<boolean>) => {
			state.showFooter = action.payload;
		},
	},
});

export const {
	setDarkTheme,
	setLightTheme,
	showHeaderFooter,
	hideHeaderFooter,
	setShowHeader,
	setShowFooter,
} = GeneralSlice.actions;

export default GeneralSlice.reducer;
