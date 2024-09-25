import {
	celo,
	classic,
	gnosis,
	mainnet,
	optimism,
	polygon,
	arbitrum,
	base,
	polygonZkEvm,
} from '@wagmi/core/chains';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import React from 'react';
import { type Chain } from 'viem';
import {
	ChainType,
	EnvConfig,
	NonEVMChain,
	StakingPlatform,
	StakingType,
	StreamType,
} from '@/types/config';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconPolygon } from '@/components/Icons/Polygon';
import { IconOptimism } from '@/components/Icons/Optimism';
import { IconCelo } from '@/components/Icons/Celo';
import { IconClassic } from '@/components/Icons/Classic';
import IconBase from '@/components/Icons/Base';
import IconSolana from '@/components/Icons/Solana';
import IconArbitrum from '@/components/Icons/Arbitrum';
import IconZKEVM from '@/components/Icons/ZKEVM';
import IconStellar from '@/components/Icons/Stellar';

const GNOSIS_GIV_TOKEN_ADDRESS = '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75';
const OPTIMISM_GIV_TOKEN_ADDRESS = '0x528CDc92eAB044E1E39FE43B9514bfdAB4412B98';
const ZKEVM_GIV_TOKEN_ADDRESS = '0xddAFB91475bBf6210a151FA911AC8fdA7dE46Ec2';

const SEPT_8TH_2022 = 1662595200000;
const MAINNET_NETWORK_NUMBER = 1; // Mainnet
const GNOSIS_NETWORK_NUMBER = 100; // xDAI
const POLYGON_NETWORK_NUMBER = 137;
const OPTIMISM_NETWORK_NUMBER = 10;
const CELO_NETWORK_NUMBER = 42220;
const ARBITRUM_NETWORK_NUMBER = 42161;
const BASE_NETWORK_NUMBER = 8453;
const ZKEVM_NETWORK_NUMBER = 1101;
const CLASSIC_NETWORK_NUMBER = 61;
const STELLAR_NETWORK_NUMBER = 1500;
const SOLANA_NETWORK_NUMBER = 101;

const SOLANA_NETWORK: NonEVMChain = {
	id: SOLANA_NETWORK_NUMBER,
	networkId: SOLANA_NETWORK_NUMBER,
	chainType: ChainType.SOLANA,
	adapterNetwork: WalletAdapterNetwork.Mainnet,
	name: 'Solana',
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
	nativeCurrency: {
		name: 'Stellar Lumens',
		symbol: 'XLM',
		decimals: 7,
	},
	blockExplorers: {
		default: {
			name: 'Stellar Explorer',
			url: 'https://stellar.expert/explorer/public/',
		},
	},
};

const EVM_CHAINS = [
	mainnet,
	gnosis,
	polygon,
	optimism,
	celo,
	arbitrum,
	classic,
	base,
	polygonZkEvm,
] as readonly [Chain, ...Chain[]];

const NON_EVM_CHAINS: NonEVMChain[] = [STELLAR_NETWORK, SOLANA_NETWORK];

const BASE_ROUTE =
	process.env.NEXT_PUBLIC_BASE_ROUTE || 'https://mainnet.serve.giveth.io';
const BACKEND_LINK =
	process.env.NEXT_PUBLIC_BACKEND_LINK || `${BASE_ROUTE}/graphql`;
const FRONTEND_LINK =
	process.env.NEXT_PUBLIC_FRONTEND_LINK || 'https://giveth.io';
const NOTIFICATION_BASE_ROUTE =
	process.env.NEXT_PUBLIC_NOTIFICATION_BASE_ROUTE ||
	'https://notification.giveth.io';
const AUTH_BASE_ROUTE =
	process.env.NEXT_PUBLIC_AUTH_BASE_ROUTE || 'https://auth.giveth.io/v1';

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
	BASE_NETWORK_NUMBER: BASE_NETWORK_NUMBER,
	ZKEVM_NETWORK_NUMBER: ZKEVM_NETWORK_NUMBER,
	CLASSIC_NETWORK_NUMBER: CLASSIC_NETWORK_NUMBER,
	STELLAR_NETWORK_NUMBER: STELLAR_NETWORK_NUMBER,

	RARIBLE_ADDRESS: 'https://rarible.com/',
	MAINNET_CONFIG: {
		...mainnet,
		chainType: ChainType.EVM,
		DAI_TOKEN_ADDRESS: '0x6b175474e89094c44da98b954eedeac495271d0f',
		PFP_CONTRACT_ADDRESS: '0x78fde77737d5b9ab32fc718c9535c7f1b8ce84db',

		gasPreference: {
			// Keep it empty for automatic configuration
		},

		subgraphAddress:
			process.env.NEXT_PUBLIC_SUBGRAPH_MAINNET ||
			'https://gateway-arbitrum.network.thegraph.com/api/720ca27934ee17d259dc2975d9a6d714/subgraphs/id/9QK3vLoWF69TXSenUzQkkLhessaViu4naE58gRyKCxU7',
		coingeckoChainName: 'ethereum',
		chainLogo: (logoSize = 24) => <IconEthereum size={logoSize} />,

		GIV_TOKEN_ADDRESS: '0x900db999074d9277c5da2a43f252d74366230da0',
		GIV_BUY_LINK: 'https://linktr.ee/GIVtoken',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		WETH_TOKEN_ADDRESS: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		TOKEN_DISTRO_ADDRESS: '0x87dE995F6744B75bBe0255A973081142aDb61f4d',
		// GIV: {
		// 	network: MAINNET_NETWORK_NUMBER,
		// 	LM_ADDRESS: '0x4B9EfAE862a1755F7CEcb021856D467E86976755',
		//
		// 	platformTitle: 'GIV staking',
		// 	exploited: true,
		// 	farmEndTimeMS: SEPT_8TH_2022,
		// },

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
			process.env.NEXT_PUBLIC_SUBGRAPH_UNISWAP_V2 ||
			'https://gateway-arbitrum.network.thegraph.com/api/49102048d5822209c7cd189f8e4a51a9/subgraphs/id/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu',
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

	GNOSIS_CONFIG: {
		...gnosis,
		chainType: ChainType.EVM,
		gasPreference: {
			maxFeePerGas: (2e9).toString(),
			maxPriorityFeePerGas: (1e9).toString(),
		},

		subgraphAddress:
			process.env.NEXT_PUBLIC_SUBGRAPH_GNOSIS ||
			'https://gateway-arbitrum.network.thegraph.com/api/720ca27934ee17d259dc2975d9a6d714/subgraphs/id/Bbz1imi78Set7VYKxqwNGZ4dwqJpEUBNYqGsbPPZPh4q',
		coingeckoChainName: 'xdai',
		chainLogo: (logoSize = 24) => <IconGnosisChain size={logoSize} />,

		GIV_TOKEN_ADDRESS: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		GIV_BUY_LINK: 'https://linktr.ee/GIVtoken',
		gGIV_TOKEN_ADDRESS: '0xfFBAbEb49be77E5254333d5fdfF72920B989425f',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		MERKLE_ADDRESS: '0xFad63adEFb8203F7605F25f6a921c8bf45604A5e',
		TOKEN_DISTRO_ADDRESS: '0xc0dbDcA66a0636236fAbe1B3C16B1bD4C84bB1E1',
		GIVPOWER: {
			network: GNOSIS_NETWORK_NUMBER,
			LM_ADDRESS: '0xD93d3bDBa18ebcB3317a57119ea44ed2Cf41C2F2',
			GARDEN_ADDRESS: '0x24f2d06446af8d6e89febc205e7936a602a87b60',
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
				network: GNOSIS_NETWORK_NUMBER,
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
				network: GNOSIS_NETWORK_NUMBER,
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
				network: GNOSIS_NETWORK_NUMBER,
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
				network: GNOSIS_NETWORK_NUMBER,
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
				farmEndTimeMS: 1701302400000,
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
		...polygon,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		subgraphAddress: '',
		coingeckoChainName: 'polygon-pos',
		chainLogo: (logoSize = 24) => <IconPolygon size={logoSize} />,
	},

	OPTIMISM_CONFIG: {
		...optimism,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		anchorRegistryAddress: '0x4AAcca72145e1dF2aeC137E1f3C5E3D75DB8b5f3',
		subgraphAddress:
			process.env.NEXT_PUBLIC_SUBGRAPH_OPTIMISM ||
			'https://gateway-arbitrum.network.thegraph.com/api/720ca27934ee17d259dc2975d9a6d714/subgraphs/id/zyoJAUh2eGLEbEkBqESDD497qHLGH1YcKH9PBEMnWjM',
		GIV_TOKEN_ADDRESS: OPTIMISM_GIV_TOKEN_ADDRESS,
		GIV_BUY_LINK: 'https://linktr.ee/GIVtoken',
		tokenAddressOnUniswapV2: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
		TOKEN_DISTRO_ADDRESS: '0xe3ac7b3e6b4065f4765d76fdc215606483bf3bd1',
		uniswapV2Subgraph: '',
		coingeckoChainName: 'optimistic-ethereum',
		chainLogo: (logoSize = 24) => <IconOptimism size={logoSize} />,
		GIVPOWER: {
			network: OPTIMISM_NETWORK_NUMBER,
			LM_ADDRESS: '0x301C739CF6bfb6B47A74878BdEB13f92F13Ae5E7',
			POOL_ADDRESS: OPTIMISM_GIV_TOKEN_ADDRESS,
			type: StakingType.GIV_UNIPOOL_LM,
			platform: StakingPlatform.GIVETH,
			title: 'GIV',
			description: '100% GIV',
			unit: 'GIV',
		},
		GIVETH_ANCHOR_CONTRACT_ADDRESS:
			'0x5430757bc19c87ec562e4660e56af6cac324b50a',
		superFluidSubgraph:
			process.env.NEXT_PUBLIC_SUBGRAPH_SUPER_FLUID ||
			'https://subgraph-endpoints.superfluid.dev/optimism-mainnet/protocol-v1',
		SUPER_FLUID_TOKENS: [
			{
				underlyingToken: {
					decimals: 18,
					id: '0x4200000000000000000000000000000000000042',
					name: 'Optimism',
					symbol: 'OP',
					coingeckoId: 'optimism',
				},
				decimals: 18,
				id: '0x1828bff08bd244f7990eddcd9b19cc654b33cdb4',
				name: 'Super Optimism',
				symbol: 'OPx',
				isSuperToken: true,
				coingeckoId: 'optimism',
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
				id: '0x4ac8bd1bdae47beef2d1c6aa62229509b962aa0d',
				name: 'Super ETH',
				symbol: 'ETHx',
				isSuperToken: true,
				coingeckoId: 'ethereum',
			},
			{
				underlyingToken: {
					decimals: 18,
					id: '0x528cdc92eab044e1e39fe43b9514bfdab4412b98',
					name: 'Giveth Token',
					symbol: 'GIV',
					coingeckoId: 'giveth',
				},
				decimals: 18,
				id: '0x4cab5b9930210e2edc6a905b9c75d615872a1a7e',
				name: 'Super Giveth Token',
				symbol: 'GIVx',
				isSuperToken: true,
				coingeckoId: 'giveth',
			},
			{
				underlyingToken: {
					decimals: 18,
					id: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
					name: 'Dai Stablecoin',
					symbol: 'DAI',
					coingeckoId: 'dai',
				},
				decimals: 18,
				id: '0x7d342726b69c28d942ad8bfe6ac81b972349d524',
				name: 'Super Dai Stablecoin',
				symbol: 'DAIx',
				isSuperToken: true,
				coingeckoId: 'dai',
			},
			{
				underlyingToken: {
					decimals: 6,
					id: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
					name: 'USD Coin',
					symbol: 'USDC',
					coingeckoId: 'usd-coin',
				},
				decimals: 18,
				id: '0x8430f084b939208e2eded1584889c9a66b90562f',
				name: 'Super USD Coin',
				symbol: 'USDCx',
				isSuperToken: true,
				coingeckoId: 'usd-coin',
			},
		],
	},

	CELO_CONFIG: {
		...celo,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		subgraphAddress: '',
		coingeckoChainName: 'celo',
		chainLogo: (logoSize = 24) => <IconCelo size={logoSize} />,
	},
	ARBITRUM_CONFIG: {
		...arbitrum,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		subgraphAddress: '',
		coingeckoChainName: 'arbitrum',
		chainLogo: (logoSize = 24) => <IconArbitrum size={logoSize} />,
	},
	BASE_CONFIG: {
		...base,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		subgraphAddress: '',
		coingeckoChainName: 'base',
		chainLogo: (logoSize = 24) => <IconBase size={logoSize} />,
	},

	ZKEVM_CONFIG: {
		...polygonZkEvm,
		chainType: ChainType.EVM,
		coingeckoChainName: 'polygon-zkevm',
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		chainLogo: (logoSize?: number) => <IconZKEVM size={logoSize} />,
		subgraphAddress: process.env.NEXT_PUBLIC_SUBGRAPH_ZKEVM,
		GIV_TOKEN_ADDRESS: ZKEVM_GIV_TOKEN_ADDRESS,
		GIV_BUY_LINK: 'https://linktr.ee/GIVtoken',
		TOKEN_DISTRO_ADDRESS: '0x4fB9B10ECDe1b048DBC79aBEAB3793edc93a0d54',
		uniswapV2Subgraph: '',
		GIVPOWER: {
			network: ZKEVM_NETWORK_NUMBER,
			LM_ADDRESS: '0xc790f82bf6f8709aa4a56dc11afad7af7c2a9867',
			POOL_ADDRESS: ZKEVM_GIV_TOKEN_ADDRESS,
			type: StakingType.GIV_UNIPOOL_LM,
			platform: StakingPlatform.GIVETH,
			title: 'GIV',
			description: '100% GIV',
			unit: 'GIV',
			//Tuesday, September 3, 2024 6:00:00 PM
			farmStartTimeMS: 1725386400000,
		},
	},
	CLASSIC_CONFIG: {
		...classic,
		chainType: ChainType.EVM,
		gasPreference: {
			// Keep it empty for automatic configuration
		},
		subgraphAddress:
			process.env.NEXT_PUBLIC_SUBGRAPH_CLASSIC ||
			'http://167.172.97.150:8000/subgraphs/name/giveth/etc',
		coingeckoChainName: 'ethereum-classic',
		chainLogo: (logoSize = 24) => <IconClassic size={logoSize} />,
	},
	SOLANA_CONFIG: {
		...SOLANA_NETWORK,
		coingeckoChainName: 'solana',
		chainLogo: (logoSize?: number) => <IconSolana size={logoSize} />,
	},
	STELLAR_CONFIG: {
		...STELLAR_NETWORK,
		coingeckoChainName: 'stellar',
		chainLogo: (logoSize?: number) => <IconStellar size={logoSize} />,
	},
};

export default config;
