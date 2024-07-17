import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { getEnsAddress } from '@wagmi/core';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { sendEvmTransaction } from '@/lib/helpers';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { isAddressENS } from '@/lib/wallet';
import { IOnTxHash, saveDonation, updateDonation } from '@/services/donation';
import { ICreateDonation } from '@/components/views/donate/helpers';
import { getTxFromSafeTxId } from '@/lib/safe';
import { retryFetchEVMTransaction } from '@/lib/transaction';
import { useIsSafeEnvironment } from './useSafeAutoConnect';
import { postRequest } from '@/helpers/requests';
import { wagmiConfig } from '@/wagmiConfigs';
import { client } from '@/apollo/apolloClient';
import { CREATE_DRAFT_DONATION } from '@/apollo/gql/gqlDonations';

export const useCreateEvmDonation = () => {
	const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
	const [donationSaved, setDonationSaved] = useState<boolean>(false);
	const [donationMinted, setDonationMinted] = useState<boolean>(false);
	const [donationId, setDonationId] = useState<number>(0);
	const [resolveState, setResolveState] = useState<(() => void) | null>(null);
	const [createDonationProps, setCreateDonationProps] =
		useState<ICreateDonation>();
	const { chain } = useAccount();
	const chainId = chain?.id;
	const isSafeEnv = useIsSafeEnvironment();

	const { status } = useWaitForTransactionReceipt({
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
		// async onError(error) { //TODO:Migrate
		// 	// Manage case for multisigs
		// 	const { status } = await waitForTransaction(txHash!, isSafeEnv);
		// 	if (status) {
		// 		// Make it successful if found
		// 		updateDonation(donationId, EDonationStatus.VERIFIED);
		// 		setDonationMinted(true);
		// 		if (resolveState) {
		// 			resolveState();
		// 			setResolveState(null); // clear the state to avoid calling it again
		// 		}
		// 	}
		// 	console.log('Error', error);
		// },
	});

	const handleSaveDonation = async (
		txHash: Address,
		props: ICreateDonation,
	) => {
		if (!txHash) return;
		try {
			let transaction, safeTransaction;
			let donationData: IOnTxHash;
			setTxHash(txHash);

			const {
				anonymous,
				projectId,
				chainvineReferred,
				amount,
				token,
				draftDonationId,
				setFailedModalType,
				useDonationBox,
				relevantDonationTxHash,
			} = props;

			if (isSafeEnv) {
				safeTransaction = await getTxFromSafeTxId(txHash, chainId!);
				if (safeTransaction) {
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
						draftDonationId,
						useDonationBox,
						relevantDonationTxHash,
					};
				} else {
					return null;
				}
			} else {
				transaction = await retryFetchEVMTransaction(txHash);
				if (transaction) {
					donationData = {
						chainId: chainId || token.networkId,
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
						draftDonationId,
						useDonationBox,
						relevantDonationTxHash,
					};
				} else {
					return null;
				}
			}

			console.log('donationData', { donationData });
			setCreateDonationProps(donationData);

			try {
				const id = await saveDonation({ ...donationData });
				setDonationId(id);
				setDonationSaved(true);
				return id;
			} catch (e: any) {
				await postRequest('/api/donation-backup', true, {
					chainId: chainId || token.networkId,
					txHash: transaction?.hash,
					amount: amount,
					token,
					projectId,
					anonymous,
					nonce: transaction?.nonce,
					chainvineReferred,
					walletAddress: transaction?.from,
					symbol: token.symbol,
					error: e.message,
					useDonationBox,
					relevantDonationTxHash,
				});
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
			? await getEnsAddress(wagmiConfig, { name: walletAddress })
			: walletAddress;

		const transactionObj = {
			to: toAddress! as Address,
			value: amount.toString(),
		};

		try {
			// setDonating(true);
			//save draft donation
			const { data: draftDonationData } = await client.mutate({
				mutation: CREATE_DRAFT_DONATION,
				variables: {
					networkId: chainId,
					amount: amount,
					token: token.symbol,
					projectId: props.projectId,
					toAddress: toAddress,
					tokenAddress: token.address,
					anonymous: props.anonymous,
					referrerId: props.chainvineReferred,
					usingDonationBox: props.useDonationBox,
					relevantDonationTxHash: props.relevantDonationTxHash,
					// safeTransactionId: safeTransactionId, // Not supported yet
				},
			});
			console.log('draftDonationData', draftDonationData);
			props.draftDonationId = draftDonationData.createDraftDonation;
			const hash = await sendEvmTransaction(
				transactionObj,
				address,
			).catch(error => {
				handleError(error, 0, setFailedModalType);
			});
			console.log('HERE IS THE hash', hash);
			if (!hash) return { isSaved: false, txHash: '', isMinted: false };
			setTxHash(hash);
			const id = await handleSaveDonation(hash!, props);
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
				isSaved: id! > 0,
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
