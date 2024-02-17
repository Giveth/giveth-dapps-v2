import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage, http } from 'wagmi';
import { safe } from '@wagmi/connectors';

import { createClient } from 'viem';
import configuration from './configuration';

// export const wagmiConfig = createConfig({
// 	chains: [mainnet, sepolia],
// 	transports: {
// 		[mainnet.id]: http(),
// 		[sepolia.id]: http(),
// 	},
// });

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
	name: 'Giveth',
	description:
		'Get rewarded for giving to for-good projects with zero added fees. Donate crypto directly to thousands of for-good projects, nonprofits &amp; charities!',
	url: 'https://giveth.io',
	icons: ['https://giveth.io/images/currencies/giv/24.svg'],
};

// const { publicClient } = configureChains(chains, [
// 	walletConnectProvider({ projectId }),
// 	publicProvider(),
// ]);
// const wagmiConfig = createConfig({
// 	chains: [mainnet],
// 	connectors: [
// 		walletConnect({
// 			chains,
// 			options: { projectId, showQrModal: false, metadata },
// 		}),
// 		new EIP6963Connector({ chains }),
// 		injected({ chains, options: { shimDisconnect: true } }),
// 		safe({
// 			chains,
// 			options: {
// 				allowedDomains: [/app.safe.global$/],
// 				debug: false,
// 			},
// 		}),
// 	],
// });

// createWeb3Modal({
// 	wagmiConfig,
// 	projectId,
// 	chains,
// 	themeVariables: {
// 		'--w3m-z-index': zIndex.WEB3MODAL,
// 	},
// 	featuredWalletIds: [
// 		'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
// 	],
// 	includeWalletIds: [
// 		'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
// 	],
// 	chainImages: {
// 		[classicNetworkNumber]: '/images/currencies/classic/32.svg',
// 	},
// });

const chains = configuration.EVM_CHAINS;

const classicNetworkNumber = configuration.CLASSIC_NETWORK_NUMBER;

// Create wagmiConfig
export const wagmiConfig = defaultWagmiConfig({
	chains: chains, // required
	connectors: [
		safe({
			allowedDomains: [/app.safe.global$/],
			debug: false,
		}),
	],
	projectId, // required
	metadata, // required
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
	enableWalletConnect: true, // Optional - true by default
	enableInjected: true, // Optional - true by default
	enableEIP6963: true, // Optional - true by default
	enableCoinbase: false, // Optional - true by default
	// ...wagmiOptions, // Optional - Override createConfig parameters
	client({ chain }) {
		return createClient({ chain, transport: http() });
	},
});
