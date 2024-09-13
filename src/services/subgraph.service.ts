import { captureException } from '@sentry/nextjs';
import { Address } from 'viem';
import config from '@/configuration';
import { gqlRequest } from '@/helpers/requests';
import { SUBGRAPH_METADATA_QUERY } from '@/lib/subgraph/subgraph.queries';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import type { ISubgraphState, ITokenAllocation } from '@/types/subgraph';

export const fetchSubgraph = async (
	query: string,
	network: number,
): Promise<any> => {
	const reqBody = { query };
	let uri = config.EVM_NETWORKS_CONFIG[network]?.subgraphAddress;
	if (!uri) {
		console.error('Network is not Defined in fetchSubgraph!');
		return {};
	}
	const res = await fetch(uri, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(reqBody),
	});
	const { data } = await res.json();
	return data;
};

export const getHistory = async (
	network: number,
	address: string,
	from?: number,
	count?: number,
): Promise<ITokenAllocation[]> => {
	const networkConfig = config.EVM_NETWORKS_CONFIG[network];
	let tokenDistroAddress = networkConfig?.TOKEN_DISTRO_ADDRESS;
	let uri = networkConfig?.subgraphAddress;
	if (!tokenDistroAddress || !uri) {
		console.error('Network is not Defined in getHistory!');
		return [];
	}
	const query = `{
		tokenAllocations(
			skip: ${from}, 
			first:${count},
			orderBy: timestamp,
			orderDirection: desc,
			where: { recipient: "${address.toLowerCase()}", tokenDistroAddress: "${tokenDistroAddress.toLowerCase()}"}
	) {
		recipient
		amount
		timestamp
		txHash
		distributor
	  }
	}`;
	try {
		const { data } = await gqlRequest(uri, false, query);
		const { tokenAllocations } = data;
		return tokenAllocations;
	} catch (error) {
		console.error('Error in getting History from Subgraph', error);
		captureException(error, {
			tags: {
				section: 'getHistory',
			},
		});
		return [];
	}
};

export const getUniswapV3TokenURI = async (
	tokenId: string | number,
): Promise<string> => {
	try {
		if (!config.MAINNET_CONFIG.subgraphAddress) {
			throw new Error('Subgraph address not found');
		}
		const query = `{
			uniswapPosition(id: "${tokenId}"){
				tokenURI
			}
		  }`;
		const body = { query };

		const res = await fetch(config.MAINNET_CONFIG.subgraphAddress, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();

		return data?.data?.uniswapPosition?.tokenURI || '';
	} catch (error: any) {
		console.log('Error in fetching Uniswap V3 Token URI', error.message);
		return '';
	}
};

export const fetchSubgraphData = async (
	chainId?: number,
	address?: Address,
): Promise<ISubgraphState> => {
	if (!chainId || !address) return {} as ISubgraphState;
	let response;
	let uri = config.EVM_NETWORKS_CONFIG[chainId]?.subgraphAddress;

	if (!uri) {
		response = {};
	} else {
		response = await fetchSubgraph(
			SubgraphQueryBuilder.getChainQuery(chainId, address),
			chainId,
		);
	}
	return transformSubgraphData({
		...response,
		networkNumber: chainId,
	});
};

export const fetchLatestIndexedBlock = async (chainId: number) => {
	let response;
	let uri = config.EVM_NETWORKS_CONFIG[chainId]?.subgraphAddress;

	if (!uri) {
		response = {};
	} else {
		response = await fetchSubgraph(SUBGRAPH_METADATA_QUERY, chainId);
		return response._meta.block.number;
	}
	return response;
};
