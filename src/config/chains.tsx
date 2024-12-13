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

const chains: Record<string, Chain> = {
	celoAlfajores: updateBlockExplorers(celoAlfajores),
	gnosis: updateBlockExplorers(gnosis),
	goerli: updateBlockExplorers(goerli),
	sepolia: updateBlockExplorers(sepolia),
	optimismSepolia: updateBlockExplorers(optimismSepolia),
	polygon: updateBlockExplorers(polygon),
	arbitrumSepolia: updateBlockExplorers(arbitrumSepolia),
	celo: updateBlockExplorers(celo),
	classic: updateBlockExplorers(classic),
	mainnet: updateBlockExplorers(mainnet),
	optimism: updateBlockExplorers(optimism),
	arbitrum: updateBlockExplorers(arbitrum),
	base: updateBlockExplorers(base),
	baseSepolia: updateBlockExplorers(baseSepolia),
	polygonZkEvm: updateBlockExplorers(polygonZkEvm),
	polygonZkEvmCardona: updateBlockExplorers(polygonZkEvmCardona),
};

export default chains;
