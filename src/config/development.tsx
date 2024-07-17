import React from 'react';
import {
	celoAlfajores,
	gnosis,
	goerli,
	optimismSepolia,
	polygon,
	arbitrumSepolia,
	baseSepolia,
	polygonZkEvmCardona,
} from 'wagmi/chains';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { type Chain } from 'viem';
import {
	ChainType,
	EnvConfig,
	NonEVMChain,
	StakingPlatform,
	StakingType,
	StreamType,
} from '@/types/config';
import { IconPolygon } from '@/components/Icons/Polygon';
import { IconCelo } from '@/components/Icons/Celo';
import { IconOptimism } from '@/components/Icons/Optimism';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconUnknown } from '@/components/Icons/Unknown';
import IconBase from '@/components/Icons/Base';
import IconSolana from '@/components/Icons/Solana';
import IconZKEVM from '@/components/Icons/ZKEVM';
import IconArbitrum from '@/components/Icons/Arbitrum';

const BASE_ROUTE =
	process.env.NEXT_PUBLIC_BASE_ROUTE ||
	'https://impact-graph.serve.giveth.io';
const BACKEND_LINK =
	process.env.NEXT_PUBLIC_BACKEND_LINK || `${BASE_ROUTE}/graphql`;
const FRONTEND_LINK =
	process.env.NEXT_PUBLIC_FRONTEND_LINK || 'https://staging.giveth.io';
const NOTIFICATION_BASE_ROUTE =
	process.env.NEXT_PUBLIC_NOTIFICATION_BASE_ROUTE ||
	'https://notification.serve.giveth.io';
const AUTH_BASE_ROUTE =
	process.env.NEXT_PUBLIC_AUTH_BASE_ROUTE ||
	'https://auth.serve.giveth.io/v1';
const SEPT_8TH_2022 = 1662595200000;

const GNOSIS_GIV_TOKEN_ADDRESS = '0x83a8eea6427985C523a0c4d9d3E62C051B6580d3';
const OPTIMISM_GIV_TOKEN_ADDRESS = '0x2f2c819210191750F2E11F7CfC5664a0eB4fd5e6';

const MAINNET_NETWORK_NUMBER = 5; // Goerli
const GNOSIS_NETWORK_NUMBER = 100; // xDAI
const POLYGON_NETWORK_NUMBER = 137;
const OPTIMISM_NETWORK_NUMBER = 11155420;
const CELO_NETWORK_NUMBER = 44787;
const CLASSIC_NETWORK_NUMBER = 63;
const ARBITRUM_NETWORK_NUMBER = 421614;
const BASE_NETWORK_NUMBER = 84532;
const ZKEVM_NETWORK_NUMBER = 2442;

const SOLANA_NETWORK: NonEVMChain = {
	id: 103,
	networkId: 103,
	chainType: ChainType.SOLANA,
	name: 'Solana Devnet',
	adapterNetwork: WalletAdapterNetwork.Devnet,
	nativeCurrency: { name: 'Solana native token', symbol: 'SOL', decimals: 9 },
	blockExplorers: {
		default: {
			name: 'Solana Explorer',
			url: 'https://explorer.solana.com',
		},
	},
};

const classic = {
	id: 63,
	name: 'Ethereum Classic Mordor',
	network: 'mordor',
	nativeCurrency: {
		decimals: 18,
		name: 'mETC',
		symbol: 'mETC',
	},
	rpcUrls: {
		default: { http: ['https://rpc.mordor.etccooperative.org'] },
		public: { http: ['https://rpc.mordor.etccooperative.org'] },
	},
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://etc-mordor.blockscout.com',
		},
	},
	subgraphAddress:
		process.env.NEXT_PUBLIC_SUBGRAPH_CLASSIC ||
		'http://167.172.97.150:8000/subgraphs/name/giveth/etc',
};

const EVM_CHAINS = [
	polygon,
	goerli,
	gnosis,
	optimismSepolia,
	celoAlfajores,
	arbitrumSepolia,
	baseSepolia,
	classic,
	polygonZkEvmCardona,
] as readonly [Chain, ...Chain[]];

const NON_EVM_CHAINS: NonEVMChain[] = [SOLANA_NETWORK];

const config: EnvConfig = {
	GIVETH_PROJECT_ID: 1,
	BACKEND_LINK: 'http://127.0.0.1:4000/graphql',
	FRONTEND_LINK: 'http://127.0.0.1:3000/',
	MICROSERVICES: {
		authentication: AUTH_BASE_ROUTE,
		notification: `${NOTIFICATION_BASE_ROUTE}/v1/notifications`,
		notificationSettings: `${NOTIFICATION_BASE_ROUTE}/v1/notification_settings`,
	},

	EVM_CHAINS,
	CHAINS: [...EVM_CHAINS, ...NON_EVM_CHAINS],
	MAINNET_NETWORK_NUMBER: MAINNET_NETWORK_NUMBER,
	GNOSIS_NETWORK_NUMBER: GNOSIS_NETWORK_NUMBER,
	POLYGON_NETWORK_NUMBER: POLYGON_NETWORK_NUMBER,
	OPTIMISM_NETWORK_NUMBER: OPTIMISM_NETWORK_NUMBER,
	CELO_NETWORK_NUMBER: CELO_NETWORK_NUMBER,
	ARBITRUM_NETWORK_NUMBER: ARBITRUM_NETWORK_NUMBER,
	CLASSIC_NETWORK_NUMBER: CLASSIC_NETWORK_NUMBER,
	BASE_NETWORK_NUMBER: BASE_NETWORK_NUMBER,
	ZKEVM_NETWORK_NUMBER: ZKEVM_NETWORK_NUMBER,

	RARIBLE_ADDRESS: 'https://testnet.rarible.com/',
	MAINNET_CONFIG: {
		...goerli,
		chainType: ChainType.EVM,
		DAI_TOKEN_ADDRESS: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60',
		DAI_BUY_LINK: '',
		PFP_CONTRACT_ADDRESS: '0x9F8c0e0353234F6f644fc7AF84Ac006f02cecE77',

		gasPreference: {
			// Keep it empty for automatic configuration
		},
		subgraphAddress:
			process.env.NEXT_PUBLIC_SUBGRAPH_MAINNET ||
			'https://api.studio.thegraph.com/query/40764/giveconomy-staging-goerli/1.5.0?source=giveth',
		coingeckoChainName: 'ethereum',
		chainLogo: (logoSize?: number) => <IconEthereum size={logoSize} />,

		GIV_TOKEN_ADDRESS: '0xA2470F25bb8b53Bd3924C7AC0C68d32BF2aBd5be',
		GIV_BUY_LINK:
			'https://app.uniswap.org/#/swap?outputCurrency=0x29434A25abd94AE882aA883eea81585Aaa5b078D',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		WETH_TOKEN_ADDRESS: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
		TOKEN_DISTRO_ADDRESS: '0x4358c99abFe7A9983B6c96785b8870b5412C5B4B',

		pools: [
			{
				network: MAINNET_NETWORK_NUMBER,
				POOL_ADDRESS: '0x0551f038a84cb0d42584a8E3eaf5a409D22F4211',
				LM_ADDRESS: '0x6420Ad2d9B512f1cF0B899794598Ed17da2C5836',
				type: StakingType.UNISWAPV2_GIV_DAI,
				platform: StakingPlatform.UNISWAP,
				title: 'GIV / DAI',
				description: '50% GIV, 50% DAI',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0xA2470F25bb8b53Bd3924C7AC0C68d32BF2aBd5be/0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60?chain=goerli',
				unit: 'LP',
				farmEndTimeMS: SEPT_8TH_2022,
			},
			{
				network: MAINNET_NETWORK_NUMBER,
				POOL_ADDRESS: '0xf8cba1c22b6515982bf43e71b7e8b546a3323ea8',
				VAULT_ADDRESS: '0xba12222222228d8ba445958a75a0704d566bf2c8',
				POOL_ID:
					'0xf8cba1c22b6515982bf43e71b7e8b546a3323ea80002000000000000000000df',
				LM_ADDRESS: '0x887673d8295aF9BE0D8e12412c2B87a49cFcd7bd',
				type: StakingType.BALANCER_ETH_GIV,
				platform: StakingPlatform.BALANCER,
				title: 'GIV / ETH',
				description: '80% GIV, 20% ETH',
				provideLiquidityLink:
					'https://goerli.balancer.fi/#/pool/0xf8cba1c22b6515982bf43e71b7e8b546a3323ea80002000000000000000000df',
				unit: 'LP',
			},
		],
		regenPools: [],
		uniswapV2Subgraph:
			process.env.NEXT_PUBLIC_SUBGRAPH_UNISWAP_V2 ||
			'https://gateway-arbitrum.network.thegraph.com/api/49102048d5822209c7cd189f8e4a51a9/subgraphs/id/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu',
		regenStreams: [],
	},

	GNOSIS_CONFIG: {
		...gnosis,
		chainType: ChainType.EVM,
		gasPreference: {
			maxFeePerGas: (2e9).toString(),
			maxPriorityFeePerGas: (1e9).toString(),
		},

		subgraphAddress:
			process.env.NEXT_PUBLIC_SUBGRAPH_GNOSIS ||
			'https://api.studio.thegraph.com/query/76292/giveconomy-staging-gnosischain/version/latest',
		coingeckoChainName: 'xdai',
		chainLogo: (logoSize?: number) => <IconGnosisChain size={logoSize} />,

		GIV_TOKEN_ADDRESS: GNOSIS_GIV_TOKEN_ADDRESS,
		GIV_BUY_LINK:
			'https://app.honeyswap.org/#/swap?outputCurrency=0x83a8eea6427985C523a0c4d9d3E62C051B6580d3',
		gGIV_TOKEN_ADDRESS: '0x4Bee761229AD815Cc64461783580F629dA0f0350',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		MERKLE_ADDRESS: '0xc87403C70c9FBfb594d98d3B5E695BBE4C694188',
		TOKEN_DISTRO_ADDRESS: '0x18a46865AAbAf416a970eaA8625CFC430D2364A1',
		GIVPOWER: {
			network: GNOSIS_NETWORK_NUMBER,
			LM_ADDRESS: '0xDAEa66Adc97833781139373DF5B3bcEd3fdda5b1',
			GARDEN_ADDRESS: '0x9ff80789b74d1d2b7cf5a568ea82409c2b327861',
			POOL_ADDRESS: GNOSIS_GIV_TOKEN_ADDRESS,
			type: StakingType.GIV_GARDEN_LM,
			platform: StakingPlatform.GIVETH,
			title: 'GIV',
			description: '100% GIV',
			unit: 'GIV',
		},

		pools: [
			{
				network: GNOSIS_NETWORK_NUMBER,
				POOL_ADDRESS: '0x31A5AeA76Af79F592a3A3F46a9f6Cb118990433b',
				LM_ADDRESS: '0xC09147Ac0aC8B5271F03b511c3554e3238Ae3201',
				type: StakingType.HONEYSWAP_GIV_HNY,
				platform: StakingPlatform.HONEYSWAP,
				title: 'GIV / HNY',
				description: '50% GIV, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x83a8eea6427985C523a0c4d9d3E62C051B6580d3/0x69F79C9eA174d4659B18c7993c7EFbBbB58cF068',
				unit: 'LP',
				farmEndTimeMS: SEPT_8TH_2022,
			},
			{
				network: GNOSIS_NETWORK_NUMBER,
				POOL_ADDRESS: '0x437B0da7932b21F54488fD80Ee09b519a6f4d8AD',
				LM_ADDRESS: '0x83535D6DeF8E881E647C00462315bae9A6E7BD09',
				type: StakingType.SUSHISWAP_ETH_GIV,
				platform: StakingPlatform.SUSHISWAP,
				title: 'GIV / ETH',
				description: '50% ETH, 50% GIV',
				provideLiquidityLink:
					'https://app.sushi.com/add/0x83a8eea6427985C523a0c4d9d3E62C051B6580d3/0x736a98655049433f79dCcF5e54b887E8890b63D1',
				unit: 'LP',
				farmEndTimeMS: SEPT_8TH_2022,
			},
			{
				network: GNOSIS_NETWORK_NUMBER,
				POOL_ADDRESS: '0xB4E0fc187f0EEd740D93eF15Cd14750a2780fc2A',
				LM_ADDRESS: '0xe2c436E177C39A5D18AF6923Fc2Fc673f4729C05',
				type: StakingType.HONEYSWAP_GIV_DAI,
				platform: StakingPlatform.HONEYSWAP,
				title: 'GIV / xDAI',
				description: '50% GIV, 50% xDAI',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x83a8eea6427985C523a0c4d9d3E62C051B6580d3/0x97c4dD5cE204b8c1F2f3B8fBfBBDC771d867d18c',
				unit: 'LP',
				farmStartTimeMS: 1655997000000,
				farmEndTimeMS: SEPT_8TH_2022,
			},
		],

		regenPools: [
			{
				network: GNOSIS_NETWORK_NUMBER,
				POOL_ADDRESS: '0xD28C07F802212F04AF41834ec0CC81d2d283124B',
				LM_ADDRESS: '0x06851400866e065972ff21e1ECdE035b4772736d',
				type: StakingType.HONEYSWAP_FOX_HNY,
				platform: StakingPlatform.HONEYSWAP,
				title: 'FOX / HNY',
				description: '50% FOX, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x18cE354571ba71bC7b3d633b254954C5A9cfC195/0x69F79C9eA174d4659B18c7993c7EFbBbB58cF068',
				unit: 'LP',
				regenStreamType: StreamType.FOX,
				farmStartTimeMS: 1646306818206,
				farmEndTimeMS: 1665932450000,
				introCard: {
					title: 'ShapeShift DAO',
					description:
						'ShapeShift is the free and open-source one-stop-shop for cross-chain DeFi. Buy, sell, send, receive, trade, and earn yield on your crypto across a growing number of protocols and chains with no added fees ever. FOX is the governance token of the ShapeShift DAO.',
					link: 'https://shapeshift.com/',
				},
			},
			{
				network: GNOSIS_NETWORK_NUMBER,
				POOL_ADDRESS: '0x0714A2fE9574F591a4ed3fD03b63714e8681fBb7',
				LM_ADDRESS: '0x93c40bCA6a854B2190a054136a316C4Df7f89f10',
				type: StakingType.HONEYSWAP_FOX_XDAI,
				platform: StakingPlatform.HONEYSWAP,
				title: 'FOX / xDAI',
				description: '50% FOX, 50% xDAI',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x18cE354571ba71bC7b3d633b254954C5A9cfC195/0x97c4dD5cE204b8c1F2f3B8fBfBBDC771d867d18c',
				unit: 'LP',
				regenStreamType: StreamType.FOX,
				farmStartTimeMS: 1685460000000,
				farmEndTimeMS: 1721739750000,
				introCard: {
					title: 'ShapeShift DAO',
					description:
						'ShapeShift is the free and open-source one-stop-shop for cross-chain DeFi. Buy, sell, send, receive, trade, and earn yield on your crypto across a growing number of protocols and chains with no added fees ever. FOX is the governance token of the ShapeShift DAO.',
					link: 'https://shapeshift.com/',
				},
			},
		],

		uniswapV2Subgraph:
			process.env.NEXT_PUBLIC_SUBGRAPH_HONEYSWAP_V2 ||
			'https://api.studio.thegraph.com/proxy/40931/honeyswap-gnosis/version/latest',

		regenStreams: [
			{
				network: GNOSIS_NETWORK_NUMBER,
				tokenDistroAddress:
					'0xCA29ec6F4218E230294993E0d77d5ece5a6573D8',
				type: StreamType.FOX,
				title: 'ShapeShift DAO',
				rewardTokenAddress:
					'0x18cE354571ba71bC7b3d633b254954C5A9cfC195',
				rewardTokenSymbol: 'FOX',
				tokenAddressOnUniswapV2:
					'0x21a42669643f45Bc0e086b8Fc2ed70c23D67509d',
			},
			{
				/// Just for testing
				archived: true,
				network: GNOSIS_NETWORK_NUMBER,
				tokenDistroAddress:
					'0xCA29ec6F4218E230294993E0d77d5ece5a6573D8',
				type: StreamType.FOX,
				title: 'ShapeShift DAO',
				rewardTokenAddress:
					'0x18cE354571ba71bC7b3d633b254954C5A9cfC195',
				rewardTokenSymbol: 'FOX',
				tokenAddressOnUniswapV2:
					'0x21a42669643f45Bc0e086b8Fc2ed70c23D67509d',
			},
		],
	},

	POLYGON_CONFIG: {
		...polygon,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		coingeckoChainName: 'polygon-pos',
		chainLogo: (logoSize?: number) => <IconPolygon size={logoSize} />,
	},

	OPTIMISM_CONFIG: {
		...optimismSepolia,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		anchorRegistryAddress: '0x4AAcca72145e1dF2aeC137E1f3C5E3D75DB8b5f3',
		subgraphAddress:
			process.env.NEXT_PUBLIC_SUBGRAPH_OPTIMISM ||
			'https://api.studio.thegraph.com/query/76292/giveconomy-staging-op-sepolia/version/latest',
		GIV_TOKEN_ADDRESS: OPTIMISM_GIV_TOKEN_ADDRESS,
		GIV_BUY_LINK:
			'https://app.uniswap.org/#/swap?chain=optimism&outputCurrency=0xc916Ce4025Cb479d9BA9D798A80094a449667F5D',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		TOKEN_DISTRO_ADDRESS: '0x301C739CF6bfb6B47A74878BdEB13f92F13Ae5E7',
		coingeckoChainName: 'optimistic-ethereum',
		chainLogo: (logoSize?: number) => <IconOptimism size={logoSize} />,
		GIVPOWER: {
			network: OPTIMISM_NETWORK_NUMBER,
			LM_ADDRESS: '0xE6836325B13819CF38f030108255A5213491A725',
			POOL_ADDRESS: OPTIMISM_GIV_TOKEN_ADDRESS,
			type: StakingType.GIV_UNIPOOL_LM,
			platform: StakingPlatform.GIVETH,
			title: 'GIV',
			description: '100% GIV',
			unit: 'GIV',
		},
		uniswapV2Subgraph: '',
		GIVETH_ANCHOR_CONTRACT_ADDRESS:
			'0x503055e1f8b99c60a51c479a60b233976617bc7a',
		superFluidSubgraph:
			process.env.NEXT_PUBLIC_SUBGRAPH_SUPER_FLUID ||
			'https://subgraph-endpoints.superfluid.dev/optimism-sepolia/protocol-v1',
		SUPER_FLUID_TOKENS: [
			{
				underlyingToken: {
					decimals: 18,
					id: OPTIMISM_GIV_TOKEN_ADDRESS,
					name: 'Giveth',
					symbol: 'GIV',
					coingeckoId: 'giveth',
				},
				decimals: 18,
				id: '0xdfd824f6928b9776c031f7ead948090e2824ce8b',
				name: 'fake Super Giveth Token',
				symbol: 'GIVx',
				isSuperToken: true,
				coingeckoId: 'giveth',
			},
			{
				underlyingToken: {
					name: 'Ethereum',
					symbol: 'ETH',
					decimals: 18,
					id: '0x0000000000000000000000000000000000000000',
					coingeckoId: 'ethereum',
				},
				decimals: 18,
				id: '0x0043d7c85c8b96a49a72a92c0b48cdc4720437d7',
				name: 'Super ETH',
				symbol: 'ETHx',
				isSuperToken: true,
				coingeckoId: 'ethereum',
			},
		],
	},

	CELO_CONFIG: {
		...celoAlfajores,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		coingeckoChainName: 'celo',
		chainLogo: (logoSize?: number) => <IconCelo size={logoSize} />,
	},

	ARBITRUM_CONFIG: {
		...arbitrumSepolia,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		coingeckoChainName: 'arbitrum',
		chainLogo: (logoSize?: number) => <IconArbitrum size={logoSize} />,
	},

	BASE_CONFIG: {
		...baseSepolia,
		chainType: ChainType.EVM,
		coingeckoChainName: 'base',
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		chainLogo: (logoSize?: number) => <IconBase size={logoSize} />,
	},

	ZKEVM_CONFIG: {
		...polygonZkEvmCardona,
		chainType: ChainType.EVM,
		coingeckoChainName: 'polygon-zkevm',
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		chainLogo: (logoSize?: number) => <IconZKEVM size={logoSize} />,
	},

	CLASSIC_CONFIG: {
		...classic,
		//TODO: should change the icon
		chainType: ChainType.EVM,
		chainLogo: (logoSize?: number) => <IconUnknown size={logoSize} />,
		coingeckoChainName: 'ethereum-classic',
		gasPreference: {
			// Keep it empty for automatic configuration
		},
	},
	SOLANA_CONFIG: {
		...SOLANA_NETWORK,
		coingeckoChainName: 'solana',
		chainLogo: (logoSize?: number) => <IconSolana size={logoSize} />,
	},
};

export default config;
