import { createSlice } from '@reduxjs/toolkit';
import { fetchMainCategories, fetchQFRounds } from './general.thunk';
import { IMainCategory, IQFRound } from '@/apollo/types/types';
import { QF_SPECIFIC_CATEGORIES } from '@/configuration';
import type { PayloadAction } from '@reduxjs/toolkit';

export enum ETheme {
	NOT_INITIATED,
	Light = 1,
	Dark,
}

const initialState = {
	theme: ETheme.NOT_INITIATED,
	showHeader: true,
	showFooter: true,
	mainCategories: [] as IMainCategory[],
	qfRounds: [] as IQFRound[],
	activeQFRound: null as IQFRound | null,
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
	extraReducers: builder => {
		builder.addCase(fetchMainCategories.fulfilled, (state, action) => {
			state.mainCategories = action.payload.data.mainCategories.filter(
				(mainCategory: IMainCategory) =>
					!QF_SPECIFIC_CATEGORIES.some(c => c === mainCategory.slug),
			);
		});
		builder.addCase(fetchQFRounds.fulfilled, (state, action) => {
			state.qfRounds = action.payload.data.qfRounds;
			state.activeQFRound =
				state.qfRounds.find(round => round.isActive) || null;
		});
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
