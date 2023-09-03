import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChainInfo } from './subgraph.services';
import { ICurrentInfo } from './subgraph.types';
import { chainInfoNames } from './subgraph.helper';

export const fetchChainInfoAsync = createAsyncThunk(
	'subgraph/fetchChainInfo',
	async ({ userAddress, chainId }: ICurrentInfo) => {
		const response = await fetchChainInfo(chainId, userAddress);
		return {
			response: { ...response, isLoaded: true },
			chainId: chainId,
		};
	},
);

export const fetchCurrentInfoAsync = createAsyncThunk(
	'subgraph/fetchCurrentInfo',
	async ({ userAddress, chainId }: ICurrentInfo) => {
		const response = await fetchChainInfo(chainId, userAddress);
		return {
			response: { ...response, isLoaded: true },
			chainId: chainId,
		};
	},
);

export const fetchAllInfoAsync = createAsyncThunk(
	'subgraph/fetchAllInfo',
	async ({ userAddress, chainId }: ICurrentInfo) => {
		const chainIds = Object.keys(chainInfoNames).map(Number);
		const res = await Promise.all(
			chainIds.map(id => fetchChainInfo(id, userAddress)),
		);

		const response = {
			mainnetValues: res[0],
			gnosisValues: res[1],
			optimismValues: res[2],
		};

		return {
			response: { ...response, isLoaded: true },
			chainId: chainId,
		};
	},
);
