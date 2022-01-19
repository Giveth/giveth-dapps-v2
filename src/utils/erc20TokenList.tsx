// const network = process.env.ETHEREUM_NETWORK

const mainnetTokens = {
  name: 'CMC200 ERC20',
  timestamp: '2020-08-25T12:00:15+00:00',
  keywords: ['coinmarketcap', 'erc20', 'cmc200'],
  version: {
    major: 0,
    minor: 0,
    patch: 0
  },
  tokens: [
    {
      chainId: 1,
      name: 'Giveth Token',
      symbol: 'GIV',
      address: '0x900db999074d9277c5da2a43f252d74366230da0',
      decimals: 18
    },
    {
      chainId: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xd56dac73a4d6766464b38ec6d91eb45ce7457c44',
      symbol: 'PAN',
      name: 'Panvala',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      symbol: 'DAI',
      name: 'Dai',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
      symbol: 'RAI',
      name: 'Rai Reflex Index',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xda007777d86ac6d989cc9f79a73261b3fc5e0da0',
      symbol: 'NODE',
      name: 'dAppNode',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
      symbol: 'GUSD',
      name: 'Gemini Dollar',
      decimals: 2
    },
    {
      chainId: 1,
      address: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
      symbol: 'GTC',
      name: 'Gitcoin',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc770eefad204b5180df6a14ee197d99d808ee52d',
      symbol: 'FOX',
      name: 'ShapeShift FOX Token (FOX)',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
      symbol: 'CRV',
      name: 'Curve DAO Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
      symbol: 'UST',
      name: 'TerraUSD',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      symbol: 'SUSHI',
      name: 'Sushi Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xba100000625a3754423978a60c9317c58a424e3d',
      symbol: 'BAL',
      name: 'Balancer',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xad32a8e6220741182940c5abf610bde99e737b2d',
      symbol: 'DOUGH',
      name: 'PieDAO DOUGH',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x09a3ecafa817268f77be1283176b946c4ff2e608',
      symbol: 'MIR',
      name: 'Wrapped MIR Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x30cf203b48edaa42c3b4918e955fed26cd012a3f',
      symbol: 'SEED',
      name: 'Metagame SEED',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xdd1ad9a21ce722c151a836373babe42c868ce9a4',
      symbol: 'UBI',
      name: 'PoH Universal Basic Income',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      name: 'Tether',
      decimals: 6
    },
    {
      chainId: 1,
      address: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
      symbol: 'CRO',
      name: 'Crypto.com Coin',
      decimals: 8
    },
    {
      chainId: 1,
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      symbol: 'LINK',
      name: 'Chainlink',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3',
      symbol: 'LEO',
      name: 'UNUS SED LEO',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6
    },
    {
      chainId: 1,
      address: '0x6f259637dcd74c767781e37bc6133cd6a68aa161',
      symbol: 'HT',
      name: 'Huobi Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      symbol: 'COMP',
      name: 'Compound',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      symbol: 'MKR',
      name: 'Maker',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xf1290473e210b2108a85237fbcd7b6eb42cc654f',
      symbol: 'HEDG',
      name: 'HedgeTrade',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      symbol: 'BAT',
      name: 'Basic Attention Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x75231f58b43240c9718dd58b4967c5114342a86c',
      symbol: 'OKB',
      name: 'OKB',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
      symbol: 'PAX',
      name: 'Paxos Standard',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      symbol: 'ZRX',
      name: 'ZRX 0x',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
      symbol: 'KNC',
      name: 'Kyber Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
      symbol: 'OMG',
      name: 'OMG Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x10086399dd8c1e3de736724af52587a2044c9fa2',
      symbol: 'TMTG',
      name: 'The Midas Touch Gold',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x1985365e9f78359a9b6ad760e32412f4a445e862',
      symbol: 'REP',
      name: 'Augur',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
      symbol: 'LEND',
      name: 'Lend Aave',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      symbol: 'SNX',
      name: 'Synthetix Network Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xe99a894a69d7c2e3c92e61b64c505a6a57d2bc07',
      symbol: 'HYN',
      name: 'Hyperion',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
      symbol: 'ENJ',
      name: 'Enjin Coin',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x408e41876cccdc0f92210600ef50372656052a38',
      symbol: 'REN',
      name: 'Ren',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xdf574c24545e5ffecb9a659c229253d4111d87e1',
      symbol: 'HUSD',
      name: 'HUSD',
      decimals: 8
    },
    {
      chainId: 1,
      address: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
      symbol: 'CEL',
      name: 'Celsius',
      decimals: 4
    },
    {
      chainId: 1,
      address: '0xbd0793332e9fb844a52a205a233ef27a5b34b927',
      symbol: 'ZB',
      name: 'ZB Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x973e52691176d36453868d9d86572788d27041a9',
      symbol: 'DX',
      name: 'DxChain Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x4a220e6096b25eadb88358cb44068a3248254675',
      symbol: 'QNT',
      name: 'Quant',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
      symbol: 'HOT',
      name: 'Holo',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xba9d4199fab4f26efe3551d490e3821486f135ba',
      symbol: 'CHSB',
      name: 'SwissBorg',
      decimals: 8
    },
    {
      chainId: 1,
      address: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
      symbol: 'LRC',
      name: 'Loopring',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
      symbol: 'SNT',
      name: 'Status',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xa974c709cfb4566686553a20790685a47aceaa33',
      symbol: 'XIN',
      name: 'Mixin',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
      symbol: 'BNT',
      name: 'Bancor',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x039b5649a59967e3e936d7471f9c3700100ee1ab',
      symbol: 'KCS',
      name: 'KuCoin Shares',
      decimals: 6
    },
    {
      chainId: 1,
      address: '0xb63b606ac810a52cca15e44bb630fd42d8d1d83d',
      symbol: 'MCO',
      name: 'MCO',
      decimals: 8
    },
    {
      chainId: 1,
      address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      symbol: 'MATIC',
      name: 'Matic Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x73cee8348b9bdd48c64e13452b8a6fbc81630573',
      symbol: 'EGR',
      name: 'Egoras',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
      symbol: 'NMR',
      name: 'Numeraire',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 8
    },
    {
      chainId: 1,
      address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
      symbol: 'MANA',
      name: 'Decentraland',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xa74476443119a942de498590fe1f2454d7d4ac0d',
      symbol: 'GNT',
      name: 'Golem',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x45804880de22913dafe09f4980848ece6ecbaf78',
      symbol: 'PAXG',
      name: 'PAX Gold',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x607f4c5bb672230e8672085532f7e901544a7375',
      symbol: 'RLC',
      name: 'iExec RLC',
      decimals: 9
    },
    {
      chainId: 1,
      address: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e',
      symbol: 'ELF',
      name: 'aelf',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x446c9033e7516d820cc9a2ce2d0b7328b579406f',
      symbol: 'SOLVE',
      name: 'SOLVE',
      decimals: 8
    },
    {
      chainId: 1,
      address: '0x8762db106b2c2a0bccb3a80d1ed41273552616e8',
      symbol: 'RSR',
      name: 'Reserve Rights',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xf51ebf9a26dbc02b13f8b3a9110dac47a4d62d78',
      symbol: 'APIX',
      name: 'APIX',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
      symbol: 'ANT',
      name: 'Aragon',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e',
      symbol: 'UBT',
      name: 'Unibright',
      decimals: 8
    },
    {
      chainId: 1,
      address: '0x5dd57da40e6866c9fcc34f4b6ddc89f1ba740dfe',
      symbol: 'BRIGHT',
      name: 'BrightID',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      symbol: 'YFI',
      name: 'yearn.finance',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      symbol: 'SHIB',
      name: 'SHIBA INU',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x111111111117dc0aa78b770fa6a738034120c302',
      symbol: '1INCH',
      name: '1INCH Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xbe428c3867f05dea2a89fc76a102b544eac7f772',
      symbol: 'CVT',
      name: 'CyberVein',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xb683d83a532e2cb7dfa5275eed3698436371cc9f',
      symbol: 'BTU',
      name: 'BTU Protocol',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc666081073e8dff8d3d1c2292a29ae1a2153ec09',
      symbol: 'DGTX',
      name: 'Digitex Futures',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x6bc1f3a1ae56231dbb64d3e82e070857eae86045',
      symbol: 'XSR',
      name: 'Xensor',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e',
      symbol: 'DRGN',
      name: 'Dragonchain',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
      symbol: 'EURS',
      name: 'STASIS EURO',
      decimals: 2
    },
    {
      chainId: 1,
      address: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
      symbol: 'POWR',
      name: 'Power Ledger',
      decimals: 6
    },
    {
      chainId: 1,
      address: '0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
      symbol: 'SXP',
      name: 'Swipe',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xa15c7ebe1f07caf6bff097d8a589fb8ac49ae5b3',
      symbol: 'NPXS',
      name: 'Pundi X',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xe66747a101bff2dba3697199dcce5b743b454759',
      symbol: 'GT',
      name: 'Gatechain Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x653430560be843c4a3d143d0110e896c2ab8ac0d',
      symbol: 'MOF',
      name: 'Molecular Future',
      decimals: 16
    },
    {
      chainId: 1,
      address: '0xff56cc6b1e6ded347aa0b7676c85ab0b3d08b0fa',
      symbol: 'ORBS',
      name: 'Orbs',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x80a7e048f37a50500351c204cb407766fa3bae7f',
      symbol: 'CRPT',
      name: 'Crypterium',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6',
      symbol: 'RCN',
      name: 'Ripio Credit Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0cf0ee63788a0849fe5297f3407f701e122cc023',
      symbol: 'DATA',
      name: 'Streamr',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xa66daa57432024023db65477ba87d4e7f5f95213',
      symbol: 'HPT',
      name: 'Huobi Pool Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xfc29b6e626b67776675fff55d5bc0452d042f434',
      symbol: 'BHT',
      name: 'BHEX Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x6810e776880c02933d47db1b9fc05908e5386b96',
      symbol: 'GNO',
      name: 'Gnosis',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xb705268213d593b8fd88d3fdeff93aff5cbdcfae',
      symbol: 'IDEX',
      name: 'IDEX',
      decimals: 18
    },
    // ADD THESE TO MONOSWAP
    {
      chainId: 1,
      address: '0x4fE83213D56308330EC302a8BD641f1d0113A4Cc',
      symbol: 'NU',
      name: 'NuCypher',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x875773784Af8135eA0ef43b5a374AaD105c5D39e',
      symbol: 'IDLE',
      name: 'Idle Finance',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x25f8087ead173b73d6e8b84329989a8eea16cf73',
      symbol: 'YGG',
      name: 'Yield Guild',
      decimals: 18
    },
    // THESE ARE TAKEN FROM THE GIVING BLOCK LIST
    {
      chainId: 1,
      address: '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
      symbol: 'ALCX',
      name: 'Alchemix',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
      symbol: 'AMP',
      name: 'Amp',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x8290333cef9e6d528dd5618fb97a76f268f3edd4',
      symbol: 'ANKR',
      name: 'Ankr Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
      symbol: 'AXS',
      name: 'Axie Infinity Shard',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0391D2021f89DC339F60Fff84546EA23E337750f',
      symbol: 'BOND',
      name: 'BarnBridge Governance Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x321c2fe4446c7c963dc41dd58879af648838f98d',
      symbol: 'CTX',
      name: 'Cryptex',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
      symbol: 'FTM',
      name: 'Fantom Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
      symbol: 'GRT',
      name: 'Graph Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
      symbol: 'INJ',
      name: 'Injective Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x58b6a8a3302369daec383334672404ee733ab239',
      symbol: 'LPT',
      name: 'Livepeer Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xfc98e825a2264d890f9a1e68ed50e1526abccacd',
      symbol: 'MCO2',
      name: 'Moss Carbon Credit',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb',
      symbol: 'OXT',
      name: 'Orchid',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
      symbol: 'SAND',
      name: 'The Sandbox',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x00c83aecc790e8a4453e5dd3b0b4b3680501a7a7',
      symbol: 'SKALE',
      name: 'Skale',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25',
      symbol: 'SLP',
      name: 'Smooth Love Potion',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xdf801468a808a32656d2ed2d2d80b72a129739f4',
      symbol: 'CUBE',
      name: 'Somnium Space Cubes',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
      symbol: 'STORJ',
      name: 'Storj',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
      symbol: 'LUNA',
      name: 'Wrapped LUNA Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
      symbol: 'UMA',
      name: 'UMA Voting Token v1',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      symbol: 'UNI',
      name: 'Uniswap',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc221b7e65ffc80de234bbb6667abdd46593d34f0',
      symbol: 'wCFG',
      name: 'Wrapped Centrifuge',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998',
      symbol: 'AUDIO',
      name: 'Audius',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x69af81e73a73b40adf4f3d4223cd9b1ece623074',
      symbol: 'MASK',
      name: 'Mask Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x31c8eacbffdd875c74b94b077895bd78cf1e64a3',
      symbol: 'RAD',
      name: 'Radicle',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0b38210ea11411557c13457D4dA7dC6ea731B88a',
      symbol: 'API3',
      name: 'API3',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x71590d4ed14d9cbacb2cff8abf919ac4d22c5b7b',
      symbol: 'ASH',
      name: 'The Burn Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xba5bde662c17e2adff1075610382b9b691296350',
      symbol: 'RARE',
      name: 'SuperRare',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85',
      symbol: 'FET',
      name: 'Fetch',
      decimals: 18
    }
  ],
  logoURI: 'ipfs://QmQAGtNJ2rSGpnP6dh6PPKNSmZL8RTZXmgFwgTdy5Nz5mx'
}

const ropstenTokens = {
  name: 'CUSTOM ROPSTEN ERC20 LIST',
  timestamp: null,
  keywords: ['custom', 'erc20'],
  tokens: [
    {
      chainId: 3,
      address: '0x067eA48882E6D728A37acfd1535ec03f8E33794a',
      symbol: 'YAY',
      name: 'Giveth',
      decimals: 18
    },
    {
      chainId: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    {
      chainId: 3,
      address: '0xad6d458402f60fd3bd25163575031acdce07538d',
      symbol: 'DAI',
      name: 'DAI Ropsten',
      decimals: 18
    },
    {
      chainId: 3,
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      symbol: 'UNI',
      name: 'UNI Ropsten',
      decimals: 18
    }
  ]
}

const xDaiTokens = {
  name: 'CUSTOM XDAI ERC20 LIST',
  timestamp: null,
  keywords: ['custom', 'erc20'],
  tokens: [
    {
      chainId: 100,
      name: 'Giveth Token',
      symbol: 'GIV',
      address: '0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75',
      decimals: 18
    },
    {
      chainId: 100,
      name: 'XDAI',
      symbol: 'XDAI',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0x1337BedC9D22ecbe766dF105c9623922A27963EC',
      ethereumAddress: '0xD533a949740bb3306d119CC777fa900bA034cd52',
      symbol: 'CRV',
      name: 'Curve DAO Token',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0xc60e38C6352875c051B481Cbe79Dd0383AdB7817',
      ethereumAddress: '0xda007777d86ac6d989cc9f79a73261b3fc5e0da0',
      symbol: 'XNODE',
      name: 'dAppNode on xDAI',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0x981fb9ba94078a2275a8fc906898ea107b9462a8',
      ethereumAddress: '0xd56dac73a4d6766464b38ec6d91eb45ce7457c44',
      symbol: 'PAN',
      name: 'Panvala',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
      symbol: 'HNY',
      name: 'Honey',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e',
      symbol: 'STAKE',
      name: 'STAKE on xDai',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
      symbol: 'USDC',
      name: 'USDC on xDai',
      decimals: 6
    },
    {
      chainId: 100,
      address: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
      symbol: 'WETH',
      name: 'Wrapped Ether on xDai',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2',
      symbol: 'LINK',
      name: 'ChainLink Token on xDai',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0x1e16aa4Df73d29C029d94CeDa3e3114EC191E25A',
      symbol: 'xMOON',
      name: 'Moons on xDai',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      symbol: 'WXDAI',
      name: 'Wrapped XDAI',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
      ethereumAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      name: 'Tether USD on xDai',
      decimals: 6
    },
    {
      chainId: 100,
      address: '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252',
      symbol: 'WBTC',
      name: 'Wrapped BTC on xDai',
      decimals: 8
    },
    {
      chainId: 100,
      address: '0x3a97704a1b25F08aa230ae53B352e2e72ef52843',
      symbol: 'AGVE',
      name: 'Agave Token',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0x38Fb649Ad3d6BA1113Be5F57B927053E97fC5bF7',
      symbol: 'XCOMB',
      name: 'xDAI Native Comb',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0xb0C5f3100A4d9d9532a4CfD68c55F1AE8da987Eb',
      symbol: 'HAUS',
      name: 'DAOhaus',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0x21a42669643f45Bc0e086b8Fc2ed70c23D67509d',
      symbol: 'FOX',
      name: 'Fox Token',
      decimals: 18
    },
    {
      chainId: 100,
      address: '0x83FF60E2f93F8eDD0637Ef669C69D5Fb4f64cA8E',
      symbol: 'BRIGHT',
      name: 'Bright on xDAI',
      decimals: 18
    }
  ]
}

const traceTokens = {
  name: 'TRACE ERC20 WHITELIST',
  timestamp: null,
  keywords: ['trace', 'erc20'],
  tokens: [
    {
      chainId: 1,
      name: 'Ethereum',
      address: '0x0',
      foreignAddress: '0xe3ee055346a9EfaF4AA2900847dEb04de0195398',
      symbol: 'ETH',
      coingeckoId: 'ethereum',
      decimals: 6
    },
    {
      chainId: 1,
      name: 'DAI',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      foreignAddress: '0x05A075B296995AdCaEC7c1dE0E52271a4Cf6DEb8',
      symbol: 'DAI',
      rateEqSymbol: 'USD',
      coingeckoId: 'dai',
      decimals: 3
    },
    {
      chainId: 1,
      name: 'PAN',
      address: '0xd56dac73a4d6766464b38ec6d91eb45ce7457c44',
      foreignAddress: '0x0aaf4acccddb40cdb6a1df3cfbc7944aa5effcc6',
      symbol: 'PAN',
      coingeckoId: 'panvala-pan',
      decimals: 2
    },
    {
      chainId: 1,
      name: 'WBTC',
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      foreignAddress: '0x6d03800013c591611a6ee597191d9f608b833510',
      symbol: 'WBTC',
      rateEqSymbol: 'BTC',
      coingeckoId: 'bitcoin',
      decimals: 8
    },
    {
      chainId: 1,
      name: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      foreignAddress: '0xf14eCE303f190A70A2CF7C7011F75bDa658aD6EF',
      symbol: 'USDC',
      rateEqSymbol: 'USD',
      coingeckoId: 'usd-coin',
      decimals: 3
    }
  ]
}

const ropstenTheGivingBlockTokens = {
  name: 'THE GIVING BLOCK ROPSTEN WHITELIST',
  timestamp: null,
  keywords: ['giving-block', 'erc20', 'ropsten'],
  tokens: [
    {
      chainId: 3,
      address: '0x067eA48882E6D728A37acfd1535ec03f8E33794a',
      symbol: 'YAY',
      name: 'Giveth',
      decimals: 18
    },
    {
      chainId: 3,
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  ]
}

const theGivingBlockTokens = {
  name: 'THE GIVING BLOCK WHITELIST',
  timestamp: null,
  keywords: ['giving-block', 'erc20'],
  tokens: [
    {
      chainId: 1,
      address: '0x900db999074d9277c5da2a43f252d74366230da0',
      symbol: 'GIV',
      name: 'GIV Token',
      decimals: 18
    },
    {
      chainId: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      symbol: 'ZRX',
      name: 'ZRX 0x',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x111111111117dc0aa78b770fa6a738034120c302',
      symbol: '1INCH',
      name: '1INCH Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
      symbol: 'LEND',
      name: 'Lend Aave',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
      symbol: 'BNT',
      name: 'Bancor',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      symbol: 'BAT',
      name: 'Basic Attention Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xba100000625a3754423978a60c9317c58a424e3d',
      symbol: 'BAL',
      name: 'Balancer',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      symbol: 'LINK',
      name: 'Chainlink',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      symbol: 'COMP',
      name: 'Compound',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
      symbol: 'CRV',
      name: 'Curve DAO Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      symbol: 'DAI',
      name: 'Dai',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
      symbol: 'MANA',
      name: 'Decentraland',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
      symbol: 'ENJ',
      name: 'Enjin Coin',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
      symbol: 'GUSD',
      name: 'Gemini Dollar',
      decimals: 2
    },
    {
      chainId: 1,
      address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
      symbol: 'KNC',
      name: 'Kyber Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
      symbol: 'LRC',
      name: 'Loopring',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      symbol: 'MKR',
      name: 'Maker',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x09a3ecafa817268f77be1283176b946c4ff2e608',
      symbol: 'MIR',
      name: 'Wrapped MIR Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x45804880de22913dafe09f4980848ece6ecbaf78',
      symbol: 'PAXG',
      name: 'PAX Gold',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      symbol: 'MATIC',
      name: 'Matic Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x408e41876cccdc0f92210600ef50372656052a38',
      symbol: 'REN',
      name: 'Ren',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      symbol: 'SUSHI',
      name: 'Sushi Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      symbol: 'SNX',
      name: 'Synthetix Network Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
      symbol: 'UST',
      name: 'TerraUSD',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      symbol: 'YFI',
      name: 'yearn.finance',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x4a220e6096b25eadb88358cb44068a3248254675',
      symbol: 'QNT',
      name: 'Quant',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
      symbol: 'NMR',
      name: 'Numeraire',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      symbol: 'SHIB',
      name: 'SHIBA INU',
      decimals: 18
    },

    // >>>> HERE IT BEGINS THE NEW TOKENS THAT WERE NOT IN THE MAIN LIST BEFORE <<<<<<
    {
      chainId: 1,
      address: '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
      symbol: 'ALCX',
      name: 'Alchemix',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
      symbol: 'AMP',
      name: 'Amp',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x8290333cef9e6d528dd5618fb97a76f268f3edd4',
      symbol: 'ANKR',
      name: 'Ankr Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
      symbol: 'AXS',
      name: 'Axie Infinity Shard',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0391D2021f89DC339F60Fff84546EA23E337750f',
      symbol: 'BOND',
      name: 'BarnBridge Governance Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x321c2fe4446c7c963dc41dd58879af648838f98d',
      symbol: 'CTX',
      name: 'Cryptex',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
      symbol: 'FTM',
      name: 'Fantom Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
      symbol: 'GRT',
      name: 'Graph Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
      symbol: 'INJ',
      name: 'Injective Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x58b6a8a3302369daec383334672404ee733ab239',
      symbol: 'LPT',
      name: 'Livepeer Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xfc98e825a2264d890f9a1e68ed50e1526abccacd',
      symbol: 'MCO2',
      name: 'Moss Carbon Credit',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb',
      symbol: 'OXT',
      name: 'Orchid',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
      symbol: 'SAND',
      name: 'The Sandbox',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x00c83aecc790e8a4453e5dd3b0b4b3680501a7a7',
      symbol: 'SKALE',
      name: 'Skale',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25',
      symbol: 'SLP',
      name: 'Smooth Love Potion',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xdf801468a808a32656d2ed2d2d80b72a129739f4',
      symbol: 'CUBE',
      name: 'Somnium Space Cubes',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
      symbol: 'STORJ',
      name: 'Storj',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
      symbol: 'LUNA',
      name: 'Wrapped LUNA Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
      symbol: 'UMA',
      name: 'UMA Voting Token v1',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      symbol: 'UNI',
      name: 'Uniswap',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xc221b7e65ffc80de234bbb6667abdd46593d34f0',
      symbol: 'wCFG',
      name: 'Wrapped Centrifuge',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998',
      symbol: 'AUDIO',
      name: 'Audius',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x69af81e73a73b40adf4f3d4223cd9b1ece623074',
      symbol: 'MASK',
      name: 'Mask Network',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x31c8eacbffdd875c74b94b077895bd78cf1e64a3',
      symbol: 'RAD',
      name: 'Radicle',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x0b38210ea11411557c13457D4dA7dC6ea731B88a',
      symbol: 'API3',
      name: 'API3',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0x71590d4ed14d9cbacb2cff8abf919ac4d22c5b7b',
      symbol: 'ASH',
      name: 'The Burn Token',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xba5bde662c17e2adff1075610382b9b691296350',
      symbol: 'RARE',
      name: 'SuperRare',
      decimals: 18
    },
    {
      chainId: 1,
      address: '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85',
      symbol: 'FET',
      name: 'Fetch',
      decimals: 18
    }
  ]
}

const getTokens = network => {
  let tokens
  switch (network) {
    case 1:
      tokens = mainnetTokens
      break
    case 3:
      tokens = ropstenTokens
      break
    case 100:
      tokens = xDaiTokens
      break
    case 'trace':
      tokens = traceTokens
      break
    case 'thegivingblock':
      tokens = theGivingBlockTokens
      break
    case 'ropsten_thegivingblock':
      tokens = ropstenTheGivingBlockTokens
      break
    default:
      tokens = mainnetTokens
      break
  }
  return tokens
}

export default getTokens
