/**
 * Robinhood Chain network-config entries (ticket 05).
 *
 * The donate flow's switch-network modal and the manage-funds address picker
 * build their options from config.EVM_NETWORKS_CONFIG / NETWORKS_CONFIG, and
 * wagmi registers chains from config.EVM_CHAINS. These tests pin the map
 * entries for both networks — chain id, RPC, explorer and the Multicall3
 * address — so a dropped Multicall3 fails the suite instead of silently
 * emptying the donate form's multicall token-balance list.
 */
import { TextDecoder, TextEncoder } from 'util';
import { ChainType, GlobalConfig, NetworkConfig } from '@/types/config';

// viem's CJS build expects TextEncoder/TextDecoder, absent under jsdom.
Object.assign(global, { TextDecoder, TextEncoder });

// wagmi ships pure-ESM entry points that jest cannot parse; the config only
// uses the chain objects' ids and spread fields, so id-accurate stubs suffice.
const mockChain = (id: number, name: string) => ({
	id,
	name,
	nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
	rpcUrls: { default: { http: [`https://mock.rpc/${id}`] } },
	blockExplorers: { default: { name: 'Mock', url: 'https://mock.scan' } },
});

jest.mock('wagmi/chains', () => ({
	celoAlfajores: mockChain(44787, 'Celo Alfajores'),
	gnosis: mockChain(100, 'Gnosis'),
	sepolia: mockChain(11155111, 'Sepolia'),
	optimismSepolia: mockChain(11155420, 'OP Sepolia'),
	polygon: mockChain(137, 'Polygon'),
	arbitrumSepolia: mockChain(421614, 'Arbitrum Sepolia'),
	baseSepolia: mockChain(84532, 'Base Sepolia'),
	polygonZkEvmCardona: mockChain(2442, 'Polygon zkEVM Cardona'),
}));

jest.mock('@wagmi/core/chains', () => ({
	celo: mockChain(42220, 'Celo'),
	classic: mockChain(61, 'Ethereum Classic'),
	gnosis: mockChain(100, 'Gnosis'),
	mainnet: mockChain(1, 'Ethereum'),
	optimism: mockChain(10, 'OP Mainnet'),
	polygon: mockChain(137, 'Polygon'),
	arbitrum: mockChain(42161, 'Arbitrum One'),
	base: mockChain(8453, 'Base'),
	polygonZkEvm: mockChain(1101, 'Polygon zkEVM'),
}));

const ROBINHOOD_MAINNET_ID = 4663; // 0x1237
const ROBINHOOD_TESTNET_ID = 46630; // 0xb626
const MULTICALL3_ADDRESS = '0xca11bde05977b3631167028862be2a173976ca11';
const MAINNET_RPC = 'https://rpc.mainnet.chain.robinhood.com';
const TESTNET_RPC = 'https://rpc.testnet.chain.robinhood.com';
const MAINNET_EXPLORER = 'https://robinhoodchain.blockscout.com';
const TESTNET_EXPLORER = 'https://explorer.testnet.chain.robinhood.com';

const loadConfig = (env?: string): GlobalConfig => {
	jest.resetModules();
	if (env) {
		process.env.NEXT_PUBLIC_ENV = env;
	} else {
		delete process.env.NEXT_PUBLIC_ENV;
	}
	return require('@/configuration').default as GlobalConfig;
};

const originalEnv = process.env.NEXT_PUBLIC_ENV;

afterEach(() => {
	if (originalEnv === undefined) {
		delete process.env.NEXT_PUBLIC_ENV;
	} else {
		process.env.NEXT_PUBLIC_ENV = originalEnv;
	}
	jest.resetModules();
});

const expectRobinhoodEntry = (
	network: NetworkConfig | undefined,
	expected: { id: number; name: string; rpc: string; explorer: string },
) => {
	expect(network).toBeDefined();
	expect(network!.id).toBe(expected.id);
	expect(network!.name).toBe(expected.name);
	expect(network!.chainType).toBe(ChainType.EVM);
	expect(network!.nativeCurrency.symbol).toBe('ETH');
	expect(network!.rpcUrls.default.http).toContain(expected.rpc);
	expect(network!.blockExplorers?.default.url).toBe(expected.explorer);
	// Multicall3 is verified deployed at this address on both networks;
	// without it the donate form's multicall balance fetch silently empties.
	expect(network!.contracts?.multicall3?.address).toBe(MULTICALL3_ADDRESS);
	expect(network!.gasPreference).toEqual({});
	// No subgraph on Robinhood Chain — keeps it out of CHAINS_WITH_SUBGRAPH.
	expect(network!.subgraphAddress).toBeFalsy();
	expect(network!.chainLogo).toBeInstanceOf(Function);
};

describe('Robinhood Chain network config', () => {
	it('registers the testnet in the development config map', () => {
		const config = loadConfig();
		const network = config.EVM_NETWORKS_CONFIG[
			ROBINHOOD_TESTNET_ID
		] as NetworkConfig;

		expectRobinhoodEntry(network, {
			id: ROBINHOOD_TESTNET_ID,
			name: 'Robinhood Chain Testnet',
			rpc: TESTNET_RPC,
			explorer: TESTNET_EXPLORER,
		});

		expect(config.ROBINHOOD_NETWORK_NUMBER).toBe(ROBINHOOD_TESTNET_ID);
		expect(config.NETWORKS_CONFIG[ROBINHOOD_TESTNET_ID]).toBe(network);
		expect(config.NETWORKS_CONFIG_WITH_ID[ROBINHOOD_TESTNET_ID]).toBe(
			network,
		);
		// wagmi registers chains from EVM_CHAINS — the wallet switch prompt
		// needs the chain there to request the right chain id.
		expect(config.EVM_CHAINS.map(c => c.id)).toContain(
			ROBINHOOD_TESTNET_ID,
		);
		// Mainnet must not leak into the development config.
		expect(
			config.EVM_NETWORKS_CONFIG[ROBINHOOD_MAINNET_ID],
		).toBeUndefined();
	});

	it('registers the mainnet in the production config map', () => {
		const config = loadConfig('production');
		const network = config.EVM_NETWORKS_CONFIG[
			ROBINHOOD_MAINNET_ID
		] as NetworkConfig;

		expectRobinhoodEntry(network, {
			id: ROBINHOOD_MAINNET_ID,
			name: 'Robinhood Chain',
			rpc: MAINNET_RPC,
			explorer: MAINNET_EXPLORER,
		});

		expect(config.ROBINHOOD_NETWORK_NUMBER).toBe(ROBINHOOD_MAINNET_ID);
		expect(config.NETWORKS_CONFIG[ROBINHOOD_MAINNET_ID]).toBe(network);
		expect(config.NETWORKS_CONFIG_WITH_ID[ROBINHOOD_MAINNET_ID]).toBe(
			network,
		);
		expect(config.EVM_CHAINS.map(c => c.id)).toContain(
			ROBINHOOD_MAINNET_ID,
		);
		// Testnet must not leak into the production config.
		expect(
			config.EVM_NETWORKS_CONFIG[ROBINHOOD_TESTNET_ID],
		).toBeUndefined();
	});

	it('renders a chain logo at the standard sizes', () => {
		const config = loadConfig();
		const network = config.EVM_NETWORKS_CONFIG[
			ROBINHOOD_TESTNET_ID
		] as NetworkConfig;
		[16, 24, 32, 40, 64].forEach(size => {
			expect(network.chainLogo(size)).toBeDefined();
		});
	});
});
