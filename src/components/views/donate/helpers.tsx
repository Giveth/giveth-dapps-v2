import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { captureException } from '@sentry/nextjs';

import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { networksParams } from '@/helpers/blockchain';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import { sendTransaction, showToastError } from '@/lib/helpers';
import { saveDonation, saveDonationTransaction } from '@/services/donation';
import { IDonateModalProps } from '@/components/modals/DonateModal';
import {
	confirmEtherTransaction,
	IEthTxConfirmation,
} from '@/services/transaction';

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

interface IConfirmDonation extends IDonateModalProps {
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
		web3Context,
		setDonating,
	} = props;

	const { library } = web3Context;
	const { walletAddress } = project;

	try {
		// Traceable by default if it comes from Trace only
		// Depends on the toggle if it's an IO to Trace project
		// let traceable = project?.fromTrace
		//   ? true
		//   : isTraceable
		//   ? isTraceable
		//   : switchTraceable
		// let traceable = false;

		const toAddress = isAddressENS(walletAddress!)
			? await getAddressFromENS(walletAddress!, library)
			: walletAddress;

		const transactionObj = {
			to: toAddress,
			// I CHANGED THIS: IMPORTANT
			// value: ethers.utils.parseEther(subtotal.toString())
			value: amount.toString(),
		};

		const txCallbacks = {
			onTransactionHash: (transactionHash: string) =>
				onTransactionHash({ transactionHash, toAddress, ...props }),
			onReceiptGenerated: (receipt: any) => {
				console.log({ receipt });
				setSuccessDonation({
					transactionHash: receipt?.transactionHash,
					tokenSymbol: token.symbol,
					subtotal: amount,
				});
			},
			onError: showToastError,
		};

		await sendTransaction(
			library,
			transactionObj,
			txCallbacks,
			token.address,
			// traceable,
		);

		// Commented notify, and instead we are using our own service
		// transaction.notify(transactionHash)
	} catch (error: any) {
		setDonating(false);
		captureException(error);
		if (
			error?.data?.code === 'INSUFFICIENT_FUNDS' ||
			error?.data?.code === 'UNPREDICTABLE_GAS_LIMIT'
		) {
			showToastError('Insufficient Funds');
		} else showToastError(error);
	}
};

interface IOnTransactionHash extends IConfirmDonation {
	transactionHash: string;
	toAddress: string;
}

const onTransactionHash = async (props: IOnTransactionHash) => {
	const {
		amount,
		token,
		anonymous,
		setDonationSaved,
		transactionHash,
		project,
		web3Context,
		toAddress,
	} = props;
	const { id: projectId } = project;
	const { account, library, chainId } = web3Context;
	// Save initial txn details to db
	const { donationId, savedDonation, saveDonationErrors } =
		await saveDonation(
			account!,
			toAddress,
			transactionHash,
			chainId!,
			amount,
			token.symbol!,
			Number(projectId),
			token.address!,
			anonymous!,
		);
	console.log('DONATION RESPONSE: ', {
		donationId,
		savedDonation,
		saveDonationErrors,
	});
	setDonationSaved(true);
	// onTransactionHash callback for event emitter
	if (saveDonationErrors?.length > 0) {
		showToastError(saveDonationErrors);
	}
	confirmEtherTransaction(
		transactionHash,
		(res: IEthTxConfirmation) => confirmTxCallback({ res, ...props }),
		0,
		library,
	).then();
	await saveDonationTransaction(transactionHash, donationId);
};

interface IConfirmTxCallback extends IOnTransactionHash {
	res: IEthTxConfirmation;
}

const confirmTxCallback = (props: IConfirmTxCallback) => {
	const {
		res,
		transactionHash,
		setSuccessDonation,
		setInProgress,
		setUnconfirmed,
		amount,
		token,
		givBackEligible,
	} = props;
	try {
		if (!res) return;
		// toast.dismiss()
		if (res?.tooSlow === true) {
			// Tx is being too slow
			// toast.dismiss()
			setSuccessDonation({
				transactionHash,
				tokenSymbol: token.symbol,
				subtotal: amount,
				givBackEligible,
				tooSlow: true,
			});
			setInProgress(true);
		} else if (res?.status) {
			// Tx was successful
			// toast.dismiss()
			setSuccessDonation({
				transactionHash,
				tokenSymbol: token.symbol,
				subtotal: amount,
				givBackEligible,
			});
			setUnconfirmed(false);
		} else {
			// EVM reverted the transaction, it failed
			setSuccessDonation({
				transactionHash,
				tokenSymbol: token.symbol,
				subtotal: amount,
				givBackEligible,
			});
			setUnconfirmed(true);
			if (res?.error) {
				showToastError(res.error);
			} else {
				showToastError(
					"Transaction couldn't be confirmed or it failed",
				);
			}
		}
	} catch (error) {
		showToastError(error);
	}
};
