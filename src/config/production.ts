import { EnvConfig, StakingType } from '@/types/config';
import { gwei2wei } from '@/helpers/number';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const config: EnvConfig = {
	MAINNET_NETWORK_NUMBER: 1, // ETH
	XDAI_NETWORK_NUMBER: 100, // xDAI

	GARDEN_LINK:
		'https://gardens.1hive.org/#/xdai/garden/0xb25f0ee2d26461e2b5b3d3ddafe197a0da677b98',

	MAINNET_CONFIG: {
		chainId: '0x1', // A 0x-prefixed hexadecimal string
		chainName: 'Ethereum Mainnet',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH', // 2-6 characters long
			decimals: 18,
		},
		gasPreference: {
			// Keep it empty for automatic configuration
		},

		rpcUrls: [],
		blockExplorerName: ['etherscan'],
		blockExplorerUrls: ['https://etherscan.io/'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-mainnet',

		TOKEN_ADDRESS: '0x900db999074d9277c5da2a43f252d74366230da0',
		WETH_TOKEN_ADDRESS: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		TOKEN_DISTRO_ADDRESS: '0x87dE995F6744B75bBe0255A973081142aDb61f4d',
		GIV: {
			LM_ADDRESS: '0x4B9EfAE862a1755F7CEcb021856D467E86976755',
			BUY_LINK:
				'https://app.uniswap.org/#/swap?outputCurrency=0x900db999074d9277c5da2a43f252d74366230da0',
		},

		nodeUrl: 'https://kovan.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			{
				INCENTIVE_START_TIME: 1640361600,
				INCENTIVE_END_TIME: 1656086400,
				INCENTIVE_REWARD_AMOUNT: 10000000,
				NFT_POSITIONS_MANAGER_ADDRESS:
					'0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
				UNISWAP_V3_STAKER: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
				STAKING_REWARDS_CONTRACT:
					'0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D',
				REWARD_TOKEN: '0x3115e5aAa3D6f742d09fbB649150dfE285a9c2A3',
				UNISWAP_V3_LP_POOL:
					'0xc763b6b3d0f75167db95daa6a0a0d75dd467c4e1',
				INCENTIVE_REFUNDEE_ADDRESS:
					'0x34d27210cC319EC5281bDc4DC2ad8FbcF4EAEAEB',
				POOL_ADDRESS: '', //it's used in uniswap v2
				LM_ADDRESS: '', //it's used in uniswap v2
				type: StakingType.UNISWAP,
				title: 'GIV / ETH',
				description: '0.3% tier only',
				provideLiquidityLink: `https://app.uniswap.org/#/add/ETH/0x900dB999074d9277c5DA2A43F252D74366230DA0/3000`,
				unit: 'NFT',
			},
			{
				POOL_ADDRESS: '0x7819f1532c49388106f7762328c51ee70edd134c',
				VAULT_ADDRESS: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
				POOL_ID:
					'0x7819f1532c49388106f7762328c51ee70edd134c000200000000000000000109',
				LM_ADDRESS: '0xc0dbDcA66a0636236fAbe1B3C16B1bD4C84bB1E1',
				type: StakingType.BALANCER,
				title: 'GIV / ETH',
				description: '80% GIV, 20% ETH',
				provideLiquidityLink:
					'https://app.balancer.fi/#/pool/0x7819f1532c49388106f7762328c51ee70edd134c000200000000000000000109',
				unit: 'LP',
			},
		],
	},

	XDAI_CONFIG: {
		chainId: '0x64',
		chainName: 'xDai',
		nativeCurrency: {
			name: 'XDAI',
			symbol: 'XDAI',
			decimals: 18,
		},

		gasPreference: {
			maxFeePerGas: gwei2wei('2'),
			maxPriorityFeePerGas: gwei2wei('1'),
		},

		rpcUrls: ['https://rpc.xdaichain.com'],
		blockExplorerName: ['Blockscout'],
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-xdai',

		TOKEN_ADDRESS: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		MERKLE_ADDRESS: '0xFad63adEFb8203F7605F25f6a921c8bf45604A5e',
		TOKEN_DISTRO_ADDRESS: '0xc0dbDcA66a0636236fAbe1B3C16B1bD4C84bB1E1',

		nodeUrl: 'https://rpc.xdaichain.com/',
		GIV: {
			LM_ADDRESS: '0xD93d3bDBa18ebcB3317a57119ea44ed2Cf41C2F2',
			GARDEN_ADDRESS: '0x24f2d06446af8d6e89febc205e7936a602a87b60',
			BUY_LINK:
				'https://app.honeyswap.org/#/swap?outputCurrency=0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		},

		pools: [
			{
				POOL_ADDRESS: '0x08ea9f608656A4a775EF73f5B187a2F1AE2ae10e',
				LM_ADDRESS: '0x4B9EfAE862a1755F7CEcb021856D467E86976755',
				type: StakingType.HONEYSWAP,
				title: 'GIV / HNY',
				description: '50% GIV, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75/0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
				unit: 'LP',
			},
			{
				POOL_ADDRESS: '0x55FF0cef43F0DF88226E9D87D09fA036017F5586',
				LM_ADDRESS: '0xfB429010C1e9D08B7347F968a7d88f0207807EF0',
				type: StakingType.SUSHISWAP,
				title: 'GIV / ETH',
				description: '50% ETH, 50% GIV',
				provideLiquidityLink:
					'https://app.sushi.com/add/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1/0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
				unit: 'LP',
			},
		],
	},
};

export default config;
