import { Contract } from 'ethers';
import config from '@/configuration';
import { networksParams } from '@/utils/constants';
import { abi as UNI_ABI } from '@/artifacts/UNI.json';
import { JsonRpcProvider } from '@ethersproject/providers';

declare let window: any;

const { MAINNET_CONFIG, XDAI_CONFIG } = config;

const tokenImage =
	'https://raw.githubusercontent.com/Giveth/giveth-design-assets/master/02-logos/GIV%20Token/GIVToken_200x200.png';

interface ITokenOptins {
	address: string;
	symbol: string;
	decimals: number;
	image: string;
}

const fetchTokenInfo = async (
	provider: JsonRpcProvider,
): Promise<ITokenOptins | undefined> => {
	const address =
		provider.network.chainId === config.MAINNET_NETWORK_NUMBER
			? MAINNET_CONFIG.TOKEN_ADDRESS
			: XDAI_CONFIG.TOKEN_ADDRESS;
	const contract = new Contract(address, UNI_ABI, provider);
	try {
		const [_decimal, _symbol]: [number, string] = await Promise.all([
			contract.decimals(),
			contract.symbol(),
		]);
		return {
			address: address,
			symbol: _symbol,
			decimals: _decimal,
			image: tokenImage,
		};
	} catch (error) {
		console.error('error in fetchTokenInfo', error);
	}
	return;
};

export async function addGIVToken(provider: JsonRpcProvider): Promise<void> {
	const { ethereum } = window;
	const tokenOptions = await fetchTokenInfo(provider);
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
		params: [{ ...networksParams[network] }],
	});
}

export async function switchNetwork(network: number): Promise<void> {
	const { ethereum } = window;
	const { chainId } = networksParams[network];

	try {
		await ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId }],
		});
	} catch (switchError: any) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError.code === 4902) {
			addNetwork(network);
		}
	}
}

export async function addToken(
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
	}
}
