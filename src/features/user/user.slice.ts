import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import links from '@/lib/constants/links';
import { IUser } from '@/apollo/types/types';

const initialState: {
    user?: IUser;
    isEnabled: boolean;
    isSignedIn: boolean;
} = {
    user: undefined,
    isEnabled: false,
    isSignedIn: false,
};

export const fetchUserByAddress = createAsyncThunk(
    'user/fetchUser',
    async (address: any) => {
        console.log('Link', links.BACKEND);
        try {
            const user = await fetch(links.BACKEND, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                query {
                    userByAddress(address: "${address}") {
                      lastName
                    }
                  }
                `,
                }),
            });
            return user.json();
        } catch (error) {
            console.log('Error');
        }
    },
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchUserByAddress.fulfilled, (state, action) => {
            console.log('action', action.payload);
            console.log('state', state);
        });
    },
});

export default userSlice.reducer;
