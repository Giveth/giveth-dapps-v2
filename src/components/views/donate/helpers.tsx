import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { captureException } from '@sentry/nextjs';

import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { networksParams } from '@/helpers/blockchain';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import { sendTransaction } from '@/lib/helpers';
import { saveDonation, updateDonation } from '@/services/donation';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import { MAX_TOKEN_ORDER } from '@/lib/constants/tokens';
import { IWalletAddress } from '@/apollo/types/types';

export interface ISelectedToken extends IProjectAcceptedToken {
	value?: IProjectAcceptedToken;
	label?: string;
}

interface INetworkIds {
	[key: number]: boolean;
}

export const prepareTokenList = (tokens: IProjectAcceptedToken[]) => {
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
		_tokens[index] = {
			...token,
			value: token,
			label: token.symbol,
		};
	});
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

export interface ICreateDonation {
	setDonationSaved?: (value: boolean) => void;
	web3Context: Web3ReactContextInterface;
	setDonating: (value: boolean) => void;
	walletAddress: string;
	projectId: number;
	amount: number;
	token: IProjectAcceptedToken;
	setFailedModalType: (i: EDonationFailedType) => void;
	setTxHash: (i: string) => void;
	anonymous?: boolean;
	chainvineReferred?: string | null;
}

export interface ICreateDonationResult {
	isSaved: boolean;
	txHash: string;
}

type TCreateDonation = (i: ICreateDonation) => Promise<ICreateDonationResult>;

export const createDonation: TCreateDonation = async props => {
	const {
		walletAddress,
		amount,
		token,
		setFailedModalType,
		web3Context,
		setDonating,
		setDonationSaved,
		setTxHash,
	} = props;

	const { library } = web3Context;
	const { address } = token;

	let donationId = 0,
		_txHash = '';

	try {
		const toAddress = isAddressENS(walletAddress!)
			? await getAddressFromENS(walletAddress!, library)
			: walletAddress;

		const transactionObj = {
			to: toAddress,
			value: amount.toString(),
		};

		const txCallbacks = {
			onTxHash: (txHash: string, nonce: number) => {
				_txHash = txHash;
				setTxHash(txHash);
				saveDonation({ nonce, txHash, ...props })
					.then(res => {
						donationId = res;
						setDonationSaved && setDonationSaved(true);
					})
					.catch(() => {
						setFailedModalType(EDonationFailedType.NOT_SAVED);
						setDonating(false);
					});
			},
			onReceipt: () => {
				updateDonation(donationId, EDonationStatus.VERIFIED);
			},
		};

		await sendTransaction(library, transactionObj, txCallbacks, address);
		return { isSaved: donationId > 0, txHash: _txHash };
	} catch (error: any) {
		_txHash = error.replacement?.hash || error.transactionHash;
		console.log({ error });
		if (
			(error.replacement && error.cancelled === true) ||
			error.reason === 'transaction failed'
		) {
			setTxHash(_txHash);
			setFailedModalType(
				error.cancelled
					? EDonationFailedType.CANCELLED
					: EDonationFailedType.FAILED,
			);
			updateDonation(donationId, EDonationStatus.FAILED);
		} else if (error.code === 'ACTION_REJECTED') {
			setFailedModalType(EDonationFailedType.REJECTED);
		} else {
			setFailedModalType(EDonationFailedType.FAILED);
		}
		setDonating(false);
		setDonationSaved && setDonationSaved(false);
		captureException(error, {
			tags: {
				section: 'confirmDonation',
			},
		});
		throw { isSaved: donationId > 0, txHash: _txHash };
	}
};
