import {
	celoAlfajores,
	gnosis,
	goerli,
	optimismSepolia,
	polygon,
	arbitrumSepolia,
	celo,
	classic,
	mainnet,
	optimism,
	arbitrum,
} from '@wagmi/core/chains';
import { type Chain } from 'viem';

const EXPLORER_URLS = {
	[63]: 'https://etc-mordor.blockscout.com', // Ethereum Classic Mordor
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
};

export function updateBlockExplorers(chain: Chain) {
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
