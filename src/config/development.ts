import {
	EnvConfig,
	RegenFarmType,
	StakingPlatform,
	StakingType,
	StreamType,
} from '@/types/config';
import { gwei2wei } from '@/helpers/blockchain';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;
const BASE_ROUTE = 'https://serve.giveth.io';

const config: EnvConfig = {
	BACKEND_LINK: `${BASE_ROUTE}/graphql`,
	FRONTEND_LINK: 'https://staging.giveth.io',
	MICROSERVICES: {
		authentication: `${BASE_ROUTE}/siweauthmicroservice/v1`,
	},
	MAINNET_NETWORK_NUMBER: 42, // Kovan
	XDAI_NETWORK_NUMBER: 100, // xDAI

	GARDEN_LINK:
		'https://gardens-staging.1hive.org/#/xdai/garden/0x16388d99199a74810fc572049b3d4d657e7d5deb',

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
			'https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-kovan-staging',

		TOKEN_ADDRESS: '0x29434A25abd94AE882aA883eea81585Aaa5b078D',
		tokenAddressOnUniswapV2: '0x900db999074d9277c5da2a43f252d74366230da0',
		WETH_TOKEN_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
		TOKEN_DISTRO_ADDRESS: '0x2C84Ab41b53C52959a794830fe296Fd717c33337',
		GIV: {
			LM_ADDRESS: '0x17207684344B206A06BF8651d6e5e1833660418b',
			BUY_LINK:
				'https://app.uniswap.org/#/swap?outputCurrency=0x29434A25abd94AE882aA883eea81585Aaa5b078D',
		},

		nodeUrl: 'https://kovan.infura.io/v3/' + INFURA_API_KEY,

		pools: [
			{
				POOL_ADDRESS: '0x6D5481911052a42c109F1f56354BEB07Ec430b85',
				LM_ADDRESS: '0x9e4EcF5fE5F58C888C84338525422A1D0915f6ff',
				type: StakingType.UNISWAPV2_GIV_DAI,
				platform: StakingPlatform.UNISWAP,
				title: 'GIV / DAI',
				description: '50% GIV, 50% DAI',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa/0x29434A25abd94AE882aA883eea81585Aaa5b078D?chain=kovan',
				unit: 'LP',
				active: true,
			},
			{
				POOL_ADDRESS: '0x8a6b25e33b12d1bb6929a8793961076bd1f9d3eb',
				VAULT_ADDRESS: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
				POOL_ID:
					'0x8a6b25e33b12d1bb6929a8793961076bd1f9d3eb00020000000000000000053f',
				LM_ADDRESS: '0x4B319c068685aF260c91407B651918307df30061',
				type: StakingType.BALANCER_ETH_GIV,
				platform: StakingPlatform.BALANCER,
				title: 'GIV / ETH',
				description: '80% GIV, 20% ETH',
				provideLiquidityLink:
					'https://kovan.app.balancer.fi/#/pool/0x8a6b25e33b12d1bb6929a8793961076bd1f9d3eb00020000000000000000053f',
				unit: 'LP',
				active: true,
			},
			{
				INCENTIVE_START_TIME: 1640272200,
				INCENTIVE_END_TIME: 1655997000,
				INCENTIVE_REWARD_AMOUNT: 10000000,
				NFT_POSITIONS_MANAGER_ADDRESS:
					'0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
				UNISWAP_V3_STAKER: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
				STAKING_REWARDS_CONTRACT:
					'0xfA656B81cEC0deD6Acd5Bb1a60A06914aB21A0B3',
				REWARD_TOKEN: '0xDfbb5C70006B357d30BB335f55a01e6b0151Bcb5',
				UNISWAP_V3_LP_POOL:
					'0x3c2455a3ee0d824941c9329c01a66b86078c3e82',
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
		regenStreams: [
			{
				tokenDistroAddress:
					'0xBb974e08774544a361BCF496fE61DaB9Df29AFFc',
				type: StreamType.CULT,
				title: 'CULT DAO',
				rewardTokenAddress:
					'0x3e4d3FadEE2338D420bb5E5cB26aAd96c165476c',
				rewardTokenSymbol: 'CULT',
				tokenAddressOnUniswapV2:
					'0xf0f9d895aca5c8678f706fb8216fa22957685a13',
			},
		],
		regenFarms: [
			{
				POOL_ADDRESS: '0x6bb32725aa31b1a99e7c782e0605b0fb57e4b9e6',
				LM_ADDRESS: '0x9d23d449af3e2c07a286688c85ff5d3d4c219d79',
				type: StakingType.UNISWAPV2_CULT_ETH,
				platform: StakingPlatform.UNISWAP,
				title: 'CULT / ETH',
				description: '50% CULT, 50% ETH',
				provideLiquidityLink:
					'https://app.uniswap.org/#/add/v2/0x3e4d3FadEE2338D420bb5E5cB26aAd96c165476c/ETH?chain=kovan',
				unit: 'LP',
				regenStreamType: StreamType.CULT,
				regenFarmType: RegenFarmType.CULT_ETH,
				regenFarmIntro: {
					title: 'CULT',
					description: `The purpose of CULT is to empower those building and contributing to our decentralized future. Our society makes it as difficult as possible to break away from societal, economic and other norms, and CULT serves to fund and support those who are working to take back our future. CULT is a reminder that the power in people is stronger than the people in power.\n\n CULT is the governance token of the Cult DAO. Every transaction of the CULT token allows you to contribute & fast-forward economic & societal change by contributing a 0.4% tax to the treasury. Fight from within until you get out, or change the system in doing so.`,
					link: 'https://cultdao.io/',
				},
				farmStartTimeMS: 1646306818206,
				active: true,
			},
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
			'https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-xdai-staging',

		TOKEN_ADDRESS: '0x83a8eea6427985C523a0c4d9d3E62C051B6580d3',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		MERKLE_ADDRESS: '0xc87403C70c9FBfb594d98d3B5E695BBE4C694188',
		TOKEN_DISTRO_ADDRESS: '0x18a46865AAbAf416a970eaA8625CFC430D2364A1',

		nodeUrl: 'https://rpc.xdaichain.com/',

		GIV: {
			LM_ADDRESS: '0xDAEa66Adc97833781139373DF5B3bcEd3fdda5b1',
			GARDEN_ADDRESS: '0x9ff80789b74d1d2b7cf5a568ea82409c2b327861',
			BUY_LINK:
				'https://app.honeyswap.org/#/swap?outputCurrency=0x83a8eea6427985C523a0c4d9d3E62C051B6580d3',
		},

		pools: [
			{
				POOL_ADDRESS: '0x31A5AeA76Af79F592a3A3F46a9f6Cb118990433b',
				LM_ADDRESS: '0xC09147Ac0aC8B5271F03b511c3554e3238Ae3201',
				type: StakingType.HONEYSWAP_GIV_HNY,
				platform: StakingPlatform.HONEYSWAP,
				title: 'GIV / HNY',
				description: '50% GIV, 50% HNY',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x83a8eea6427985C523a0c4d9d3E62C051B6580d3/0x69F79C9eA174d4659B18c7993c7EFbBbB58cF068',
				unit: 'LP',
				active: true,
			},
			{
				POOL_ADDRESS: '0x437B0da7932b21F54488fD80Ee09b519a6f4d8AD',
				LM_ADDRESS: '0x83535D6DeF8E881E647C00462315bae9A6E7BD09',
				type: StakingType.SUSHISWAP_ETH_GIV,
				platform: StakingPlatform.SUSHISWAP,
				title: 'GIV / ETH',
				description: '50% ETH, 50% GIV',
				provideLiquidityLink:
					'https://app.sushi.com/add/0x83a8eea6427985C523a0c4d9d3E62C051B6580d3/0x736a98655049433f79dCcF5e54b887E8890b63D1',
				unit: 'LP',
				active: true,
			},
			{
				POOL_ADDRESS: '0xB4E0fc187f0EEd740D93eF15Cd14750a2780fc2A',
				LM_ADDRESS: '0xe2c436E177C39A5D18AF6923Fc2Fc673f4729C05',
				type: StakingType.HONEYSWAP_GIV_DAI,
				platform: StakingPlatform.HONEYSWAP,
				title: 'GIV / xDAI',
				description: '50% GIV, 50% xDAI',
				provideLiquidityLink:
					'https://app.honeyswap.org/#/add/0x83a8eea6427985C523a0c4d9d3E62C051B6580d3/0x97c4dD5cE204b8c1F2f3B8fBfBBDC771d867d18c',
				unit: 'LP',
				active: true,
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
				regenFarmIntro: {
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
