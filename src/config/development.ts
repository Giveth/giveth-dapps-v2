import { parseUnits } from '@ethersproject/units';
import {
	EnvConfig,
	StakingPlatform,
	StakingType,
	StreamType,
} from '@/types/config';
import { networksParams } from '@/helpers/blockchain';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;
const BASE_ROUTE =
	process.env.NEXT_PUBLIC_BASE_ROUTE || 'https://serve.giveth.io';
const NOTIFICATION_BASE_ROUTE =
	process.env.NEXT_PUBLIC_NOTIFICATION_BASE_ROUTE ||
	'https://staging.notification.giveth.io';
const SEPT_8TH_2022 = 1662595200000;
const MAINNET_NETWORK_NUMBER = 5; // Goerli
const XDAI_NETWORK_NUMBER = 100; // xDAI
const POLYGON_NETWORK_NUMBER = 137;
const OPTIMISM_NETWORK_NUMBER = 10;
const CELO_NETWORK_NUMBER = 44787;

const config: EnvConfig = {
	GIVETH_PROJECT_ID: 1,
	BASE_ROUTE: BASE_ROUTE,
	BACKEND_LINK:
		process.env.NEXT_PUBLIC_BACKEND_LINK || `${BASE_ROUTE}/graphql`,
	FRONTEND_LINK:
		process.env.NEXT_PUBLIC_FRONTEND_LINK || 'https://staging.giveth.io',
	MICROSERVICES: {
		authentication:
			process.env.NEXT_PUBLIC_AUTH_BASE_ROUTE ||
			`${BASE_ROUTE}/siweauthmicroservice/v1`,
		notification: `${NOTIFICATION_BASE_ROUTE}/v1/notifications`,
		notificationSettings: `${NOTIFICATION_BASE_ROUTE}/v1/notification_settings`,
	},
	MAINNET_NETWORK_NUMBER: MAINNET_NETWORK_NUMBER,
	XDAI_NETWORK_NUMBER: XDAI_NETWORK_NUMBER,
	POLYGON_NETWORK_NUMBER: POLYGON_NETWORK_NUMBER,
	OPTIMISM_NETWORK_NUMBER: OPTIMISM_NETWORK_NUMBER,
	CELO_NETWORK_NUMBER: CELO_NETWORK_NUMBER,

	GARDEN_LINK:
		'https://gardens-staging.1hive.org/#/xdai/garden/0x16388d99199a74810fc572049b3d4d657e7d5deb',

	RARIBLE_ADDRESS: 'https://testnet.rarible.com/',
	MAINNET_CONFIG: {
		...networksParams[5],
		DAI_CONTRACT_ADDRESS: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60',
		PFP_CONTRACT_ADDRESS: '0x9F8c0e0353234F6f644fc7AF84Ac006f02cecE77',

		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorerName: ['Etherscan'],
		subgraphAddress:
			'https://api.studio.thegraph.com/query/40764/giveconomy-staging-goerli/1.5.0',

		TOKEN_ADDRESS: '0xA2470F25bb8b53Bd3924C7AC0C68d32BF2aBd5be',
		tokenAddressOnUniswapV2: '0x900db999074d9277c5da2a43f252d74366230da0', // TODO: GOERLI ?
		WETH_TOKEN_ADDRESS: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
		TOKEN_DISTRO_ADDRESS: '0x4358c99abFe7A9983B6c96785b8870b5412C5B4B',
		GIV: {
			network: MAINNET_NETWORK_NUMBER,
			LM_ADDRESS: '0x929C9353D67af21411d4475B30D960F23C209abd',
			BUY_LINK:
				'https://app.uniswap.org/#/swap?outputCurrency=0x29434A25abd94AE882aA883eea81585Aaa5b078D',
			farmEndTimeMS: SEPT_8TH_2022,
		},

		nodeUrl: 'https://goerli.infura.io/v3/' + INFURA_API_KEY,

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
			'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
		regenStreams: [],
	},

	XDAI_CONFIG: {
		nodeUrl: networksParams[100]?.rpcUrls[0],
		...networksParams[100],
		gasPreference: {
			maxFeePerGas: parseUnits('2', 'gwei').toString(),
			maxPriorityFeePerGas: parseUnits('1', 'gwei').toString(),
		},

		blockExplorerName: ['Blockscout'],
		subgraphAddress:
			'https://api.studio.thegraph.com/query/40764/giveconomy-staging-gnosischain/1.5.1',

		TOKEN_ADDRESS: '0x83a8eea6427985C523a0c4d9d3E62C051B6580d3',
		gGIV_ADDRESS: '0x4Bee761229AD815Cc64461783580F629dA0f0350',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		MERKLE_ADDRESS: '0xc87403C70c9FBfb594d98d3B5E695BBE4C694188',
		TOKEN_DISTRO_ADDRESS: '0x18a46865AAbAf416a970eaA8625CFC430D2364A1',

		GIV: {
			network: XDAI_NETWORK_NUMBER,
			LM_ADDRESS: '0xDAEa66Adc97833781139373DF5B3bcEd3fdda5b1',
			GARDEN_ADDRESS: '0x9ff80789b74d1d2b7cf5a568ea82409c2b327861',
			BUY_LINK:
				'https://app.honeyswap.org/#/swap?outputCurrency=0x83a8eea6427985C523a0c4d9d3E62C051B6580d3',
		},

		pools: [
			{
				network: XDAI_NETWORK_NUMBER,
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
				network: XDAI_NETWORK_NUMBER,
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
				network: XDAI_NETWORK_NUMBER,
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
				network: XDAI_NETWORK_NUMBER,
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
				network: XDAI_NETWORK_NUMBER,
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
				introCard: {
					title: 'ShapeShift DAO',
					description:
						'ShapeShift is the free and open-source one-stop-shop for cross-chain DeFi. Buy, sell, send, receive, trade, and earn yield on your crypto across a growing number of protocols and chains with no added fees ever. FOX is the governance token of the ShapeShift DAO.',
					link: 'https://shapeshift.com/',
				},
			},
		],

		uniswapV2Subgraph:
			'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-v2',

		regenStreams: [
			{
				network: XDAI_NETWORK_NUMBER,
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
				network: XDAI_NETWORK_NUMBER,
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
		nodeUrl: networksParams[137]?.rpcUrls[0],
		...networksParams[137],
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorerName: ['PolygonScan'],
		subgraphAddress: '',
	},

	OPTIMISM_CONFIG: {
		nodeUrl: networksParams[10]?.rpcUrls[0],
		...networksParams[10],
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorerName: ['OptimismScan'],
		subgraphAddress: '',
	},

	CELO_CONFIG: {
		nodeUrl: networksParams[44787]?.rpcUrls[0],
		...networksParams[44787],
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorerName: ['CeloScan'],
		subgraphAddress: '',
	},
};

export default config;
