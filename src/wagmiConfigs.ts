import { createThirdwebClient, defineChain as thirdwebChain } from 'thirdweb';
import { cookieStorage, createConfig, createStorage } from 'wagmi';
import { walletConnect, coinbaseWallet, safe } from '@wagmi/connectors';
import { inAppWalletConnector } from '@thirdweb-dev/wagmi-adapter';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
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

const clientUnicorn = createThirdwebClient({
	clientId: '4e8c81182c3709ee441e30d776223354',
});

// Create wagmiConfig
export const wagmiConfig = createConfig({
	chains: chains, // required
	connectors: [
		// Farcaster Mini App connector - auto-connects when running inside Farcaster/Base mini app
		farcasterMiniApp(),
		walletConnect({
			projectId,
			metadata,
		}),
		coinbaseWallet({ appName: 'Giveth', version: '3' }),
		safe({
			allowedDomains: [/app.safe.global$/],
		}),
		inAppWalletConnector({
			client: clientUnicorn,
			smartAccount: {
				sponsorGas: true,
				chain: thirdwebChain(137),
				factoryAddress: '0xD771615c873ba5a2149D5312448cE01D677Ee48A',
			},
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
