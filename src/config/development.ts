import {
	EnvConfig,
	RegenFarmType,
	StakingPlatform,
	StakingType,
	StreamType,
} from '@/types/config';
import { gwei2wei } from '@/helpers/blockchain';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;
const BASE_ROUTE = 'https://dev.serve.giveth.io';
const SEPT_8TH_2022 = 1662595200000;
const MAINNET_NETWORK_NUMBER = 5; // Goerli
const XDAI_NETWORK_NUMBER = 100; // xDAI

const config: EnvConfig = {
	BACKEND_LINK: `${BASE_ROUTE}/graphql`,
	FRONTEND_LINK: 'https://staging.giveth.io',
	MICROSERVICES: {
		authentication: `${BASE_ROUTE}/siweauthmicroservice/v1`,
	},
	MAINNET_NETWORK_NUMBER: MAINNET_NETWORK_NUMBER,
	XDAI_NETWORK_NUMBER: XDAI_NETWORK_NUMBER,

	GARDEN_LINK:
		'https://gardens-staging.1hive.org/#/xdai/garden/0x16388d99199a74810fc572049b3d4d657e7d5deb',

	MAINNET_CONFIG: {
		chainId: '0x5', // A 0x-prefixed hexadecimal string
		chainName: 'Goerli',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH', // 2-6 characters long
			decimals: 18,
		},

		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorerName: ['Etherscan'],
		blockExplorerUrls: ['https://goerli.etherscan.io'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-goerli-staging',

		TOKEN_ADDRESS: '0xA2470F25bb8b53Bd3924C7AC0C68d32BF2aBd5be',
		tokenAddressOnUniswapV2: '0x900db999074d9277c5da2a43f252d74366230da0', // TODO: GOERLI ?
		WETH_TOKEN_ADDRESS: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
		TOKEN_DISTRO_ADDRESS: '0x4358c99abFe7A9983B6c96785b8870b5412C5B4B',
		GIV: {
			network: MAINNET_NETWORK_NUMBER,
			LM_ADDRESS: '0x929C9353D67af21411d4475B30D960F23C209abd',
			BUY_LINK:
				'https://app.uniswap.org/#/swap?outputCurrency=0x29434A25abd94AE882aA883eea81585Aaa5b078D',
			discontinued: SEPT_8TH_2022,
			active: false,
			archived: true,
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
				active: false,
				archived: true,
				discontinued: SEPT_8TH_2022,
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
				active: true,
			},
			// {
			// 	// TODO: GOERLI
			// 	POOL_ADDRESS: '0xA0D500fd3479CBCb64a2238082b7a1Df9f87d98D',
			// 	LM_ADDRESS: '0x7CD371D230338C74563A9A23AF72dd009a7D1b1C',
			// 	type: StakingType.ICHI_GIV_ONEGIV,
			// 	platform: StakingPlatform.ICHI,
			// 	ichiApi: 'https://api.ichi.org/v1/farms/20009',
			// 	platformTitle: 'Angel Vault',
			// 	title: 'oneGIV / GIV',
			// 	description: 'Angel Vault',
			// 	provideLiquidityLink:
			// 		'https://3ea0967f.appichiorg.pages.dev/vault/?poolId=5004&back=vault',
			// 	unit: 'LP',
			// 	active: true,
			// 	farmStartTimeMS: 1659366000000,
			// 	introCard: {
			// 		icon: 'angelVault',
			// 		title: 'Angel Vault',
			// 		description: `The Angel Vault is shared Univ3 position structured to protect GIV from downward volatility.\n\nProvide oneGIV as liquidity in our Angel Vault and stake the LP token to earn rewards proportional to the liquidity provided. When you remove liquidity, you will get oneGIV & GIV proportional to the holdings in the Angel Vault.`,
			// 		link: 'https://docs.ichi.org/ichi-docs-v3/ichi-vaults/angel-vaults',
			// 	},
			// },
		],
		uniswapV2Subgraph:
			'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
		regenStreams: [
			// // TODO: GOERLI
			// {
			// 	tokenDistroAddress:
			// 		'0xBb974e08774544a361BCF496fE61DaB9Df29AFFc',
			// 	type: StreamType.CULT,
			// 	title: 'CULT DAO',
			// 	rewardTokenAddress:
			// 		'0x3e4d3FadEE2338D420bb5E5cB26aAd96c165476c',
			// 	rewardTokenSymbol: 'CULT',
			// 	tokenAddressOnUniswapV2:
			// 		'0xf0f9d895aca5c8678f706fb8216fa22957685a13',
			// },
		],
		regenFarms: [
			// // TODO: GOERLI
			// {
			// 	POOL_ADDRESS: '0x6bb32725aa31b1a99e7c782e0605b0fb57e4b9e6',
			// 	LM_ADDRESS: '0x9d23d449af3e2c07a286688c85ff5d3d4c219d79',
			// 	type: StakingType.UNISWAPV2_CULT_ETH,
			// 	platform: StakingPlatform.UNISWAP,
			// 	title: 'CULT / ETH',
			// 	description: '50% CULT, 50% ETH',
			// 	provideLiquidityLink:
			// 		'https://app.uniswap.org/#/add/v2/0x3e4d3FadEE2338D420bb5E5cB26aAd96c165476c/ETH?chain=kovan',
			// 	unit: 'LP',
			// 	regenStreamType: StreamType.CULT,
			// 	regenFarmType: RegenFarmType.CULT_ETH,
			// 	introCard: {
			// 		title: 'CULT',
			// 		description: `The purpose of CULT is to empower those building and contributing to our decentralized future. Our society makes it as difficult as possible to break away from societal, economic and other norms, and CULT serves to fund and support those who are working to take back our future. CULT is a reminder that the power in people is stronger than the people in power.\n\n CULT is the governance token of the Cult DAO. Every transaction of the CULT token allows you to contribute & fast-forward economic & societal change by contributing a 0.4% tax to the treasury. Fight from within until you get out, or change the system in doing so.`,
			// 		link: 'https://cultdao.io/',
			// 	},
			// 	farmStartTimeMS: 1646306818206,
			// 	active: true,
			// },
		],
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
			'https://api.thegraph.com/subgraphs/name/aminlatifi/giveconomy-xdai-deployment-seven',

		TOKEN_ADDRESS: '0x83a8eea6427985C523a0c4d9d3E62C051B6580d3',
		gGIV_ADDRESS: '0x4Bee761229AD815Cc64461783580F629dA0f0350',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		MERKLE_ADDRESS: '0xc87403C70c9FBfb594d98d3B5E695BBE4C694188',
		TOKEN_DISTRO_ADDRESS: '0x18a46865AAbAf416a970eaA8625CFC430D2364A1',

		nodeUrl: 'https://rpc.gnosischain.com/',

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
				active: false,
				archived: true,
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
				active: false,
				archived: true,
				discontinued: SEPT_8TH_2022,
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
				active: false,
				archived: true,
				farmStartTimeMS: 1655997000000,
				discontinued: SEPT_8TH_2022,
			},
		],

		uniswapV2Subgraph:
			'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-v2',

		regenStreams: [
			{
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
		regenFarms: [
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
				regenFarmType: RegenFarmType.FOX_HNY,
				introCard: {
					title: 'FOX',
					description:
						'ShapeShift is the free and open-source one-stop-shop for cross-chain DeFi. Buy, sell, send, receive, trade, and earn yield on your crypto across a growing number of protocols and chains with no added fees ever. FOX is the governance token of the ShapeShift DAO.',
					link: 'https://shapeshift.com/',
				},
				farmStartTimeMS: 1646306818206,
				active: true,
			},
		],
	},
};

export default config;
