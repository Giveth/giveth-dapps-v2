import { EnvConfig, StakingPlatform, StakingType } from '@/types/config';
import { gwei2wei } from '@/helpers/blockchain';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;
const BASE_ROUTE = 'https://serve.giveth.io';
const SEPT_8TH_2022 = 1662595200000;
const MAINNET_NETWORK_NUMBER = 5; // Goerli
const XDAI_NETWORK_NUMBER = 100; // xDAI
// IMPORTANT: Using dev to make it work until staging is merged
// const BASE_ROUTE = 'https://dev.serve.giveth.io';

const config: EnvConfig = {
	BACKEND_LINK: `${BASE_ROUTE}/graphql`,
	FRONTEND_LINK: 'https://staging.giveth.io',
	MICROSERVICES: {
		authentication: `${BASE_ROUTE}/siweauthmicroservice/v1`,
	},
	MAINNET_NETWORK_NUMBER: MAINNET_NETWORK_NUMBER,
	XDAI_NETWORK_NUMBER: XDAI_NETWORK_NUMBER,

	GARDEN_LINK:
		'https://gardens-staging.1hive.org/#/xdai/garden/0xb3f3da0080a8811d887531ca4c0dbfe3490bd1a1',

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
				active: true,
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
			'https://api.thegraph.com/subgraphs/name/aminlatifi/givpower-deployment-six',

		TOKEN_ADDRESS: '0x780FE5de651a3ea62E572f591BF848cFEBaf2163',
		gGIV_ADDRESS: '0x1460aaf51f4e0b1b59bb41981cb4aa5a1b377776',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		MERKLE_ADDRESS: '0x06BA4122FC4F3AbCdAFD2fF1dD83A88A63842309',
		TOKEN_DISTRO_ADDRESS: '0x74B557bec1A496a8E9BE57e9A1530A15364C87Be',

		nodeUrl: 'https://rpc.gnosischain.com/',

		GIV: {
			network: XDAI_NETWORK_NUMBER,
			LM_ADDRESS: '0x898Baa558A401e59Cb2aA77bb8b2D89978Cf506F',
			GARDEN_ADDRESS: '0x642c18755aa5a2bf6861349327d2448813b992ba',
			BUY_LINK:
				'https://app.honeyswap.org/#/swap?outputCurrency=0x780FE5de651a3ea62E572f591BF848cFEBaf2163',
		},

		pools: [
			{
				network: XDAI_NETWORK_NUMBER,
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
				archived: true,
			},
			{
				network: XDAI_NETWORK_NUMBER,
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
