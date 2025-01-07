import { cookieStorage, createConfig, createStorage } from 'wagmi';
import { walletConnect, coinbaseWallet, safe } from '@wagmi/connectors';

import { createClient, http } from 'viem';
import { getDrpcNetwork } from './lib/network';
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

const createDrpcTransport = (chainId: number) => {
	const network = getDrpcNetwork(chainId);
	const drpcKey = process.env.NEXT_PUBLIC_DRPC_KEY;
	return network && drpcKey
		? http(`https://lb.drpc.org/ogrpc?network=${network}&dkey=${drpcKey}`)
		: http();
};

// Create wagmiConfig
export const wagmiConfig = createConfig({
	chains: chains, // required
	connectors: [
		walletConnect({
			projectId,
			metadata,
		}),
		coinbaseWallet({ appName: 'Giveth', version: '3' }),
		safe({
			allowedDomains: [/app.safe.global$/],
		}),
	],
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
	client({ chain }) {
		return createClient({
			chain,
			transport: createDrpcTransport(chain.id),
		});
	},
});
