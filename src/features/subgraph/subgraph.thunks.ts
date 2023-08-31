import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	fetchMainnetInfo,
	fetchGnosisInfo,
	fetchOptimismInfo,
	fetchChainInfo,
} from './subgraph.services';
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
export const fetchOptimismInfoAsync = createAsyncThunk(
	'subgraph/fetchOptimismInfo',
	async (userAddress?: string) => {
		const response = await fetchOptimismInfo(userAddress);
		return { ...response, isLoaded: true };
	},
);

export const fetchGnosisInfoAsync = createAsyncThunk(
	'subgraph/fetchGnosisInfo',
	async (userAddress?: string) => {
		const response = await fetchGnosisInfo(userAddress);
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
