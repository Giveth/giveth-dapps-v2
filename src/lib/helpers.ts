// eslint-disable-next-line import/named
import unescape from 'lodash/unescape';
import {
	sendTransaction as wagmiSendTransaction,
	readContract,
} from '@wagmi/core';
import { getDataSuffix, submitReferral } from '@divvi/referral-sdk';
// @ts-ignore
import { captureException } from '@sentry/nextjs';
// import { type Address, erc20Abi } from 'wagmi';
import {
	Address,
	Chain,
	parseEther,
	parseUnits,
	erc20Abi,
	encodeFunctionData,
} from 'viem';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { giveconomyTabs } from '@/lib/constants/Tabs';
import { getRequest } from '@/helpers/requests';
import { IUser, IWalletAddress } from '@/apollo/types/types';
import { gToast, ToastType } from '@/components/toasts';
import config, { isProduction } from '@/configuration';
import { AddressZero } from './constants/constants';
import { ChainType, NonEVMChain } from '@/types/config';
import { wagmiConfig } from '@/wagmiConfigs';
import usdtMainnetABI from '@/artifacts/usdtMainnetABI.json';
import { isGnosisSafeAddress } from './safe';

declare let window: any;
interface TransactionParams {
	to: Address;
	value: string;
	chainId?: number;
}

const defaultLocale = process.env.defaultLocale;
const locales = process.env.locales;

export const fullPath = (path: string) => `${config.FRONTEND_LINK}${path}`;

export const formatBalance = (balance?: string | number) => {
	return parseFloat(String(balance || 0)).toLocaleString('en-US', {
		maximumFractionDigits: 6,
		minimumFractionDigits: 2,
	});
};

export const formatUSD = (balance?: string | number, decimals = 2) => {
	return parseFloat(String(balance || 0)).toLocaleString('en-US', {
		maximumFractionDigits: decimals,
	});
};

export const formatPrice = (balance?: string | number) => {
	return parseFloat(String(balance || 0)).toLocaleString('en-US', {
		maximumFractionDigits: 6,
	});
};

export const truncateToDecimalPlaces = (strNum: string, decimals: number) => {
	let index = strNum.indexOf('.');
	if (index === -1 || decimals < 1) {
		return Number(strNum);
	}
	let length = index + 1 + decimals;
	return Number(strNum.substring(0, length));
};

export const thousandsSeparator = (x?: string | number): string | undefined => {
	return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatTxLink = (params: {
	txHash?: string;
	chainType?: ChainType;
	networkId?: number;
}) => {
	const { txHash, chainType, networkId } = params;
	if (chainType === ChainType.SOLANA) {
		return formatSolanaTxLink(txHash);
	}
	if (chainType === ChainType.STELLAR) {
		return formatStellarTxLink(txHash);
	}
	return formatEvmTxLink(networkId, txHash);
};

const formatEvmTxLink = (networkId?: number, txHash?: string) => {
	if (!networkId || !txHash || !config.EVM_NETWORKS_CONFIG[networkId])
		return '';
	return `${config.EVM_NETWORKS_CONFIG[networkId].blockExplorers?.default.url}/tx/${txHash}`;
};

const formatSolanaTxLink = (txHash?: string) => {
	if (!txHash) return '';

	const baseUrl = `${config.SOLANA_CONFIG.blockExplorers.default.url}/tx/${txHash}`;

	if (isProduction) {
		return baseUrl;
	}
	// Test environment
	return `${baseUrl}?cluster=devnet`;
};

const formatStellarTxLink = (txHash?: string) => {
	if (!txHash) return '';
	return `https://stellar.expert/explorer/public/tx/${txHash}`;
};

export function formatWalletLink(
	walletChainType: ChainType | null,
	chain?: Chain | WalletAdapterNetwork,
	address?: string,
) {
	if (!address || !chain || !walletChainType) return '';

	switch (walletChainType) {
		case ChainType.EVM:
			const chainId = (chain as Chain)?.id;
			if (!config.EVM_NETWORKS_CONFIG[chainId]) return '';
			return `${config.EVM_NETWORKS_CONFIG[chainId]?.blockExplorers?.default.url}/address/${address}`;

		case ChainType.SOLANA:
			const url = `https://explorer.solana.com/address/${address}`;
			switch (chain) {
				case WalletAdapterNetwork.Mainnet:
					return url;
				case WalletAdapterNetwork.Devnet:
					return `${url}?cluster=devnet`;
				case WalletAdapterNetwork.Testnet:
					return `${url}?cluster=testnet`;
			}
			return '';

		default:
			return '';
	}
}

export const durationToYMDh = (
	ms: number,
	full: boolean = false,
	locale: string = 'en',
) => {
	const baseTime = new Date(0);
	const duration = new Date(ms);

	const y = duration.getUTCFullYear() - baseTime.getUTCFullYear();
	const m = duration.getUTCMonth() - baseTime.getUTCMonth();
	const d = duration.getUTCDate() - baseTime.getUTCDate();
	const h = duration.getUTCHours() - baseTime.getUTCHours();
	const min = duration.getUTCMinutes() - baseTime.getUTCMinutes();
	const sec = duration.getUTCSeconds() - baseTime.getUTCSeconds();

	// { year: y, month: m, day: d, hour: h, minute: min, second: sec }
	const shortRes = { y, m, d, h, min, sec };
	if (full) {
		let fullRes: any = {};
		if (locale === 'ct') {
			if (y) fullRes[`any${y > 1 ? 's' : ''}`] = y;
			if (m) fullRes[`${m > 1 ? 'mesos' : 'mes'}`] = m;
			if (d) fullRes[`${d > 1 ? 'dies' : 'dia'}`] = d;
			if (h) fullRes[`hora${h > 1 ? 's' : ''}`] = h;
			if (min) fullRes[`minut${min > 1 ? 's' : ''}`] = min;
			if (sec) fullRes[`segon${sec > 1 ? 's' : ''}`] = sec;
		}
		if (locale === 'en') {
			if (y) fullRes[`year${y > 1 ? 's' : ''}`] = y;
			if (m) fullRes[`month${m > 1 ? 's' : ''}`] = m;
			if (d) fullRes[`day${d > 1 ? 's' : ''}`] = d;
			if (h) fullRes[`hour${h > 1 ? 's' : ''}`] = h;
			if (min) fullRes[`minute${min > 1 ? 's' : ''}`] = min;
			if (sec) fullRes[`second${sec > 1 ? 's' : ''}`] = sec;
		}
		if (locale === 'es') {
			if (y) fullRes[`año${y > 1 ? 's' : ''}`] = y;
			if (m) fullRes[`mes${m > 1 ? 'es' : ''}`] = m;
			if (d) fullRes[`día${d > 1 ? 's' : ''}`] = d;
			if (h) fullRes[`hora${h > 1 ? 's' : ''}`] = h;
			if (min) fullRes[`minuto${min > 1 ? 's' : ''}`] = min;
			if (sec) fullRes[`segundo${sec > 1 ? 's' : ''}`] = sec;
		}
		return fullRes;
	}
	return shortRes;
};

export const durationToString = (
	ms: number,
	length = 3,
	full = false,
	locale: string = 'en',
) => {
	const temp: { [key: string]: number } = durationToYMDh(ms, full, locale);
	const res: string[] = [];
	for (const key in temp) {
		if (Object.prototype.hasOwnProperty.call(temp, key)) {
			const value: number = temp[key];
			if (value) {
				res.push(`${value} ${key}`);
			}
		}
	}
	return res.slice(0, length).join(' ');
};

export const formatDate = (date: Date, locale?: string) => {
	return date
		.toLocaleString(locale || 'en-US', {
			weekday: 'short',
			day: 'numeric',
			year: 'numeric',
			month: 'short',
			hour: 'numeric',
			minute: 'numeric',
		})
		.replace(/,/g, '');
};

/**
 * Format: "March 18" or, if includeYear: true → "April 1, 2025"
 *
 * @param dateInput Date or string or number
 * @param opts Include year or not, locale and time zone
 * @returns
 */
export function formatMonthDay(
	dateInput: Date | string | number,
	opts?: { includeYear?: boolean; locale?: string; timeZone?: string },
): string {
	const {
		includeYear = false,
		locale = 'en-US',
		timeZone = 'UTC',
	} = opts || {};
	const d = new Date(dateInput);
	if (Number.isNaN(d.getTime())) return '';

	const options: Intl.DateTimeFormatOptions = {
		month: 'long',
		day: 'numeric',
		timeZone,
		...(includeYear ? { year: 'numeric' } : {}),
	};

	return new Intl.DateTimeFormat(locale, options).format(d);
}

export const smallFormatDate = (date: Date, locale?: string) => {
	return date.toLocaleString(locale || 'en-US', {
		day: 'numeric',
		year: 'numeric',
		month: 'short',
	});
};

// format date to mm-dd-yyyy (ex: Jun-31-2021)
export const smallDashedFormatDate = (date: Date, locale?: string) => {
	return date
		.toLocaleString(locale || 'en-US', {
			day: 'numeric',
			year: 'numeric',
			month: 'short',
		})
		.split(' ')
		.join('-')
		.split(',')
		.join('');
};

export const isSSRMode = typeof window === 'undefined';

export const suggestNewAddress = (
	addresses: IWalletAddress[],
	chain: Chain | NonEVMChain,
) => {
	if (!addresses || addresses.length < 1) return '';
	const EVMAddresses = addresses.filter(
		address =>
			address.chainType === ChainType.EVM ||
			address.chainType === undefined,
	);
	// We shouldn't suggest anything for NON EVM address input
	const isSame = compareAddressesArray(EVMAddresses.map(a => a.address));
	if (isSame) {
		// Don't suggest EVM addresses for Non EVM address input
		if (
			'chainType' in chain &&
			chain.chainType !== ChainType.EVM &&
			chain.chainType !== undefined
		) {
			return '';
		}
		return EVMAddresses[0].address;
	} else {
		return '';
	}
};

export const compareAddresses = (
	add1: string | undefined | null,
	add2: string | undefined | null,
) => {
	if (!add1 || !add2) return false;
	return add1?.toLowerCase() === add2?.toLowerCase();
};

export const compareAddressesArray = (
	addresses?: Array<string | undefined>,
) => {
	if (!addresses || addresses.length === 0) return false;
	const lowerCaseAddresses: string[] = [];
	for (let i = 0; i < addresses.length; i++) {
		const address = addresses[i];
		if (address) {
			lowerCaseAddresses.push(address.toLowerCase());
		} else {
			return false;
		}
	}
	return new Set(lowerCaseAddresses).size === 1;
};

export const findAddressByChain = (
	addresses: IWalletAddress[],
	chainId: number,
	chainType?: ChainType,
) => {
	return addresses?.find(address =>
		chainId
			? address.networkId === chainId
			: address.chainType === chainType,
	);
};

export const isUserRegistered = (user?: IUser) => {
	// You should check if user is isSignedIn then call this function
	return Boolean(user && user.name && user.email);
};

export const htmlToText = (text?: string) => {
	if (!text) return;
	const formattedText = text
		.replace(/<[^>]+>/g, '')
		.replace(/<\/(?:.|\n)*?>/gm, ' ') // replace closing tags w/ a space
		.replace(/<(?:.|\n)*?>/gm, '') // strip opening tags
		.trim();
	return unescape(formattedText);
};

export const capitalizeFirstLetter = (string: string) => {
	return (
		string.toLowerCase().charAt(0).toUpperCase() +
		string.toLowerCase().slice(1)
	);
};

export const capitalizeAllWords = (string: string) => {
	return string.split(' ').map(capitalizeFirstLetter).join(' ');
};

export const isNoImg = (image: string | undefined) => !image || image === '';

export const shortenAddress = (
	address: string | null | undefined,
	charsLength = 4,
) => {
	const prefixLength = 2; // "0x"
	if (!address) {
		return '';
	}
	if (address.length < charsLength * 2 + prefixLength) {
		return address;
	}
	return `${address.slice(0, charsLength + prefixLength)}…${address.slice(
		-charsLength,
	)}`;
};

// Sends a transaction, either as an ERC20 token transfer or a regular ETH transfer.
export async function sendEvmTransaction(
	params: TransactionParams,
	chainId?: number,
	contractAddress?: Address,
) {
	try {
		let hash: Address;

		if (contractAddress && contractAddress !== AddressZero) {
			hash = await handleErc20Transfer(
				{ ...params, chainId },
				contractAddress,
			);
		} else {
			hash = await handleEthTransfer({ ...params, chainId });
		}

		return hash;
	} catch (error: any) {
		if (error.replacement && !error.cancelled) {
			return;
		}
		captureException(error, {
			tags: {
				section: 'sendTransaction',
			},
		});
		throw error;
	}
}

export async function handleErc20Transfer(
	// Handles the transfer for ERC20 tokens, returning the transaction hash.
	params: TransactionParams,
	contractAddress: Address,
): Promise<Address> {
	const ABItoUse =
		contractAddress === '0xdac17f958d2ee523a2206206994597c13d831ec7'
			? usdtMainnetABI
			: erc20Abi;

	const baseProps = {
		address: contractAddress,
		abi: ABItoUse,
	};

	let decimals = await readContract(wagmiConfig, {
		...baseProps,
		functionName: 'decimals',
	});
	if (typeof decimals === 'bigint') {
		decimals = Number(decimals.toString());
	}

	const value = parseUnits(params.value, decimals as number);

	// Step 1: Encode function data manually
	const baseData = encodeFunctionData({
		abi: ABItoUse,
		functionName: 'transfer',
		args: [params.to, value],
	});

	// Step 2: Get referral data suffix
	const dataSuffix = getDataSuffix({
		consumer: '0x62Bb362d63f14449398B79EBC46574F859A6045D',
		providers: ['0x0423189886d7966f0dd7e7d256898daeee625dca'],
	});

	const chainId = params.chainId;

	// Step 3: Create a wallet client

	// Step 4: Send transaction with referral data
	const txHash = await wagmiSendTransaction(wagmiConfig, {
		to: contractAddress,
		data: `${baseData}${dataSuffix}` as `0x${string}`,
		value: 0n,
	});

	// Step 5: Report to Divvi
	if (chainId) {
		try {
			await submitReferral({
				txHash,
				chainId,
			});
		} catch {
			return txHash;
		}
	}

	return txHash;
}

// Handles the transfer for ETH, returning the transaction hash.
async function handleEthTransfer(params: TransactionParams): Promise<Address> {
	const value = parseEther(params.value);

	// Step 2: Get referral data suffix
	const dataSuffix = getDataSuffix({
		consumer: '0x62Bb362d63f14449398B79EBC46574F859A6045D',
		providers: ['0x0423189886d7966f0dd7e7d256898daeee625dca'],
	});

	// Check if to address is a safe address if it is, we don't need to add the referral data
	const isSafeAddress = await isGnosisSafeAddress(params.to);
	const data = isSafeAddress ? '0x' : (('0x' + dataSuffix) as `0x${string}`);

	const hash = await wagmiSendTransaction(wagmiConfig, {
		to: params.to,
		value: value,
		data,
	});

	// Step 5: Report to Divvi
	if (params.chainId) {
		try {
			await submitReferral({
				txHash: hash,
				chainId: params.chainId,
			});
		} catch {
			return hash;
		}
	}

	console.log('ETH transfer result', { hash });
	return hash;
}

//TODO: Handle this
// export async function signMessage(
// 	message: string,
// 	address: string | undefined | null,
// 	chainId?: number,
// 	signer?: any,
// ) {
// 	try {
// 		// COMMENTING THIS AS BACKEND NEEDS TO BE UPDATED TO THIS WAY

// 		// const customPrefix = `\u0019${window.location.hostname} Signed Message:\n`
// 		// const prefixWithLength = Buffer.from(`${customPrefix}${message.length.toString()}`, 'utf-8')
// 		// const finalMessage = Buffer.concat([prefixWithLength, Buffer.from(message)])

// 		// const hashedMsg = keccak256(finalMessage)

// 		// const domain = {
// 		//   name: 'Giveth Login',
// 		//   version: '1',
// 		//   chainId
// 		// }

// 		// const types = {
// 		//   // EIP712Domain: [
// 		//   //   { name: 'name', type: 'string' },
// 		//   //   { name: 'chainId', type: 'uint256' },
// 		//   //   { name: 'version', type: 'string' }
// 		//   //   // { name: 'verifyingContract', type: 'address' }
// 		//   // ],
// 		//   User: [{ name: 'wallets', type: 'address[]' }],
// 		//   Login: [
// 		//     { name: 'user', type: 'User' },
// 		//     { name: 'contents', type: 'string' }
// 		//   ]
// 		// }

// 		// const value = {
// 		//   user: {
// 		//     wallets: [address]
// 		//   },
// 		//   contents: hashedMsg
// 		// }

// 		// return await signer._signTypedData(domain, types, value)

// 		let signedMessage = null;
// 		const customPrefix = `\u0019${window.location.hostname} Signed Message:\n`;
// 		const prefixWithLength = Buffer.from(
// 			`${customPrefix}${message.length.toString()}`,
// 			'utf-8',
// 		);
// 		const finalMessage = Buffer.concat([
// 			prefixWithLength,
// 			Buffer.from(message),
// 		]);

// 		const hashedMsg = keccak256(finalMessage);
// 		const send = promisify(signer.provider.provider.sendAsync);
// 		const msgParams = JSON.stringify({
// 			primaryType: 'Login',
// 			types: {
// 				EIP712Domain: [
// 					{ name: 'name', type: 'string' },
// 					{ name: 'chainId', type: 'uint256' },
// 					{ name: 'version', type: 'string' },
// 					// { name: 'verifyingContract', type: 'address' }
// 				],
// 				Login: [{ name: 'user', type: 'User' }],
// 				User: [{ name: 'wallets', type: 'address[]' }],
// 			},
// 			domain: {
// 				name: 'Giveth Login',
// 				chainId,
// 				version: '1',
// 			},
// 			message: {
// 				contents: hashedMsg,
// 				user: {
// 					wallets: [address],
// 				},
// 			},
// 		});
// 		const { result } = await send({
// 			method: 'eth_signTypedData_v4',
// 			params: [address, msgParams],
// 			from: address,
// 		});
// 		signedMessage = result;

// 		return signedMessage;
// 	} catch (error) {
// 		console.log('Signing Error!', { error });
// 		captureException(error, {
// 			tags: {
// 				section: 'signError',
// 			},
// 		});
// 		return false;
// 	}
// }

export const isGIVeconomyRoute = (route: string) => {
	const givEconomyRoute = giveconomyTabs.find(
		giveconomyTab => giveconomyTab.href === route,
	);
	return !!givEconomyRoute;
};

export const showToastError = (err: any) => {
	let errorMessage =
		typeof err === 'string' ? err : JSON.stringify(err.message || err);
	if (errorMessage.startsWith('"') && errorMessage.endsWith('"')) {
		errorMessage = errorMessage.slice(1, -1);
	}
	gToast(errorMessage, {
		type: ToastType.DANGER,
		position: 'top-center',
	});
	console.error({ err });
};

export const calcBiggestUnitDifferenceTime = (_time: string) => {
	const time = new Date(_time);
	const diff: { [key: string]: number } = durationToYMDh(
		Date.now() - time.getTime(),
	);
	if (diff.y > 0) return ` ${diff.y} year${diff.y > 1 ? 's' : ''} ago`;
	if (diff.m > 0) return ` ${diff.m} month${diff.m > 1 ? 's' : ''} ago`;
	if (diff.d > 0) return ` ${diff.d} day${diff.d > 1 ? 's' : ''} ago`;
	if (diff.h > 0) return ` ${diff.h} hour${diff.h > 1 ? 's' : ''} ago`;
	if (diff.min > 0)
		return ` ${diff.min} minute${diff.min > 1 ? 's' : ''} ago`;
	return ' Just now';
};

export const timeFromNow = (
	date: string,
	formatter: any,
	defaultMessage: string,
) => {
	const options = {
		style: 'long',
	};
	const time = new Date(date);
	const diff: { [key: string]: number } = durationToYMDh(
		Date.now() - time.getTime(),
	);
	if (diff.y > 0)
		return ` ${formatter(Math.trunc(diff.y * -1), 'year', options)}`;
	if (diff.m > 0)
		return ` ${formatter(Math.trunc(diff.m * -1), 'month', options)}`;
	if (diff.d > 0)
		return ` ${formatter(Math.trunc(diff.d * -1), 'day', options)}`;
	if (diff.h > 0)
		return ` ${formatter(Math.trunc(diff.h * -1), 'hour', options)}`;
	if (diff.min > 0)
		return ` ${formatter(Math.trunc(diff.min * -1), 'minute', options)}`;

	return ` ${defaultMessage}`;
};

export const detectBrave = async () => {
	// @ts-ignore
	return (navigator.brave && (await navigator.brave.isBrave())) || false;
};

export function pollEvery(fn: Function, delay: any) {
	let timer: any = null;
	// having trouble with this type
	let stop = false;
	const poll = async (request: any, onResult: Function) => {
		const result = await request();
		if (!stop) {
			onResult(result);
			timer = setTimeout(poll.bind(null, request, onResult), delay);
		}
	};
	return (...params: any) => {
		const { request, onResult } = fn(...params);
		poll(request, onResult).then();
		return () => {
			stop = true;
			clearTimeout(timer);
		};
	};
}

export function isObjEmpty(obj: Object) {
	return Object.keys(obj).length > 0;
}

export const ArrayFrom0ToN = (n: number) => {
	let a = Array(n),
		b = 0;
	while (b < n) a[b] = b++;
	return a;
};

export const checkMultisigSession = async ({ safeAddress, chainId }: any) => {
	try {
		let status = 'not found';
		const sessionCheck = await getRequest(
			`${config.MICROSERVICES.authentication}/multisigAuthentication`,
			false,
			{
				safeAddress,
				network: chainId,
			},
		);
		status = sessionCheck?.status;

		return { status };
	} catch (error) {
		return { status: 'not found' };
	}
};

export const getUserIPInfo = async () => {
	return fetch('https://api.db-ip.com/v2/free/self')
		.then(res => res.json())
		.catch(err => {
			console.error('getUserIp error: ', { err });
			throw err;
		});
};

export const matchLocaleToSystemLocals = (locale: string) => {
	const spanishSpeakingCountryCodes = [
		'es',
		'mx',
		'ar',
		'pe',
		'co',
		'cl',
		'gt',
		'ec',
		'bo',
		'cu',
		'hn',
		'py',
		'sv',
		'ni',
		'cr',
		'pr',
		'pa',
		'uy',
		've',
		'do',
	];
	const lowercaseLocale = locale.toLowerCase();
	const isSpanish = spanishSpeakingCountryCodes.includes(lowercaseLocale);
	const _locale = isSpanish ? 'es' : lowercaseLocale;
	const isValidLocale = locales?.includes(_locale);
	return isValidLocale ? _locale : undefined;
};

export const getLocaleFromNavigator = () => {
	if (typeof navigator === 'undefined') return defaultLocale!;
	const navigatorLocale = navigator.language.split('-')[0];
	return matchLocaleToSystemLocals(navigatorLocale);
};

export const getLocaleFromIP = async () => {
	try {
		const { countryCode } = await getUserIPInfo();
		return matchLocaleToSystemLocals(countryCode);
	} catch (e) {
		return undefined;
	}
};
export function generateRandomNonce(): number {
	const min: number = 100;
	const max: number = 999999999999999;

	// Generate a random number between min (inclusive) and max (exclusive)
	const nonce: number = Math.floor(Math.random() * (max - min + 1)) + min;

	return nonce;
}
