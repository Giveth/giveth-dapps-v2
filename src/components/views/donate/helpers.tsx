import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { captureException } from '@sentry/nextjs';

import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { networksParams } from '@/helpers/blockchain';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import { sendTransaction, showToastError } from '@/lib/helpers';
import { saveDonation, updateDonation } from '@/services/donation';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import { MAX_TOKEN_ORDER } from '@/lib/constants/tokens';
import { IWalletAddress } from '@/apollo/types/types';
import { ISuccessDonation } from '@/components/views/donate/CryptoDonation';

export interface ISelectedToken extends IProjectAcceptedToken {
	value?: IProjectAcceptedToken;
	label?: string;
}

interface INetworkIds {
	[key: number]: boolean;
}

export const prepareTokenList = (tokens: IProjectAcceptedToken[]) => {
	let givIndex: number | undefined;
	const _tokens: ISelectedToken[] = [...tokens];
	_tokens.sort((t1, t2) => {
		const t1Order = t1.order || MAX_TOKEN_ORDER;
		const t2Order = t2.order || MAX_TOKEN_ORDER;
		if (t1Order === t2Order) {
			const t1Name = t1.name.toLowerCase();
			const t2Name = t2.name.toLowerCase();
			return t2Name > t1Name ? -1 : 1;
		}
		return t2Order > t1Order ? -1 : 1;
	});
	_tokens.forEach((token: IProjectAcceptedToken, index: number) => {
		if (
			token.symbol === 'GIV' ||
			token.symbol === 'TestGIV' ||
			token.name === 'Giveth'
		) {
			givIndex = index;
		}
		_tokens[index] = {
			...token,
			value: token,
			label: token.symbol,
		};
	});
	const givToken = _tokens[givIndex!];
	if (givToken && givIndex) {
		_tokens.splice(givIndex, 1);
		_tokens.splice(0, 0, givToken);
	}
	return _tokens;
};

export const filterTokens = (
	tokens: IProjectAcceptedToken[],
	networkId: number,
	acceptedNetworkIds: number[],
) => {
	if (!acceptedNetworkIds.includes(networkId)) return [];
	return tokens.filter(i => i.networkId === networkId);
};

export const getNetworkIds = (
	tokens: IProjectAcceptedToken[],
	recipientAddresses?: IWalletAddress[],
) => {
	const recipientAddressesNetwork = recipientAddresses?.map(
		address => address.isRecipient && address.networkId,
	);
	const networkIds: INetworkIds = {};
	tokens.forEach(i => {
		networkIds[i.networkId] = true;
	});
	const networkIdArrays = Object.keys(networkIds).map(i => Number(i));
	return networkIdArrays.filter(networkId =>
		recipientAddressesNetwork?.includes(networkId),
	);
};

export const getNetworkNames = (networks: number[], text: string) => {
	return networks.map((i, index) => {
		const name = networksParams[i]?.chainName;
		const lastLoop = networks.length === index + 1;
		return (
			<span key={i}>
				{name}
				{!lastLoop && ' ' + text + ' '}
			</span>
		);
	});
};

export interface IConfirmDonation {
	setDonationSaved?: (value: boolean) => void;
	web3Context: Web3ReactContextInterface;
	setDonating: (value: boolean) => void;
	walletAddress: string;
	projectId: number;
	isDonationToGiveth?: boolean;
	amount: number;
	token: IProjectAcceptedToken;
	setSuccessDonation?: (value: ISuccessDonation) => void;
	setFailedModalType: (i: EDonationFailedType) => void;
	givBackEligible?: boolean;
	setTxHash: (i: string) => void;
	anonymous?: boolean;
}

export const confirmDonation = async (props: IConfirmDonation) => {
	const {
		walletAddress,
		amount,
		token,
		setSuccessDonation,
		setFailedModalType,
		web3Context,
		setDonating,
		setDonationSaved,
		givBackEligible,
		setTxHash,
		isDonationToGiveth,
	} = props;

	const { library } = web3Context;
	const { address } = token;

	let donationId = 0,
		donationSaved = false;

	try {
		const toAddress = isAddressENS(walletAddress!)
			? await getAddressFromENS(walletAddress!, library)
			: walletAddress;

		const transactionObj = {
			to: toAddress,
			value: amount.toString(),
		};

		const txCallbacks = {
			onTxHash: async (txHash: string, nonce: number) => {
				setTxHash(txHash);
				saveDonation({ nonce, txHash, ...props })
					.then(res => {
						donationId = res;
						setDonationSaved && setDonationSaved(true);
						donationSaved = true;
					})
					.catch(() => {
						setFailedModalType(EDonationFailedType.NOT_SAVED);
						setDonating(false);
					});
			},
			onReceipt: async (txHash: string) => {
				updateDonation(donationId, EDonationStatus.VERIFIED);
				donationSaved &&
					setSuccessDonation &&
					setSuccessDonation({ txHash, givBackEligible });
			},
		};

		await sendTransaction(library, transactionObj, txCallbacks, address);
	} catch (error: any) {
		if (
			(error.replacement && error.cancelled === true) ||
			error.reason === 'transaction failed'
		) {
			setTxHash(error.replacement?.hash || error.transactionHash);
			setFailedModalType(
				error.cancelled
					? EDonationFailedType.CANCELLED
					: EDonationFailedType.FAILED,
			);
			updateDonation(donationId, EDonationStatus.FAILED);
		} else if (error.code === 4001) {
			setFailedModalType(EDonationFailedType.REJECTED);
		} else {
			showToastError(error);
			setFailedModalType(EDonationFailedType.FAILED);
		}
		setDonating(false);
		setDonationSaved && setDonationSaved(false);
		captureException(error, {
			tags: {
				section: 'confirmDonation',
			},
		});
	}
};
