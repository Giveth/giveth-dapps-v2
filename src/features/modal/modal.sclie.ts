import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	showWalletModal: false,
	showWelcomeModal: false,
	showFirstWelcomeModal: false,
	showSignWithWallet: false,
	showCompleteProfile: false,
};

export const ModalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setShowSignWithWallet: (state, action: PayloadAction<boolean>) => {
			state.showSignWithWallet = action.payload;
		},
		setShowWalletModal: (state, action: PayloadAction<boolean>) => {
			state.showWalletModal = action.payload;
		},
		setShowFirstWelcomeModal: (state, action: PayloadAction<boolean>) => {
			state.showFirstWelcomeModal = action.payload;
		},
		setShowCompleteProfile: (state, action: PayloadAction<boolean>) => {
			state.showCompleteProfile = action.payload;
		},
		setShowWelcomeModal: (state, action: PayloadAction<boolean>) => {
			state.showWelcomeModal = action.payload;
		},
	},
});

export const {
	setShowCompleteProfile,
	setShowFirstWelcomeModal,
	setShowSignWithWallet,
	setShowWalletModal,
	setShowWelcomeModal,
} = ModalSlice.actions;

export default ModalSlice.reducer;
