import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { fetchEnsAddress, fetchTransaction } from '@wagmi/core';
import { useNetwork, useWaitForTransaction } from 'wagmi';

import { sendTransaction } from '@/lib/helpers';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { isAddressENS } from '@/lib/wallet';
import { IOnTxHash, saveDonation, updateDonation } from '@/services/donation';
import { ICreateDonation } from '@/components/views/donate/helpers';
import { getTxFromSafeTxId } from '@/lib/safe';
import { waitForTransaction } from '@/lib/transaction';
import { useIsSafeEnvironment } from './useSafeAutoConnect';

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds

const retryFetchTransaction = async (
	txHash: `0x${string}`,
	retries: number = MAX_RETRIES,
) => {
	for (let i = 0; i < retries; i++) {
		const transaction = await fetchTransaction({
			hash: txHash,
		}).catch(error => {
			console.log(
				'Attempt',
				i,
				'Fetching Transaction Error:',
				error,
				txHash,
			);
			return null;
		});

		if (transaction) return transaction;

		// If not found, wait for the delay time and try again
		await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
	}
	// Return null if the transaction is still not found after all retries
	throw new Error('Transaction not found');
};

export const useCreateDonation = () => {
	const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
	const [donationSaved, setDonationSaved] = useState<boolean>(false);
	const [donationMinted, setDonationMinted] = useState<boolean>(false);
	const [donationId, setDonationId] = useState<number>(0);
	const [resolveState, setResolveState] = useState<(() => void) | null>(null);
	const [createDonationProps, setCreateDonationProps] =
		useState<ICreateDonation>();
	const { chain } = useNetwork();
	const chainId = chain?.id;
	const isSafeEnv = useIsSafeEnvironment();

	const { status } = useWaitForTransaction({
		hash: txHash,
		onReplaced(data) {
			console.log('Transaction Updated', data);
			setTxHash(data.transaction.hash);
			if (data.reason === 'cancelled') {
				console.log('Canceled transaction');
				createDonationProps?.setFailedModalType(
					EDonationFailedType.CANCELLED,
				);
			}
			createDonationProps &&
				handleSaveDonation(data.transaction.hash, createDonationProps);
		},
		async onError(error) {
			// Manage case for multisigs
			const { status } = await waitForTransaction(txHash!, isSafeEnv);
			if (status) {
				// Make it successful if found
				updateDonation(donationId, EDonationStatus.VERIFIED);
				setDonationMinted(true);
				if (resolveState) {
					resolveState();
					setResolveState(null); // clear the state to avoid calling it again
				}
			}
			console.log('Error', error);
		},
	});

	const handleSaveDonation = async (
		txHash: `0x${string}`,
		props: ICreateDonation,
	) => {
		let transaction, safeTransaction;
		try {
			if (!txHash) {
				return;
			}
			transaction = !isSafeEnv
				? await retryFetchTransaction(txHash)
				: null;

			if (!transaction && isSafeEnv) {
				safeTransaction = await getTxFromSafeTxId(txHash, chainId!);
			}

			setTxHash(txHash);
			const {
				anonymous,
				projectId,
				chainvineReferred,
				amount,
				token,
				setFailedModalType,
			} = props;

			let donationData: IOnTxHash;

			if (isSafeEnv && safeTransaction) {
				donationData = {
					chainId: chainId!,
					amount: amount,
					token,
					projectId,
					anonymous,
					chainvineReferred,
					walletAddress: safeTransaction?.safe as `0x${string}`,
					symbol: token.symbol,
					setFailedModalType,
					safeTransactionId: txHash,
				};
			} else if (!isSafeEnv && transaction) {
				donationData = {
					chainId: transaction.chainId!,
					txHash: transaction.hash,
					amount: amount,
					token,
					projectId,
					anonymous,
					nonce: transaction.nonce,
					chainvineReferred,
					walletAddress: transaction.from,
					symbol: token.symbol,
					setFailedModalType,
					safeTransactionId: null,
				};
			} else return;

			console.log({ donationData });
			setCreateDonationProps(donationData);

			try {
				const id = await saveDonation({ ...donationData });
				setDonationId(id);
				setDonationSaved(true);
				return id;
			} catch (e) {
				setFailedModalType(EDonationFailedType.NOT_SAVED);
			}
		} catch (error) {
			console.log('Error sending transaction', { error });
		}
	};

	const handleError = (
		error: any,
		donationId: number,
		setFailedModalType: (type: EDonationFailedType) => void,
	) => {
		console.log('name', error.name);
		const localTxHash = error.replacement?.hash || error.transactionHash;
		setTxHash(localTxHash);

		if (error.name === 'TransactionExecutionError') {
			setFailedModalType(EDonationFailedType.FAILED);
		} else {
			console.log('Rejected1', error);
			setFailedModalType(EDonationFailedType.REJECTED);
		}

		setDonationSaved(false);
		updateDonation(donationId, EDonationStatus.FAILED);
		captureException(error, { tags: { section: 'confirmDonation' } });
	};

	const createDonation = async (props: ICreateDonation) => {
		console.log('Props', props);
		const { walletAddress, amount, token, setFailedModalType } = props;
		const { address } = token;

		const toAddress = isAddressENS(walletAddress!)
			? await fetchEnsAddress({ name: walletAddress })
			: walletAddress;

		const transactionObj = {
			to: toAddress! as `0x${string}`,
			value: amount.toString(),
		};

		try {
			// setDonating(true);
			const hash = await sendTransaction(transactionObj, address).catch(
				error => {
					handleError(error, 0, setFailedModalType);
				},
			);
			console.log('HERE IS THE hash', hash);
			if (!hash) return { isSaved: false, txHash: '', isMinted: false };
			setTxHash(hash);
			const id = await handleSaveDonation(hash, props);
			// Wait for the status to become 'success'
			await new Promise(resolve => {
				if (status === 'success') {
					setResolveState(null);
				} else {
					setResolveState(() => resolve);
				}
			});
			if (!id) {
				return {
					isSaved: false,
					txHash: hash,
					isMinted: status === 'success',
				};
			}
			return {
				isSaved: id > 0,
				txHash: hash,
			};
		} catch (error: any) {
			handleError(error, 0, setFailedModalType); // Assuming donationId as 0 for this case
			return { isSaved: false, txHash: '', isMinted: false };
		}
	};

	useEffect(() => {
		if (status === 'success') {
			updateDonation(donationId, EDonationStatus.VERIFIED);
			setDonationMinted(true);
			if (resolveState) {
				resolveState();
				setResolveState(null); // clear the state to avoid calling it again
			}
		}
		const comingFromSafe = isSafeEnv && txHash;
		if (status === 'error' && !comingFromSafe) {
			updateDonation(donationId, EDonationStatus.FAILED);
			setDonationSaved(false);
			createDonationProps?.setFailedModalType(EDonationFailedType.FAILED);
		}
	}, [status, donationId]);

	return {
		txHash,
		donationSaved,
		createDonation,
		donationMinted,
	};
};
