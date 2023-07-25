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
	process.env.NEXT_PUBLIC_BASE_ROUTE || 'https://mainnet.serve.giveth.io';
const NOTIFICATION_BASE_ROUTE =
	process.env.NEXT_PUBLIC_NOTIFICATION_BASE_ROUTE ||
	'https://notification.giveth.io';
const SEPT_8TH_2022 = 1662595200000;
const MAINNET_NETWORK_NUMBER = 1; // Mainnet
const XDAI_NETWORK_NUMBER = 100; // xDAI
const POLYGON_NETWORK_NUMBER = 137;
const OPTIMISM_NETWORK_NUMBER = 10;
const CELO_NETWORK_NUMBER = 42220;

const config: EnvConfig = {
	GIVETH_PROJECT_ID: 1,
	BASE_ROUTE: BASE_ROUTE,
	BACKEND_LINK:
		process.env.NEXT_PUBLIC_BACKEND_LINK || `${BASE_ROUTE}/graphql`,
	FRONTEND_LINK: process.env.NEXT_PUBLIC_FRONTEND_LINK || 'https://giveth.io',
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
		'https://gardens.1hive.org/#/xdai/garden/0xb25f0ee2d26461e2b5b3d3ddafe197a0da677b98',

	RARIBLE_ADDRESS: 'https://rarible.com/',
	MAINNET_CONFIG: {
		...networksParams[1],

		DAI_CONTRACT_ADDRESS: '0x6b175474e89094c44da98b954eedeac495271d0f',
		PFP_CONTRACT_ADDRESS: '0x78fde77737d5b9ab32fc718c9535c7f1b8ce84db',

		gasPreference: {
			// Keep it empty for automatic configuration
		},

		blockExplorerName: ['etherscan'],
		subgraphAddress:
			'https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-second-mainnet',

		TOKEN_ADDRESS: '0x900db999074d9277c5da2a43f252d74366230da0',
		tokenAddressOnUniswapV2: '0x900db999074d9277c5da2a43f252d74366230da0',
		WETH_TOKEN_ADDRESS: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		TOKEN_DISTRO_ADDRESS: '0x87dE995F6744B75bBe0255A973081142aDb61f4d',
		GIV: {
			network: MAINNET_NETWORK_NUMBER,
			LM_ADDRESS: '0x4B9EfAE862a1755F7CEcb021856D467E86976755',
			BUY_LINK:
				'https://app.uniswap.org/#/swap?outputCurrency=0x900db999074d9277c5da2a43f252d74366230da0',
			platformTitle: 'GIV staking',
			exploited: true,
			farmEndTimeMS: SEPT_8TH_2022,
		},

		nodeUrl: 'https://mainnet.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			{
				network: MAINNET_NETWORK_NUMBER,
				POOL_ADDRESS: '0xbeba1666c62c65e58770376de332891b09461eeb',
				LM_ADDRESS: '0xa4523D703F663615Bd41606B46B58dEb2F926D98',
				type: StakingType.UNISWAPV2_GIV_DAI,
				platform: StakingPlatform.UNISWAP,
				title: 'GIV / DAI',
				description: '50% GIV, 50% DAI',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0x6B175474E89094C44Da98b954EedeAC495271d0F/0x900dB999074d9277c5DA2A43F252D74366230DA0?chain=mainnet',
				unit: 'LP',
				farmStartTimeMS: 1651345200000,
				farmEndTimeMS: SEPT_8TH_2022,
			},
			{
				network: MAINNET_NETWORK_NUMBER,
				POOL_ADDRESS: '0xc3151A58d519B94E915f66B044De3E55F77c2dd9',
				LM_ADDRESS: '0xA4b727DF6fD608d1835e3440288c73fB28c4eF16',
				type: StakingType.ICHI_GIV_ONEGIV,
				platform: StakingPlatform.ICHI,
				ichiApi: 'https://api.ichi.org/v1/farms/20009',
				platformTitle: 'Angel Vault',
				title: 'oneGIV / GIV',
				description: 'Angel Vault',
				provideLiquidityLink:
					'https://app.ichi.org/vault?poolId=20009&back=vault',
				unit: 'LP',
				farmStartTimeMS: 1659625200000,
				introCard: {
					title: 'Angel Vault',
					icon: 'angelVault',
					description: `The Angel Vault is shared Univ3 position structured to protect GIV from downward volatility.\n\nProvide oneGIV as liquidity in our Angel Vault and stake the LP token to earn rewards proportional to the liquidity provided. When you remove liquidity, you will get oneGIV & GIV proportional to the holdings in the Angel Vault.`,
					link: 'https://medium.com/@karmaticacid/the-evolution-of-giv-liquidity-introducing-the-giveth-angel-vault-5ee34b2965c1',
				},
				exploited: true,
				farmEndTimeMS: 1664922291000,
			},
			{
				network: MAINNET_NETWORK_NUMBER,
				POOL_ADDRESS: '0x7819f1532c49388106f7762328c51ee70edd134c',
				VAULT_ADDRESS: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
				POOL_ID:
					'0x7819f1532c49388106f7762328c51ee70edd134c000200000000000000000109',
				LM_ADDRESS: '0xc0dbDcA66a0636236fAbe1B3C16B1bD4C84bB1E1',
				type: StakingType.BALANCER_ETH_GIV,
				platform: StakingPlatform.BALANCER,
				title: 'GIV / ETH',
				description: '80% GIV, 20% ETH',
				provideLiquidityLink:
					'https://app.balancer.fi/#/pool/0x7819f1532c49388106f7762328c51ee70edd134c000200000000000000000109',
				unit: 'LP',
				exploited: true,
				farmEndTimeMS: 1660946400000,
			},
			// {
			// 	network: MAINNET_NETWORK_NUMBER,
			// 	INCENTIVE_START_TIME: 1640361600,
			// 	INCENTIVE_END_TIME: 1656086400,
			// 	INCENTIVE_REWARD_AMOUNT: 10000000,
			// 	NFT_POSITIONS_MANAGER_ADDRESS:
			// 		'0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
			// 	UNISWAP_V3_STAKER: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
			// 	STAKING_REWARDS_CONTRACT:
			// 		'0x79A7CAD3Ac4554C133dCaaa9Bc3319385Eb7FD5D',
			// 	REWARD_TOKEN: '0x3115e5aAa3D6f742d09fbB649150dfE285a9c2A3',
			// 	UNISWAP_V3_LP_POOL:
			// 		'0xc763b6b3d0f75167db95daa6a0a0d75dd467c4e1',
			// 	INCENTIVE_REFUNDEE_ADDRESS:
			// 		'0x34d27210cC319EC5281bDc4DC2ad8FbcF4EAEAEB',
			// 	type: StakingType.UNISWAPV3_ETH_GIV,
			// 	platform: StakingPlatform.UNISWAP,
			// 	title: 'GIV / ETH',
			// 	description: '0.3% tier only',
			// 	provideLiquidityLink: `https://app.uniswap.org/#/add/ETH/0x900dB999074d9277c5DA2A43F252D74366230DA0/3000`,
			// 	unit: 'NFT',
			// 	infinitePositionId: 193935,
			// 	farmEndTimeMS: 1660946400000,
			// },
		],
		regenPools: [
			{
				network: MAINNET_NETWORK_NUMBER,
				POOL_ADDRESS: '0x5281E311734869C64ca60eF047fd87759397EFe6',
				LM_ADDRESS: '0xa479103c2618aD514653B53F064Bc6c9dC35a30b',
				type: StakingType.UNISWAPV2_CULT_ETH,
				platform: StakingPlatform.UNISWAP,
				title: 'CULT / ETH',
				description: '50% CULT, 50% ETH',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0xf0f9D895aCa5c8678f706FB8216fa22957685A13/ETH?chain=mainnet',
				unit: 'LP',
				regenStreamType: StreamType.CULT,
				farmStartTimeMS: 1655218800000,
				introCard: {
					title: 'CULT',
					description: `The purpose of CULT is to empower those building and contributing to our decentralized future. Our society makes it as difficult as possible to break away from societal, economic and other norms, and CULT serves to fund and support those who are working to take back our future. CULT is a reminder that the power in people is stronger than the people in power.\n\n CULT is the governance token of the Cult DAO. Every transaction of the CULT token allows you to contribute & fast-forward economic & societal change by contributing a 0.4% tax to the treasury. Fight from within until you get out, or change the system in doing so.`,
					link: 'https://cultdao.io/',
				},
				exploited: true,
				farmEndTimeMS: 1664922291000,
			},
			{
				network: MAINNET_NETWORK_NUMBER,
				POOL_ADDRESS: '0x5281E311734869C64ca60eF047fd87759397EFe6',
				LM_ADDRESS: '0xcA128517053e8c459E12E3aCB615bb421d768219',
				type: StakingType.UNISWAPV2_CULT_ETH,
				platform: StakingPlatform.UNISWAP,
				title: 'CULT / ETH',
				description: '50% CULT, 50% ETH - V2',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0xf0f9D895aCa5c8678f706FB8216fa22957685A13/ETH?chain=mainnet',
				unit: 'LP',
				regenStreamType: StreamType.CULT,
				farmStartTimeMS: 1668691800000,
				farmEndTimeMS: 1669901843000,
				introCard: {
					title: 'CULT',
					description: `The purpose of CULT is to empower those building and contributing to our decentralized future. Our society makes it as difficult as possible to break away from societal, economic and other norms, and CULT serves to fund and support those who are working to take back our future. CULT is a reminder that the power in people is stronger than the people in power.\n\n CULT is the governance token of the Cult DAO. Every transaction of the CULT token allows you to contribute & fast-forward economic & societal change by contributing a 0.4% tax to the treasury. Fight from within until you get out, or change the system in doing so.`,
					link: 'https://cultdao.io/',
				},
			},
		],
		uniswapV2Subgraph:
			'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
		regenStreams: [
			{
				network: MAINNET_NETWORK_NUMBER,
				tokenDistroAddress:
					'0x73f2D115C2cBAa3b5F477A78F7A7CD348D8b70a2',
				type: StreamType.CULT,
				title: 'CULT DAO',
				rewardTokenAddress:
					'0xf0f9D895aCa5c8678f706FB8216fa22957685A13',
				rewardTokenSymbol: 'CULT',
				tokenAddressOnUniswapV2:
					'0xf0f9D895aCa5c8678f706FB8216fa22957685A13',
			},
		],
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
			'https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-second-xdai',

		TOKEN_ADDRESS: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		gGIV_ADDRESS: '0xfFBAbEb49be77E5254333d5fdfF72920B989425f',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		MERKLE_ADDRESS: '0xFad63adEFb8203F7605F25f6a921c8bf45604A5e',
		TOKEN_DISTRO_ADDRESS: '0xc0dbDcA66a0636236fAbe1B3C16B1bD4C84bB1E1',

		GIV: {
			network: XDAI_NETWORK_NUMBER,
			LM_ADDRESS: '0xD93d3bDBa18ebcB3317a57119ea44ed2Cf41C2F2',
			GARDEN_ADDRESS: '0x24f2d06446af8d6e89febc205e7936a602a87b60',
			BUY_LINK:
				'https://app.honeyswap.org/#/swap?outputCurrency=0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
			platformTitle: 'GIVPOWER',
		},

		pools: [
			{
				network: XDAI_NETWORK_NUMBER,
				POOL_ADDRESS: '0x08ea9f608656A4a775EF73f5B187a2F1AE2ae10e',
				LM_ADDRESS: '0x4B9EfAE862a1755F7CEcb021856D467E86976755',
				type: StakingType.HONEYSWAP_GIV_HNY,
				platform: StakingPlatform.HONEYSWAP,
				title: 'GIV / HNY',
				description: '50% GIV, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75/0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
				unit: 'LP',
				farmEndTimeMS: 1656108000000,
			},
			{
				network: XDAI_NETWORK_NUMBER,
				POOL_ADDRESS: '0x55FF0cef43F0DF88226E9D87D09fA036017F5586',
				LM_ADDRESS: '0xfB429010C1e9D08B7347F968a7d88f0207807EF0',
				type: StakingType.SUSHISWAP_ETH_GIV,
				platform: StakingPlatform.SUSHISWAP,
				title: 'GIV / ETH',
				description: '50% ETH, 50% GIV',
				provideLiquidityLink:
					'https://gnosis.sushi.com/add/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1/0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
				unit: 'LP',
				farmEndTimeMS: 1656108000,
			},
			{
				network: XDAI_NETWORK_NUMBER,
				POOL_ADDRESS: '0xB7189A7Ea38FA31210A79fe282AEC5736Ad5fA57',
				LM_ADDRESS: '0x24A6067fEd46dc8663794c4d39Ec91b074cf85D4',
				type: StakingType.HONEYSWAP_GIV_DAI,
				platform: StakingPlatform.HONEYSWAP,
				title: 'GIV / xDAI',
				description: '50% GIV, 50% xDAI',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75/xdai',
				unit: 'LP',
				farmEndTimeMS: 1656108000000,
				farmStartTimeMS: 1656086400000,
			},
		],
		regenPools: [
			{
				network: XDAI_NETWORK_NUMBER,
				POOL_ADDRESS: '0x8a0bee989c591142414ad67fb604539d917889df',
				LM_ADDRESS: '0x502EC7a040F486EE6Cb7d634D94764874B29dE68',
				type: StakingType.HONEYSWAP_FOX_HNY,
				platform: StakingPlatform.HONEYSWAP,
				title: 'FOX / HNY',
				description: '50% FOX, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x21a42669643f45bc0e086b8fc2ed70c23d67509d/0x71850b7e9ee3f13ab46d67167341e4bdc905eef9?chainId=100',
				unit: 'LP',
				regenStreamType: StreamType.FOX,
				farmStartTimeMS: 1649001600000,
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
				POOL_ADDRESS: '0xc22313fd39f7d4d73a89558f9e8e444c86464bac',
				LM_ADDRESS: '0x9A333AD00868472c0314F76DB8dA305B83890129',
				type: StakingType.HONEYSWAP_FOX_XDAI,
				platform: StakingPlatform.HONEYSWAP,
				title: 'FOX / xDAI',
				description: '50% FOX, 50% xDAI',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x21a42669643f45bc0e086b8fc2ed70c23d67509d/XDAI?chainId=100',
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
					'0xA9a37a14E562D0E1d335B4714E3455483ede7A9a',
				type: StreamType.FOX,
				title: 'ShapeShift DAO',
				rewardTokenAddress:
					'0x21a42669643f45bc0e086b8fc2ed70c23d67509d',
				rewardTokenSymbol: 'FOX',
				tokenAddressOnUniswapV2:
					'0x21a42669643f45bc0e086b8fc2ed70c23d67509d',
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
		nodeUrl: networksParams[42220]?.rpcUrls[0],
		...networksParams[42220],
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		blockExplorerName: ['CeloScan'],
		subgraphAddress: '',
	},
};

export default config;
