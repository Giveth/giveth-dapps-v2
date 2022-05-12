import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { captureException } from '@sentry/nextjs';

import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { networksParams } from '@/helpers/blockchain';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import { sendTransaction, showToastError } from '@/lib/helpers';
import { saveDonation } from '@/services/donation';
import { IDonateModalProps } from '@/components/modals/DonateModal';

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
		setShowFailedModal,
		web3Context,
		setDonating,
		setDonationSaved,
		givBackEligible,
		setTxHash,
	} = props;

	const { library } = web3Context;
	const { walletAddress } = project;
	const { address } = token;

	try {
		const toAddress = isAddressENS(walletAddress!)
			? await getAddressFromENS(walletAddress!, library)
			: walletAddress;

		const transactionObj = {
			to: toAddress,
			value: amount.toString(),
		};

		const txCallbacks = {
			onTxHash: async (txHash: string) => {
				await saveDonation({ txHash, toAddress, ...props });
				setTxHash(txHash);
				setDonationSaved(true);
			},
			onReceipt: (txHash: string) => {
				setSuccessDonation({ txHash, givBackEligible });
			},
		};

		await sendTransaction(library, transactionObj, txCallbacks, address);
	} catch (error: any) {
		setDonating(false);
		setDonationSaved(false);
		const code = error.data?.code;
		if (code === ('INSUFFICIENT_FUNDS' || 'UNPREDICTABLE_GAS_LIMIT')) {
			showToastError('Insufficient Funds');
		} else if (error.replacement && error.cancelled === true) {
			setTxHash(error.replacement.hash);
			setShowFailedModal(true);
			showToastError('Transaction cancelled!');
		} else {
			setShowFailedModal(true);
			showToastError(error);
		}
		captureException(error, {
			tags: {
				section: 'confirmDonation',
			},
		});
	}
};
