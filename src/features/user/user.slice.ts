import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/apollo/types/types';
import { fetchUserByAddress, signToGetToken, signOut } from './user.thunks';
import StorageLabel from '@/lib/localStorage';
import { compareAddresses } from '@/lib/helpers';

const initialState: {
	userData?: IUser;
	token?: string;
	isEnabled: boolean;
	isSignedIn: boolean;
	balance: string | null;
} = {
	userData: undefined,
	token: undefined,
	isEnabled: false,
	isSignedIn: false,
	balance: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setIsEnabled: (state, action: PayloadAction<boolean>) => {
			state.isEnabled = action.payload;
		},
		setIsSignedIn: (state, action: PayloadAction<boolean>) => {
			state.isSignedIn = action.payload;
		},
		setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
		setBalance: (state, action: PayloadAction<string | null>) => {
			state.balance = action.payload;
		},
		incrementLikedProjectsCount: state => {
			if (state.userData) {
				state.userData.likedProjectsCount =
					(state.userData.likedProjectsCount || 0) + 1;
			}
		},
		decrementLikedProjectsCount: state => {
			if (state.userData) {
				state.userData.likedProjectsCount =
					(state.userData.likedProjectsCount || 1) - 1;
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(
				fetchUserByAddress.fulfilled,
				(
					state,
					action: PayloadAction<{
						data: {
							userByAddress: IUser;
						};
					}>,
				) => {
					const localAddress = localStorage.getItem(
						StorageLabel.USER,
					);
					if (
						compareAddresses(
							localAddress,
							action.payload.data?.userByAddress?.walletAddress,
						)
					) {
						state.token =
							localStorage.getItem(StorageLabel.TOKEN) ??
							undefined;
					} else {
						state.token = undefined;
						state.isSignedIn = false;
						localStorage.removeItem(StorageLabel.USER);
						localStorage.removeItem(StorageLabel.TOKEN);
					}
					state.userData = action.payload.data?.userByAddress;
				},
			)
			.addCase(signToGetToken.fulfilled, (state, action) => {
				state.token = action.payload;
				localStorage.setItem(
					StorageLabel.USER,
					action.meta.arg.address?.toLocaleLowerCase() || '',
				);
				localStorage.setItem(StorageLabel.TOKEN, action.payload);
				state.isSignedIn = true;
			})
			.addCase(signOut.fulfilled, state => {
				localStorage.removeItem(StorageLabel.USER);
				localStorage.removeItem(StorageLabel.TOKEN);
				state.token = undefined;
				state.isSignedIn = false;
			});
	},
});
export const {
	setIsEnabled,
	setIsSignedIn,
	setToken,
	setBalance,
	incrementLikedProjectsCount,
	decrementLikedProjectsCount,
} = userSlice.actions;
export default userSlice.reducer;
