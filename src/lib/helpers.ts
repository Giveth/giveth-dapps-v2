import { promisify } from 'util';
// eslint-disable-next-line import/named
import unescape from 'lodash/unescape';

import { parseEther, parseUnits } from '@ethersproject/units';
import { keccak256 } from '@ethersproject/keccak256';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { AddressZero } from '@ethersproject/constants';
import { brandColors } from '@giveth/ui-design-system';
// @ts-ignore
import abi from 'human-standard-token-abi';

import { captureException } from '@sentry/nextjs';
import { BasicNetworkConfig, GasPreference } from '@/types/config';
import { EWallets } from '@/lib/wallet/walletTypes';
import { giveconomyTabs } from '@/lib/constants/Tabs';
import { IUser, IWalletAddress } from '@/apollo/types/types';
import { gToast, ToastType } from '@/components/toasts';
import StorageLabel from '@/lib/localStorage';
import { networksParams } from '@/helpers/blockchain';
import config from '@/configuration';
import { ERC20 } from '@/types/contracts';

declare let window: any;

export const fullPath = (path: string) => `${config.FRONTEND_LINK}${path}`;

export const formatBalance = (balance?: string | number) => {
	return parseFloat(String(balance || 0)).toLocaleString('en-US', {
		maximumFractionDigits: 6,
		minimumFractionDigits: 2,
	});
};

export const formatUSD = (balance?: string | number) => {
	return parseFloat(String(balance || 0)).toLocaleString('en-US', {
		maximumFractionDigits: 2,
	});
};

export const formatPrice = (balance?: string | number) => {
	return parseFloat(String(balance || 0)).toLocaleString('en-US', {
		maximumFractionDigits: 6,
	});
};

export const thousandsSeparator = (x?: string | number): string | undefined => {
	return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatTxLink = (networkId?: number, txHash?: string) => {
	if (!networkId || !txHash || !networksParams[networkId]) return '';
	return `${networksParams[networkId].blockExplorerUrls[0]}tx/${txHash}`;
};

export function formatWalletLink(chainId?: number, address?: string) {
	if (!address || !chainId || !networksParams[chainId]) return '';
	return `${networksParams[chainId]?.blockExplorerUrls[0]}/address/${address}`;
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
		if (locale === 'ca') {
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

export const smallFormatDate = (date: Date, locale?: string) => {
	return date
		.toLocaleString(locale || 'en-US', {
			day: 'numeric',
			year: 'numeric',
			month: 'short',
		})
		.replace(/,/g, '');
};

export const getGasPreference = (
	networkConfig: BasicNetworkConfig,
): GasPreference => {
	const selectedWallet = window.localStorage.getItem(StorageLabel.WALLET);
	// MetaMask works with gas preference config
	if (selectedWallet === EWallets.METAMASK)
		return networkConfig.gasPreference || {};

	// For torus, it should be empty to work!
	return {};
};

export const isSSRMode = typeof window === 'undefined';

export const suggestNewAddress = (addresses?: IWalletAddress[]) => {
	if (!addresses || addresses.length < 1) return '';
	const isSame = compareAddressesArray(addresses.map(a => a.address));
	if (isSame) {
		return addresses[0].address;
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
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const noImgColors = [
	brandColors.cyan[500],
	brandColors.mustard[500],
	brandColors.giv[500],
];
export const noImgColor = () => noImgColors[Math.floor(Math.random() * 3)];

export const noImgIcon = '/images/GIV-icon-text.svg';

export const isNoImg = (image: string | undefined) =>
	!(image && !Number(image));

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

export async function sendTransaction(
	web3: Web3Provider,
	params: { to: string; value: string },
	txCallbacks: {
		onTxHash: (hash: string, nonce: number) => void;
		onReceipt: (receipt: any) => void;
	},
	contractAddress: string,
) {
	try {
		let tx;
		const txParams: any = {
			to: params.to,
		};

		const fromSigner = web3.getSigner();
		if (contractAddress && contractAddress !== AddressZero) {
			// ERC20 TRANSFER
			const contract = new Contract(
				contractAddress,
				abi,
				fromSigner,
			) as ERC20;
			const decimals = await contract.decimals();
			txParams.value = parseUnits(params.value, decimals);
			tx = await contract.transfer(txParams.to, txParams.value);
		} else {
			// REGULAR ETH TRANSFER
			txParams.value = parseEther(params.value);
			tx = await fromSigner.sendTransaction(txParams);
		}

		txCallbacks.onTxHash(tx.hash, tx.nonce);
		const receipt = await tx.wait();
		if (receipt.status) {
			txCallbacks.onReceipt(tx.hash);
		}

		console.log('Tx ---> : ', { tx, receipt });
	} catch (error: any) {
		if (error.replacement && !error.cancelled) {
			// Speed up the process by replacing the transaction
			txCallbacks.onReceipt(error.replacement.hash);
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

export async function signMessage(
	message: string,
	address: string | undefined | null,
	chainId?: number,
	signer?: any,
) {
	try {
		// COMMENTING THIS AS BACKEND NEEDS TO BE UPDATED TO THIS WAY

		// const customPrefix = `\u0019${window.location.hostname} Signed Message:\n`
		// const prefixWithLength = Buffer.from(`${customPrefix}${message.length.toString()}`, 'utf-8')
		// const finalMessage = Buffer.concat([prefixWithLength, Buffer.from(message)])

		// const hashedMsg = keccak256(finalMessage)

		// const domain = {
		//   name: 'Giveth Login',
		//   version: '1',
		//   chainId
		// }

		// const types = {
		//   // EIP712Domain: [
		//   //   { name: 'name', type: 'string' },
		//   //   { name: 'chainId', type: 'uint256' },
		//   //   { name: 'version', type: 'string' }
		//   //   // { name: 'verifyingContract', type: 'address' }
		//   // ],
		//   User: [{ name: 'wallets', type: 'address[]' }],
		//   Login: [
		//     { name: 'user', type: 'User' },
		//     { name: 'contents', type: 'string' }
		//   ]
		// }

		// const value = {
		//   user: {
		//     wallets: [address]
		//   },
		//   contents: hashedMsg
		// }

		// return await signer._signTypedData(domain, types, value)

		let signedMessage = null;
		const customPrefix = `\u0019${window.location.hostname} Signed Message:\n`;
		const prefixWithLength = Buffer.from(
			`${customPrefix}${message.length.toString()}`,
			'utf-8',
		);
		const finalMessage = Buffer.concat([
			prefixWithLength,
			Buffer.from(message),
		]);

		const hashedMsg = keccak256(finalMessage);
		const send = promisify(signer.provider.provider.sendAsync);
		const msgParams = JSON.stringify({
			primaryType: 'Login',
			types: {
				EIP712Domain: [
					{ name: 'name', type: 'string' },
					{ name: 'chainId', type: 'uint256' },
					{ name: 'version', type: 'string' },
					// { name: 'verifyingContract', type: 'address' }
				],
				Login: [{ name: 'user', type: 'User' }],
				User: [{ name: 'wallets', type: 'address[]' }],
			},
			domain: {
				name: 'Giveth Login',
				chainId,
				version: '1',
			},
			message: {
				contents: hashedMsg,
				user: {
					wallets: [address],
				},
			},
		});
		const { result } = await send({
			method: 'eth_signTypedData_v4',
			params: [address, msgParams],
			from: address,
		});
		signedMessage = result;

		return signedMessage;
	} catch (error) {
		console.log('Signing Error!', { error });
		captureException(error, {
			tags: {
				section: 'signError',
			},
		});
		return false;
	}
}

export const isGIVeconomyRoute = (route: string) => {
	const givEconomyRoute = giveconomyTabs.find(
		giveconomyTab => giveconomyTab.href === route,
	);
	return !!givEconomyRoute;
};

export const showToastError = (err: any) => {
	const errorMessage =
		typeof err === 'string' ? err : JSON.stringify(err.message || err);
	gToast(errorMessage, {
		type: ToastType.DANGER,
		position: 'top-center',
	});
	console.log({ err });
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
		return ` ${formatter(Math.trunc(diff.m * -1), 'min', options)}`;
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

export const networkInfo = (networkId?: number) => {
	if (!networkId || !networksParams[networkId]) return {};
	const info = networksParams[networkId];
	return {
		networkName: info.chainName,
		networkToken: info.nativeCurrency.symbol,
	};
};

export const createSiweMessage = async (
	address: string,
	chainId: number,
	statement: string,
) => {
	try {
		let domain = 'giveth.io';

		if (typeof window !== 'undefined') {
			domain = window.location.hostname;
		}
		const nonceResponse: any = await fetch(
			`${config.MICROSERVICES.authentication}/nonce`,
		).then(n => {
			return n.json();
		});
		const nonce = nonceResponse.message;
		const { SiweMessage } = await import('siwe');
		const siweMessage = new SiweMessage({
			domain,
			address,
			nonce,
			statement,
			uri: origin,
			version: '1',
			chainId,
		});
		return {
			message: siweMessage.prepareMessage(),
			nonce,
		};
	} catch (error) {
		console.log({ error });
		return false;
	}
};

export function isObjEmpty(obj: Object) {
	return Object.keys(obj).length > 0;
}

export const ArrayFrom0ToN = (n: number) => {
	let a = Array(n),
		b = 0;
	while (b < n) a[b] = b++;
	return a;
};
