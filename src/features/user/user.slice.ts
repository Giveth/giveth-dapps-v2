import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/apollo/types/types';
import { fetchUserByAddress } from './user.thunks';

const initialState: {
	userData?: IUser;
	isEnabled: boolean;
	isSignedIn: boolean;
} = {
	userData: undefined,
	isEnabled: false,
	isSignedIn: false,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(
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
		);
	},
});

export default userSlice.reducer;
