import { captureException } from '@sentry/nextjs';
import config from '@/configuration';
import { ITokenAllocation } from '@/types/subgraph';
import { gqlRequest } from '@/helpers/requests';

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
};
