import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserByAddress } from './user.queries';
import links from '@/lib/constants/links';

export const fetchUserByAddress = createAsyncThunk(
	'user/fetchUser',
	async (address: string) => {
		console.log('Link', links.BACKEND);
		console.log('address', address);
		try {
			const userData = await fetch(links.BACKEND, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: getUserByAddress(address),
				}),
			});
			return userData.json();
		} catch (error) {
			console.log('Error');
		}
	},
);
