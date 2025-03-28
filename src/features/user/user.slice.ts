import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserWithPassport, IPassportInfo } from '@/apollo/types/types';
import {
	fetchUserByAddress,
	signToGetToken,
	signOut,
	startChainvineReferral,
	countReferralClick,
} from './user.thunks';
import StorageLabel from '@/lib/localStorage';
import { compareAddresses } from '@/lib/helpers';
import { RootState } from '../store';
import { getTokens } from '@/helpers/user';

const initialState: {
	userData?: IUserWithPassport;
	token?: string;
	isEnabled: boolean;
	isSignedIn: boolean;
	isLoading: boolean;
	isUserFullFilled: boolean;
} = {
	userData: undefined,
	token: undefined,
	isEnabled: false,
	isSignedIn: false,
	isLoading: true,
	isUserFullFilled: false,
};

type UserStateType = RootState['user'];

const signOutUser = (state: UserStateType) => {
	console.log(Date.now(), 'signOutUser in user slice');
	localStorage.removeItem(StorageLabel.USER);
	localStorage.removeItem(StorageLabel.TOKEN);
	const tokens = getTokens();
	if (state.userData?.walletAddress)
		delete tokens[state.userData?.walletAddress?.toLowerCase()];
	localStorage.setItem(StorageLabel.TOKENS, JSON.stringify(tokens));
	state.token = undefined;
	state.isSignedIn = false;
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
		setBoostedProjectsCount: (state, action: PayloadAction<number>) => {
			if (state.userData) {
				state.userData.boostedProjectsCount = action.payload;
			}
		},
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setUserMBDScore: (state, action: PayloadAction<number>) => {
			if (state.userData) {
				state.userData.activeQFMBDScore = action.payload;
			}
		},
		setUserPassport: (state, action: PayloadAction<IPassportInfo>) => {
			if (state.userData) {
				state.userData.passportScore = action.payload.passportScore;
				state.userData.passportStamps = action.payload.passportStamps;
				state.userData.activeQFMBDScore =
					action.payload.activeQFMBDScore;
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchUserByAddress.pending, state => {
				state.isLoading = true;
			})
			.addCase(
				fetchUserByAddress.fulfilled,
				(
					state,
					action: PayloadAction<{
						data: {
							userByAddress: IUserWithPassport;
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
					if (
						action.payload.data?.userByAddress?.isSignedIn === true
					) {
						state.isSignedIn = true;
					} else {
						signOutUser(state);
					}
					state.isLoading = false;
					state.isUserFullFilled = true;
				},
			)
			.addCase(fetchUserByAddress.rejected, state => {
				state.isLoading = false;
				state.isUserFullFilled = true;
			})
			.addCase(signToGetToken.fulfilled, (state, action) => {
				state.token = action.payload;
				state.isSignedIn = true;
			})
			.addCase(startChainvineReferral.pending, state => {
				state.isLoading = true;
			})
			.addCase(startChainvineReferral.fulfilled, state => {
				state.isLoading = false;
			})
			.addCase(countReferralClick.pending, state => {
				state.isLoading = true;
			})
			.addCase(countReferralClick.fulfilled, state => {
				state.isLoading = false;
			})
			//We want it to call when fulfilled and rejected
			.addCase(signOut.pending, state => {
				signOutUser(state);
			});
	},
});
export const {
	setIsEnabled,
	setIsSignedIn,
	setToken,
	setBoostedProjectsCount,
	setIsLoading,
	setUserMBDScore,
	setUserPassport,
} = userSlice.actions;
export default userSlice.reducer;
