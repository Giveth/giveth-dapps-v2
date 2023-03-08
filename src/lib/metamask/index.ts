import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { captureException } from '@sentry/nextjs';
import config from '@/configuration';
import UNI_Json from '@/artifacts/UNI.json';
import { networksParams } from '@/helpers/blockchain';
import { ERC20 } from '@/types/contracts';

const { abi: UNI_ABI } = UNI_Json;

declare let window: any;

const { MAINNET_CONFIG, XDAI_CONFIG } = config;

const getTokenImage = (symbol: string): string | undefined => {
	let _symbol = symbol.toLowerCase();

	// GIV test token, DRGIV, DRGIV2, DRGIV3, ...
	if (_symbol.startsWith('drgiv')) _symbol = 'giv';
	// TestFox, etc
	else if (_symbol.startsWith('test')) _symbol = _symbol.slice(4);

	switch (_symbol) {
		case 'giv':
			return 'https://raw.githubusercontent.com/Giveth/giveth-design-assets/master/02-logos/GIV%20Token/GIVToken_200x200.png';
		case 'cult':
			return 'https://raw.githubusercontent.com/Giveth/giveth-dapps-v2/develop/public/images/currencies/cult/64.svg';
		case 'fox':
			return 'https://raw.githubusercontent.com/Giveth/giveth-dapps-v2/develop/public/images/currencies/fox/64.svg';
	}

	return undefined;
};

interface ITokenOptins {
	address: string;
	symbol: string;
	decimals: number;
	image?: string;
}

const fetchTokenInfo = async (
	provider: JsonRpcProvider,
	address: string,
): Promise<ITokenOptins | undefined> => {
	const contract = new Contract(address, UNI_ABI, provider) as ERC20;
	try {
		const [_decimal, _symbol]: [number, string] = await Promise.all([
			contract.decimals(),
			contract.symbol(),
		]);
		return {
			address: address,
			symbol: _symbol,
			decimals: _decimal,
			image: getTokenImage(_symbol),
		};
	} catch (error) {
		console.error('error in fetchTokenInfo', error);
		captureException(error, {
			tags: {
				section: 'fetchTokenInfo',
			},
		});
	}
	return;
};

export async function addToken(
	provider: JsonRpcProvider,
	tokenAddress: string | undefined, // Default is GIV
): Promise<void> {
	const address =
		tokenAddress ||
		(provider.network.chainId === config.MAINNET_NETWORK_NUMBER
			? MAINNET_CONFIG.TOKEN_ADDRESS
			: XDAI_CONFIG.TOKEN_ADDRESS);
	const tokenOptions = await fetchTokenInfo(provider, address);
	const { ethereum } = window;
	if (tokenOptions) {
		await ethereum.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20',
				options: tokenOptions,
			},
		});
	}
}

export async function addNetwork(network: number): Promise<void> {
	const { ethereum } = window;
	await ethereum.request({
		method: 'wallet_addEthereumChain',
		params: [networksParams[network]],
	});
}

export async function switchNetwork(network: number): Promise<void> {
	const { ethereum } = window;
	const { chainId } = networksParams[network];

	try {
		const res = await ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId }],
		});
		if (res) {
			addNetwork(network);
		}
	} catch (switchError: any) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError) {
			addNetwork(network);
		}
		captureException(switchError, {
			tags: {
				section: 'switchNetwork',
			},
		});
	}
}

export async function addToken_old(
	tokenAddress: string,
	tokenSymbol: string,
	tokenDecimals: number,
	tokenImage: string,
) {
	const { ethereum } = window;
	try {
		// wasAdded is a boolean. Like any RPC method, an error may be thrown.
		const wasAdded = await ethereum.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20', // Initially only supports ERC20, but eventually more!
				options: {
					address: tokenAddress, // The address that the token is at.
					symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
					decimals: tokenDecimals, // The number of decimals in the token
					image: tokenImage, // A string url of the token logo
				},
			},
		});

		if (wasAdded) {
			console.log('Thanks for your interest!');
		} else {
			console.log('Your loss!');
		}
	} catch (error) {
		console.log(error);
		captureException(error, {
			tags: {
				section: 'addToken',
			},
		});
	}
}
