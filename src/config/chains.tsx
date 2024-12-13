import {
	celoAlfajores,
	gnosis,
	goerli,
	sepolia,
	optimismSepolia,
	polygon,
	arbitrumSepolia,
	celo,
	classic,
	mainnet,
	optimism,
	arbitrum,
	base,
	baseSepolia,
	polygonZkEvm,
	polygonZkEvmCardona,
} from '@wagmi/core/chains';
import { type Chain } from 'viem';

const EXPLORER_URLS: Record<Chain['id'], string> = {
	[polygon.id]: 'https://polygon.blockscout.com',
	[goerli.id]: 'https://eth-goerli.blockscout.com',
	[gnosis.id]: 'https://gnosis.blockscout.com',
	[optimismSepolia.id]: 'https://optimism-sepolia.blockscout.com',
	[celoAlfajores.id]: 'https://explorer.celo.org/alfajores',
	[arbitrumSepolia.id]: 'https://sepolia-explorer.arbitrum.io',
	[celo.id]: 'https://explorer.celo.org/mainnet',
	[classic.id]: 'https://etc.blockscout.com',
	[mainnet.id]: 'https://eth.blockscout.com',
	[optimism.id]: 'https://optimism.blockscout.com',
	[arbitrum.id]: 'https://arbitrum.blockscout.com',
	[sepolia.id]: 'https://eth-sepolia.blockscout.com',
	[base.id]: 'https://base.blockscout.com',
	[baseSepolia.id]: 'https://base-sepolia.blockscout.com',
	[polygonZkEvm.id]: 'https://zkevm.blockscout.com',
	[polygonZkEvmCardona.id]: 'https://explorer-ui.cardona.zkevm-rpc.com',
};

function updateBlockExplorers(chain: Chain): Chain {
	if (!EXPLORER_URLS[chain.id]) {
		return chain;
	}
	return {
		...chain,
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: EXPLORER_URLS[chain.id],
			},
		},
	};
}

const chains: Record<string, Chain> = Object.fromEntries(
	Object.entries({
		celoAlfajores,
		gnosis,
		goerli,
		sepolia,
		optimismSepolia,
		polygon,
		arbitrumSepolia,
		celo,
		classic,
		mainnet,
		optimism,
		arbitrum,
		base,
		baseSepolia,
		polygonZkEvm,
		polygonZkEvmCardona,
	}).map(([key, chain]) => [key, updateBlockExplorers(chain)]),
);

export default chains;
