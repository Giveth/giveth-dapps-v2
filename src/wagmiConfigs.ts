import { cookieStorage, createConfig, createStorage } from 'wagmi';
import { safe, walletConnect } from '@wagmi/connectors';

import { createClient, http } from 'viem';
import configuration from './configuration';

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

const chains = configuration.EVM_CHAINS;

// Create wagmiConfig
export const wagmiConfig = createConfig({
	chains: chains, // required
	connectors: [
		safe({ allowedDomains: [/app.safe.global$/], debug: false }),
		walletConnect({
			projectId,
			metadata,
		}),
	],
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
	client({ chain }) {
		return createClient({ chain, transport: http() });
	},
});
