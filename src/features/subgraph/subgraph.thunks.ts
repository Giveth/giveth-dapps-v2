import { createAsyncThunk } from '@reduxjs/toolkit';
import config from '@/configuration';
import { fetchMainnetInfo, fetchXDaiInfo } from './subgraph.services';
import { ICurrentInfo } from './subgraph.types';

export const fetchXDaiInfoAsync = createAsyncThunk(
	'subgraph/fetchXDaiInfo',
	async (userAddress?: string) => {
		const response = await fetchXDaiInfo(userAddress);
		return { ...response, isLoaded: true };
	},
);

export const fetchMainnetInfoAsync = createAsyncThunk(
	'subgraph/fetchMainnetInfo',
	async (userAddress?: string) => {
		const response = await fetchMainnetInfo(userAddress);
		return { ...response, isLoaded: true };
	},
);

export const fetchCurrentInfoAsync = createAsyncThunk(
	'subgraph/fetchCurrentInfo',
	async (props: ICurrentInfo) => {
		const response =
			props.chainId === config.MAINNET_NETWORK_NUMBER
				? await fetchMainnetInfo(props.userAddress)
				: await fetchXDaiInfo(props.userAddress);
		return {
			response: { ...response, isLoaded: true },
			chainId: props.chainId,
		};
	},
);
