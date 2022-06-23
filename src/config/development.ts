import { EnvConfig, StakingPlatform, StakingType } from '@/types/config';
import { gwei2wei } from '@/helpers/blockchain';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;
const BASE_ROUTE = 'https://serve.giveth.io';
// IMPORTANT: Using dev to make it work until staging is merged
// const BASE_ROUTE = 'https://dev.serve.giveth.io';

const config: EnvConfig = {
	BACKEND_LINK: `${BASE_ROUTE}/graphql`,
	FRONTEND_LINK: 'https://staging.giveth.io',
	MICROSERVICES: {
		authentication: `${BASE_ROUTE}/siweauthmicroservice/v1`,
	},
	MAINNET_NETWORK_NUMBER: 42, // Kovan
	XDAI_NETWORK_NUMBER: 100, // xDAI

	GARDEN_LINK:
		'https://gardens-staging.1hive.org/#/xdai/garden/0xb3f3da0080a8811d887531ca4c0dbfe3490bd1a1',

	MAINNET_CONFIG: {
		chainId: '0x2a', // A 0x-prefixed hexadecimal string
		chainName: 'Kovan',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH', // 2-6 characters long
			decimals: 18,
		},

		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorerName: ['Etherscan'],
		blockExplorerUrls: ['https://kovan.etherscan.io'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-kovan-deployment-six',

		TOKEN_ADDRESS: '0x6c16216484069C19530a57762AD6630fB678D00E',
		tokenAddressOnUniswapV2: '0x900db999074d9277c5da2a43f252d74366230da0',
		WETH_TOKEN_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
		TOKEN_DISTRO_ADDRESS: '0x373bAa19E92F6204b461b791094012fd259996F4',
		GIV: {
			LM_ADDRESS: '0xDfdBDA44b2b9C113475a372c078aAC1279C4d7BE',
			BUY_LINK:
				'https://app.uniswap.org/#/swap?outputCurrency=0x6c16216484069C19530a57762AD6630fB678D00E',
		},

		nodeUrl: 'https://kovan.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			{
				POOL_ADDRESS: '0x02653cae0cad6b3cd73e7dbc4f7a3ce6693c3ed7',
				VAULT_ADDRESS: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
				POOL_ID:
					'0x02653cae0cad6b3cd73e7dbc4f7a3ce6693c3ed700020000000000000000053d',
				LM_ADDRESS: '0xc3092EeED159be05dF1c103e3CaAC3DacAe1EdF9',
				type: StakingType.BALANCER_ETH_GIV,
				platform: StakingPlatform.BALANCER,
				title: 'GIV / ETH',
				description: '80% GIV, 20% ETH',
				provideLiquidityLink:
					'https://kovan.app.balancer.fi/#/pool/0x02653cae0cad6b3cd73e7dbc4f7a3ce6693c3ed700020000000000000000053d',
				unit: 'LP',
				active: true,
			},
			{
				INCENTIVE_START_TIME: 1640190600,
				INCENTIVE_END_TIME: 1655915400,
				INCENTIVE_REWARD_AMOUNT: 10000000,
				NFT_POSITIONS_MANAGER_ADDRESS:
					'0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
				UNISWAP_V3_STAKER: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
				STAKING_REWARDS_CONTRACT:
					'0xfA656B81cEC0deD6Acd5Bb1a60A06914aB21A0B3',
				REWARD_TOKEN: '0x6397b874BC81c4c9bEb8D8f2a0fd121b304F21B2\n',
				UNISWAP_V3_LP_POOL:
					'0x77c3a14A9dFfaA4B4B94f4F274cdBeb0518bE24d',
				INCENTIVE_REFUNDEE_ADDRESS:
					'0x5f672d71399d8cDbA64f596394b4f4381247E025',
				POOL_ADDRESS: '0xa48C26fF05F47a2eEd88C09664de1cb604A21b01',
				LM_ADDRESS: '0x1aD46D40648639f84a396Fef32132888038c5aA8',
				type: StakingType.UNISWAPV3_ETH_GIV,
				platform: StakingPlatform.UNISWAP,
				title: 'GIV / ETH',
				description: '0.3% tier only',
				provideLiquidityLink: `https://app.uniswap.org/#/add/ETH/0x29434A25abd94AE882aA883eea81585Aaa5b078D/3000`,
				unit: 'NFT',
				infinitePositionId: 9985,
				active: false,
			},
		],
		uniswapV2Subgraph:
			'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
		regenStreams: [],
		regenFarms: [],
	},

	XDAI_CONFIG: {
		chainId: '0x64',
		chainName: 'Gnosis Chain',
		nativeCurrency: {
			name: 'XDAI',
			symbol: 'XDAI',
			decimals: 18,
		},

		gasPreference: {
			maxFeePerGas: gwei2wei('2'),
			maxPriorityFeePerGas: gwei2wei('1'),
		},

		blockExplorerName: ['Blockscout'],
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-xdai-deployment-six',

		TOKEN_ADDRESS: '0x780FE5de651a3ea62E572f591BF848cFEBaf2163',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		MERKLE_ADDRESS: '0x06BA4122FC4F3AbCdAFD2fF1dD83A88A63842309',
		TOKEN_DISTRO_ADDRESS: '0x74B557bec1A496a8E9BE57e9A1530A15364C87Be',

		nodeUrl: 'https://rpc.gnosischain.com/',

		GIV: {
			LM_ADDRESS: '0x1460aaF51F4E0B1b59Bb41981Cb4aa5A1B377776',
			GARDEN_ADDRESS: '0x642c18755aa5a2bf6861349327d2448813b992ba',
			BUY_LINK:
				'https://app.honeyswap.org/#/swap?outputCurrency=0x780FE5de651a3ea62E572f591BF848cFEBaf2163',
		},

		pools: [
			{
				POOL_ADDRESS: '0xE5021d9B578b84f7D272CFDE3E8B58c0Bf37B402',
				LM_ADDRESS: '0x34F8Cc88b872f13d32084464af56f1052A2eF0f6',
				type: StakingType.HONEYSWAP_GIV_HNY,
				platform: StakingPlatform.HONEYSWAP,
				title: 'GIV / HNY',
				description: '50% GIV, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x780FE5de651a3ea62E572f591BF848cFEBaf2163/0x69F79C9eA174d4659B18c7993c7EFbBbB58cF068',
				unit: 'LP',
				active: true,
			},
			{
				POOL_ADDRESS: '0x0346B748Ce9bdd42995452b5D30b46c296336f07',
				LM_ADDRESS: '0x448d5E09620752f031Ea629993050f8581118438',
				type: StakingType.SUSHISWAP_ETH_GIV,
				platform: StakingPlatform.SUSHISWAP,
				title: 'GIV / ETH',
				description: '50% ETH, 50% GIV',
				provideLiquidityLink:
					'https://app.sushi.com/add/0x780FE5de651a3ea62E572f591BF848cFEBaf2163/0x736a98655049433f79dCcF5e54b887E8890b63D1',
				unit: 'LP',
				active: true,
			},
		],

		uniswapV2Subgraph:
			'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-v2',

		regenStreams: [],
		regenFarms: [],
	},
};

export default config;
