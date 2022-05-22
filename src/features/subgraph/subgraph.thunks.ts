import { createAsyncThunk } from '@reduxjs/toolkit';
import config from '@/configuration';
import { fetchXDaiInfo, fetchMainnetInfo } from './subgraph.services';
import { ICurrentInfo } from './subgraph.types';

export const fetchXDaiInfoAsync = createAsyncThunk(
	'subgraph/fetchXDaiInfo',
	async (userAddress: string) => {
		const response = await fetchXDaiInfo(userAddress);
		// The value we return becomes the `fulfilled` action payload
		return response;
	},
);

export const fetchMainnetInfoAsync = createAsyncThunk(
	'subgraph/fetchMainnetInfo',
	async (userAddress: string) => {
		const response = await fetchXDaiInfo(userAddress);
		// The value we return becomes the `fulfilled` action payload
		return response;
	},
);

export const fetchCurrentInfoAsync = createAsyncThunk(
	'subgraph/fetchCurrentInfo',
	async (props: ICurrentInfo) => {
		const response =
			props.chainId === config.MAINNET_NETWORK_NUMBER
				? await fetchMainnetInfo(props.userAddress)
				: await fetchXDaiInfo(props.userAddress);
		// The value we return becomes the `fulfilled` action payload
		return { response, chainId: props.chainId };
	},
);
