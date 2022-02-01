import { ethers } from 'ethers';
import { keccak256 } from '@ethersproject/keccak256';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { AuthereumConnector } from '@web3-react/authereum-connector';
import { promisify } from 'util';
import Routes from './constants/Routes';
import { networkInfo } from './constants/NetworksObj';
// @ts-ignore
import tokenAbi from 'human-standard-token-abi';

declare let window: any;
import { BasicNetworkConfig, GasPreference } from '@/types/config';
import { EWallets } from '@/lib/wallet/walletTypes';
import { brandColors } from '@giveth/ui-design-system';

export const DurationToYMDh = (ms: number) => {
	let baseTime = new Date(0);
	let duration = new Date(ms);

	let y = duration.getUTCFullYear() - baseTime.getUTCFullYear();
	let m = duration.getUTCMonth() - baseTime.getUTCMonth();
	let d = duration.getUTCDate() - baseTime.getUTCDate();
	let h = duration.getUTCHours() - baseTime.getUTCHours();
	// let min = duration.getUTCMinutes() - baseTime.getUTCMinutes();
	// let sec = duration.getUTCSeconds() - baseTime.getUTCSeconds();

	return { y, m, d, h };
};

export const DurationToString = (ms: number, length: number = 3) => {
	const temp: { [key: string]: number } = DurationToYMDh(ms);
	const res: string[] = [];
	for (const key in temp) {
		if (Object.prototype.hasOwnProperty.call(temp, key)) {
			const value: number = temp[key];
			if (value) {
				res.push(`${value}${key}`);
			}
		}
	}
	return res.slice(0, length).join(' ');
};

export const formatDate = (date: Date) => {
	return date
		.toLocaleString('en-US', {
			weekday: 'short',
			day: 'numeric',
			year: 'numeric',
			month: 'short',
			hour: 'numeric',
			minute: 'numeric',
		})
		.replace(/,/g, '');
};

export const getGasPreference = (
	networkConfig: BasicNetworkConfig,
): GasPreference => {
	const selectedWallet = window.localStorage.getItem('selectedWallet');
	// MetaMask works with gas preference cofnig
	if (selectedWallet === EWallets.METAMASK)
		return networkConfig.gasPreference || {};

	// For torus, it should be empty to work!
	return {};
};

export const isSSRMode = typeof window === 'undefined';

export const compareAddresses = (add1: string, add2: string) => {
	return add1?.toLowerCase() === add2?.toLowerCase();
};

export const slugToProjectView = (slug: string) => {
	return Routes.Project + '/' + slug;
};

export const slugToProjectDonate = (slug: string) => {
	return Routes.Donate + '/' + slug;
};

export const htmlToText = (text?: string) => {
	if (!text) return;
	return text
		.replace(/<\/(?:.|\n)*?>/gm, ' ') // replace closing tags w/ a space
		.replace(/<(?:.|\n)*?>/gm, '') // strip opening tags
		.trim();
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

export const breakPoints = {
	sm: 500,
	md: 768,
	lg: 992,
	xl: 1200,
};

export const mediaQueries = {
	sm: `@media (min-width: ${breakPoints.sm}px)`,
	md: `@media (min-width: ${breakPoints.md}px)`,
	lg: `@media (min-width: ${breakPoints.lg}px)`,
	xl: `@media (min-width: ${breakPoints.xl}px)`,
};

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

export const formatDateFromString = (date: string) => {
	const nDate = new Date(date);
	const year = nDate.getFullYear();
	const month = nDate.toLocaleString('default', { month: 'short' });
	const day = nDate.getDay();
	return month + ' ' + day + ', ' + year;
};

export function formatTxLink(
	chainId: number | undefined,
	hash: string | undefined,
) {
	return `${networkInfo(chainId).networkPrefix}tx/${hash}`;
}

export async function sendTransaction(
	web3: Web3Provider,
	params: any,
	txCallbacks: any,
	contractAddress: string,
	fromSigner: any,
	// traceableDonation = false
) {
	try {
		let web3Provider = web3;
		let txn = null;
		const txParams: any = {
			to: params?.to,
			// value: params?.value
		};

		web3Provider = fromSigner;

		// TRACEABLE DONATION
		// if (traceableDonation) {
		//   //
		//   // DEV: 0x279277482F13aeF92914317a0417DD591145aDc9
		//   // RELEASE: 0xC59dCE5CCC065A4b51A2321F857466A25ca49B40
		//   // TRACE: 0x30f938fED5dE6e06a9A7Cd2Ac3517131C317B1E7
		//
		//   // TODO !!!!!!!!!!!!
		//   const givethBridgeCurrent = new GivethBridge(
		//     web3,
		//     process.env.NEXT_PUBLIC_GIVETH_BRIDGE_ADDRESS
		//   )
		//   console.log({ givethBridgeCurrent })
		//   return alert('This is a trace donation, do something NOW!')
		// }

		// ERC20 TRANSFER
		if (contractAddress) {
			const contract = new Contract(contractAddress, tokenAbi, web3);
			const decimals = await contract.decimals.call();
			txParams.value = ethers.utils.parseUnits(
				params?.value,
				parseInt(decimals),
			);
			const instance = contract.connect(web3.getSigner());

			if (fromSigner) {
				txn = await instance.transfer(txParams?.to, txParams?.value);
				txCallbacks?.onTransactionHash(txn?.hash, txn?.from);
				return txn;
			}
			const from = await fromSigner.getAccounts();
			return instance
				.transfer(txParams?.to, txParams?.value)
				.send({
					from: from[0],
				})
				.on('transactionHash', txCallbacks?.onTransactionHash)
				.on('receipt', function (receipt: any) {
					console.log('receipt>>>', receipt);
					txCallbacks?.onReceiptGenerated(receipt);
				})
				.on('error', (error: any) => txCallbacks?.onError(error)); // If a out of gas error, the second parameter is the receipt.
		}

		// REGULAR ETH TRANSFER
		txParams.value = ethers.utils.parseEther(params?.value);
		if (!txCallbacks || fromSigner) {
			// gets hash and checks until it's mined
			txn = await web3Provider.sendTransaction(txParams);
			txCallbacks?.onTransactionHash(txn?.hash, txn?.from);
		}

		console.log('stTxn ---> : ', { txn });
		return txn;
	} catch (error: any) {
		console.log('Error sending transaction: ', { error });
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
		return false;
	}
}

export const LocalStorageTokenLabel = 'userToken';
