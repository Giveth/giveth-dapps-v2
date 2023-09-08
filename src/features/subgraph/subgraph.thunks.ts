import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChainInfo } from './subgraph.services';
import { ICurrentInfo, ISubgraphState } from './subgraph.types';
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
		const chainValues = Object.values(chainInfoNames);
		const res = await Promise.all(
			chainIds.map(id => fetchChainInfo(id, userAddress)),
		);

		let response: {
			[key: string]: ISubgraphState;
		} = {};
		for (let i = 0; i < res.length; i++) {
			const element = res[i] as ISubgraphState;
			response[chainValues[i]] = element;
		}

		return {
			response: { ...response, isLoaded: true },
			chainId: chainId,
		};
	},
);
