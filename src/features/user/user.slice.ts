import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/apollo/types/types';
import { fetchUserByAddress, signToGetToken } from './user.thunks';
import StorageLabel from '@/lib/localStorage';

const initialState: {
	userData?: IUser;
	token?: string;
	isEnabled: boolean;
	isSignedIn: boolean;
} = {
	userData: undefined,
	token: undefined,
	isEnabled: false,
	isSignedIn: false,
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
		signOut: state => {
			localStorage.removeItem(StorageLabel.USER);
			localStorage.removeItem(StorageLabel.TOKEN);
			state.token = undefined;
			state.isSignedIn = false;
			state.userData = undefined;
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
					state.userData = action.payload.data?.userByAddress;
				},
			)
			.addCase(signToGetToken.fulfilled, (state, action) => {
				console.log('SignIn Action', action);
				state.token = action.payload;
				localStorage.setItem(StorageLabel.TOKEN, action.payload);
				state.isSignedIn = true;
			});
	},
});
export const { setIsEnabled, setIsSignedIn, setToken, signOut } =
	userSlice.actions;
export default userSlice.reducer;
