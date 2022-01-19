import config from '@/configuration';
import { ITokenAllocation } from '@/types/subgraph';

export const fetchSubgraph = async (
	query: string,
	network: number,
): Promise<any> => {
	const reqBody = { query };
	let uri;
	if (network === config.MAINNET_NETWORK_NUMBER) {
		uri = config.MAINNET_CONFIG.subgraphAddress;
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		uri = config.XDAI_CONFIG.subgraphAddress;
	} else {
		console.error('Network is not Defined!');
		return {};
	}
	const res = await fetch(uri, {
		method: 'POST',
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
	const query = `{
		tokenAllocations(skip: ${from}, first:${count} ,orderBy: timestamp, orderDirection: desc, , where: { recipient: "${address.toLowerCase()}"  }) {
		recipient
		amount
		timestamp
		txHash
		distributor
	  }
	}`;
	const body = { query };
	let uri;
	if (network === config.MAINNET_NETWORK_NUMBER) {
		uri = config.MAINNET_CONFIG.subgraphAddress;
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		uri = config.XDAI_CONFIG.subgraphAddress;
	} else {
		console.error('Network is not Defined!');
		return [];
	}
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const data = await res.json();
		const { tokenAllocations } = data.data;
		return tokenAllocations;
	} catch (error) {
		console.error('Error in getting History from Subgraph', error);
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
