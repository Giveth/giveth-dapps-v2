import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { captureException } from '@sentry/nextjs';

import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { networksParams } from '@/helpers/blockchain';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import { sendTransaction, showToastError } from '@/lib/helpers';
import { saveDonation, updateDonation } from '@/services/donation';
import { IDonateModalProps } from '@/components/modals/DonateModal';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { EDonationFailedType } from '@/components/modals/FailedDonation';

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
	_tokens.sort((a: IProjectAcceptedToken, b: IProjectAcceptedToken) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();
		if (nameA < nameB) {
			return -1;
		} else if (nameA > nameB) {
			return 1;
		}
		return 0;
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
) => {
	return tokens.filter(i => i.networkId === networkId);
};

export const getNetworkIds = (tokens: IProjectAcceptedToken[]) => {
	const networkIds: INetworkIds = {};
	tokens.forEach(i => {
		networkIds[i.networkId] = true;
	});
	return Object.keys(networkIds).map(i => Number(i));
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

export interface IConfirmDonation extends IDonateModalProps {
	setDonationSaved: (value: boolean) => void;
	web3Context: Web3ReactContextInterface;
	setDonating: (value: boolean) => void;
}

export const confirmDonation = async (props: IConfirmDonation) => {
	const {
		project,
		amount,
		token,
		setSuccessDonation,
		setFailedModalType,
		web3Context,
		setDonating,
		setDonationSaved,
		givBackEligible,
		setTxHash,
	} = props;

	const { library } = web3Context;
	const { walletAddress } = project;
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
						setDonationSaved(true);
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
		setDonationSaved(false);
		captureException(error, {
			tags: {
				section: 'confirmDonation',
			},
		});
	}
};
