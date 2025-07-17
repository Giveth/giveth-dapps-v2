import React from 'react';
import {
	celoAlfajores,
	gnosis,
	sepolia,
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
// import { IconUnknown } from '@/components/Icons/Unknown';
import IconBase from '@/components/Icons/Base';
import IconSolana from '@/components/Icons/Solana';
import IconZKEVM from '@/components/Icons/ZKEVM';
import IconArbitrum from '@/components/Icons/Arbitrum';
import IconStellar from '@/components/Icons/Stellar';
import { IconClassic } from '@/components/Icons/Classic';

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
const ZKEVM_GIV_TOKEN_ADDRESS = '0xa77390562986F5d08F5aECF5D3Fb82BD16B44548';
const POLYGON_GIV_TOKEN_ADDRESS = '0xc4df120d75604307dcB604fde2AD3b8a8B7c6FAA';

const MAINNET_NETWORK_NUMBER = sepolia.id; // sepolia
const GNOSIS_NETWORK_NUMBER = gnosis.id; // xDAI
const POLYGON_NETWORK_NUMBER = polygon.id;
const OPTIMISM_NETWORK_NUMBER = optimismSepolia.id;
const CELO_NETWORK_NUMBER = celoAlfajores.id;
const CLASSIC_NETWORK_NUMBER = 63;
const STELLAR_NETWORK_NUMBER = 1500;
const SOLANA_NETWORK_NUMBER = 103;
const ARBITRUM_NETWORK_NUMBER = arbitrumSepolia.id;
const BASE_NETWORK_NUMBER = baseSepolia.id;
const ZKEVM_NETWORK_NUMBER = polygonZkEvmCardona.id;

const SOLANA_NETWORK: NonEVMChain = {
	id: SOLANA_NETWORK_NUMBER,
	networkId: SOLANA_NETWORK_NUMBER,
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

const STELLAR_NETWORK: NonEVMChain = {
	id: STELLAR_NETWORK_NUMBER,
	networkId: STELLAR_NETWORK_NUMBER,
	chainType: ChainType.STELLAR,
	name: 'Stellar',
	nativeCurrency: { name: 'Stellar Lumens', symbol: 'XLM', decimals: 7 },
	blockExplorers: {
		default: {
			name: 'Stellar Explorer',
			url: 'https://stellar.expert/explorer/testnet',
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
	sepolia,
	gnosis,
	optimismSepolia,
	celoAlfajores,
	arbitrumSepolia,
	baseSepolia,
	classic,
	polygonZkEvmCardona,
] as readonly [Chain, ...Chain[]];

const NON_EVM_CHAINS: NonEVMChain[] = [STELLAR_NETWORK, SOLANA_NETWORK];

const config: EnvConfig = {
	GIVETH_PROJECT_ID: 1,
	BACKEND_LINK: BACKEND_LINK,
	FRONTEND_LINK: FRONTEND_LINK,
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
	STELLAR_NETWORK_NUMBER: STELLAR_NETWORK_NUMBER,

	RARIBLE_ADDRESS: 'https://testnet.rarible.com/',
	MAINNET_CONFIG: {
		...sepolia,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://eth-sepolia.blockscout.com',
			},
		},
		coingeckoChainName: 'ethereum',
		chainLogo: (logoSize?: number) => <IconEthereum size={logoSize} />,
	},

	GNOSIS_CONFIG: {
		...gnosis,
		chainType: ChainType.EVM,
		gasPreference: {
			maxFeePerGas: (2e9).toString(),
			maxPriorityFeePerGas: (1e9).toString(),
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://gnosis.blockscout.com',
			},
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
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://polygon.blockscout.com',
			},
		},
		coingeckoChainName: 'polygon-pos',
		chainLogo: (logoSize?: number) => <IconPolygon size={logoSize} />,
		GIV_TOKEN_ADDRESS: POLYGON_GIV_TOKEN_ADDRESS,
	},

	OPTIMISM_CONFIG: {
		...optimismSepolia,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://optimism-sepolia.blockscout.com',
			},
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
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://celo-alfajores.blockscout.com',
			},
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
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://arbitrum-sepolia.blockscout.com',
			},
		},
		coingeckoChainName: 'arbitrum',
		chainLogo: (logoSize?: number) => <IconArbitrum size={logoSize} />,
	},

	BASE_CONFIG: {
		...baseSepolia,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://base-sepolia.blockscout.com',
			},
		},
		coingeckoChainName: 'base',
		anchorRegistryAddress: '0x4AAcca72145e1dF2aeC137E1f3C5E3D75DB8b5f3',
		chainLogo: (logoSize?: number) => <IconBase size={logoSize} />,
		GIVETH_ANCHOR_CONTRACT_ADDRESS:
			'0x5430757bc19c87ec562e4660e56af6cac324b50a',
		superFluidSubgraph:
			process.env.NEXT_PUBLIC_SUBGRAPH_SUPER_FLUID ||
			'https://subgraph-endpoints.superfluid.dev/base-mainnet/protocol-v1',
		SUPER_FLUID_TOKENS: [
			{
				underlyingToken: {
					decimals: 18,
					id: '0x6B0dacea6a72E759243c99Eaed840DEe9564C194',
					name: 'fUSDC Fake Token',
					symbol: 'USDC',
					coingeckoId: 'usd-coin',
				},
				decimals: 18,
				id: '0x1650581F573eAd727B92073B5Ef8B4f5B94D1648',
				name: 'Super fUSDC Fake Token',
				symbol: 'fUSDCx',
				isSuperToken: true,
				coingeckoId: 'usd-coin',
			},
		],
	},

	ZKEVM_CONFIG: {
		...polygonZkEvmCardona,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://explorer-ui.cardona.zkevm-rpc.com',
			},
		},
		coingeckoChainName: 'polygon-zkevm',
		chainLogo: (logoSize?: number) => <IconZKEVM size={logoSize} />,

		subgraphAddress: process.env.NEXT_PUBLIC_SUBGRAPH_ZKEVM,
		GIV_TOKEN_ADDRESS: ZKEVM_GIV_TOKEN_ADDRESS,
		GIV_BUY_LINK:
			'https://app.uniswap.org/#/swap?chain=optimism&outputCurrency=0xc916Ce4025Cb479d9BA9D798A80094a449667F5D',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		TOKEN_DISTRO_ADDRESS: '0x2Df3e67Be4e441Cddd2d29c3d41DFd7D516f18e6',
		GIVPOWER: {
			network: ZKEVM_NETWORK_NUMBER,
			LM_ADDRESS: '0x7E9f30A74fCDf035018bc007f9930aA171863E33',
			POOL_ADDRESS: ZKEVM_GIV_TOKEN_ADDRESS,
			type: StakingType.GIV_UNIPOOL_LM,
			platform: StakingPlatform.GIVETH,
			title: 'GIV',
			description: '100% GIV',
			unit: 'GIV',
			farmStartTimeMS: 1654012800000,
		},
	},

	CLASSIC_CONFIG: {
		...classic,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://etc-mordor.blockscout.com',
			},
		},
		chainLogo: (logoSize?: number) => <IconClassic size={logoSize} />,
		coingeckoChainName: 'ethereum-classic',
	},
	STELLAR_CONFIG: {
		...STELLAR_NETWORK,
		chainType: ChainType.STELLAR,
		coingeckoChainName: 'stellar',
		chainLogo: (logoSize?: number) => <IconStellar size={logoSize} />,
	},
	SOLANA_CONFIG: {
		...SOLANA_NETWORK,
		coingeckoChainName: 'solana',
		chainLogo: (logoSize?: number) => <IconSolana size={logoSize} />,
	},

	// Causes config
	CAUSES_CONFIG: {
		minSelectedProjects: 5,
		maxSelectedProjects: 50,
		launchFee: 38,
		launchNetworks: [
			{
				network: GNOSIS_NETWORK_NUMBER,
				name: 'Gnosis',
				token: 'DRGIV3',
				tokenAddress: '0x83a8eea6427985C523a0c4d9d3E62C051B6580d3',
				symbol: 'DRGIV3',
				coingeckoId: 'giveth',
				decimals: 18,
				destinationAddress:
					'0x864af8991100d5E2Df52a3c7ae64db111E983D24',
			},
			{
				network: POLYGON_NETWORK_NUMBER,
				name: 'Polygon',
				token: 'TPOL',
				tokenAddress: '0xc20CAf8deE81059ec0c8E5971b2AF7347eC131f4',
				symbol: 'TPOL',
				coingeckoId: 'giveth',
				decimals: 18,
				destinationAddress:
					'0x864af8991100d5E2Df52a3c7ae64db111E983D24',
			},
			{
				network: OPTIMISM_NETWORK_NUMBER,
				name: 'Optimism',
				token: 'GIV',
				tokenAddress: '0x2f2c819210191750F2E11F7CfC5664a0eB4fd5e6',
				symbol: 'GIV',
				coingeckoId: 'giveth',
				decimals: 18,
				destinationAddress:
					'0x864af8991100d5E2Df52a3c7ae64db111E983D24',
			},
		],
		acceptedNetworks: [
			MAINNET_NETWORK_NUMBER,
			GNOSIS_NETWORK_NUMBER,
			POLYGON_NETWORK_NUMBER,
			OPTIMISM_NETWORK_NUMBER,
			ARBITRUM_NETWORK_NUMBER,
			BASE_NETWORK_NUMBER,
			CELO_NETWORK_NUMBER,
		],
		recipientToken: {
			network: POLYGON_NETWORK_NUMBER,
			address: '0xc7B1807822160a8C5b6c9EaF5C584aAD0972deeC',
			symbol: 'GIV',
			decimals: 18,
		},
	},
};

export default config;
