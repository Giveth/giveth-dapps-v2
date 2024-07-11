import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
	PublicKey,
	SystemProgram,
	Transaction,
	TransactionResponse,
} from '@solana/web3.js';
import {
	createAssociatedTokenAccountInstruction,
	createTransferInstruction,
	getAssociatedTokenAddress,
	TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { IOnTxHash, saveDonation, updateDonation } from '@/services/donation';
import { ICreateDonation } from '@/components/views/donate/helpers';
import { retryFetchSolanaTransaction } from '@/lib/transaction';
import { ChainType } from '@/types/config';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { postRequest } from '@/helpers/requests';

export const useCreateSolanaDonation = () => {
	const [txHash, setTxHash] = useState<string | undefined>();
	const [donationSaved, setDonationSaved] = useState<boolean>(false);
	const [donationMinted, setDonationMinted] = useState<boolean>(false);
	const [donationId, setDonationId] = useState<number>(0);
	const [resolveState, setResolveState] = useState<(() => void) | null>(null);
	const [createDonationProps, setCreateDonationProps] =
		useState<ICreateDonation>();
	const [transactionObject, setTransactionObject] =
		useState<TransactionResponse | null>(null);
	const { sendNativeToken, walletChainType } = useGeneralWallet();
	const { sendTransaction, publicKey } = useWallet();
	const { connection: solanaConnection } = useConnection();

	const handleSaveDonation = async (
		txHash: string,
		props: ICreateDonation,
	) => {
		let transaction;
		try {
			if (!txHash) {
				return;
			}
			transaction = await retryFetchSolanaTransaction(
				solanaConnection,
				txHash,
			);
			setTransactionObject(transaction?.transactionObj);

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

			if (transaction) {
				donationData = {
					chainId: transaction.chainId! || 0,
					txHash: transaction.hash,
					amount: amount,
					token,
					projectId,
					anonymous,
					nonce: transaction.nonce || 0,
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
			} catch (e: any) {
				await postRequest('/api/donation-backup', true, {
					chainId: transaction?.chainId || 0,
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

	const sendSolanaSPLToken = async (
		to: string,
		value: bigint,
		tokenAddress: string,
	) => {
		if (!publicKey) throw Error('Wallet is not connected');
		const splTokenMintAddress = new PublicKey(tokenAddress);
		const receiverAddress = new PublicKey(to);
		const senderTokenAccountAddress = await getAssociatedTokenAddress(
			splTokenMintAddress,
			publicKey,
		);
		const receiverTokenAccountAddress = await getAssociatedTokenAddress(
			splTokenMintAddress,
			receiverAddress,
		);
		const transaction = new Transaction();
		const receiverAccountInfo = await solanaConnection.getAccountInfo(
			receiverTokenAccountAddress,
		);
		if (!receiverAccountInfo) {
			// In the case where user is new to the token and doesn't have an associated token account
			transaction.add(
				createAssociatedTokenAccountInstruction(
					publicKey,
					receiverTokenAccountAddress,
					receiverAddress,
					splTokenMintAddress,
				),
			);
		}
		transaction.add(
			createTransferInstruction(
				senderTokenAccountAddress,
				receiverTokenAccountAddress,
				publicKey,
				value,
				[],
				TOKEN_PROGRAM_ID,
			),
		);
		return await sendTransaction(transaction, solanaConnection);
	};

	const createDonation = async (props: ICreateDonation) => {
		const {
			walletAddress: toAddress,
			amount,
			token,
			setFailedModalType,
		} = props;
		const { address, chainType } = token;

		if (chainType !== ChainType.SOLANA) {
			throw new Error('Invalid token chain type');
		}

		if (walletChainType !== ChainType.SOLANA) {
			throw new Error('Invalid wallet chain type');
		}

		try {
			// setDonating(true);
			let hash;
			if (address === SystemProgram.programId.toBase58()) {
				hash = await sendNativeToken(toAddress!, amount.toString());
			} else {
				const bigAmount = BigInt(amount * 10 ** token.decimals);
				hash = await sendSolanaSPLToken(toAddress!, bigAmount, address);
			}
			console.log('HERE IS THE hash', hash);
			if (!hash) {
				updateDonation(donationId, EDonationStatus.FAILED);
				return { isSaved: false, txHash: '', isMinted: false };
			}
			setTxHash(hash);
			const id = await handleSaveDonation(hash, props);
			// Wait for the status to become 'success'
			if (!id) {
				return {
					isSaved: false,
					txHash: hash,
					isMinted: transactionObject?.meta?.err === null,
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
		if (transactionObject?.meta?.err === null && txHash) {
			updateDonation(donationId, EDonationStatus.VERIFIED);
			setDonationMinted(true);
			if (resolveState) {
				resolveState();
				setResolveState(null); // clear the state to avoid calling it again
			}
		}
		if (transactionObject?.meta?.err && !txHash) {
			updateDonation(donationId, EDonationStatus.FAILED);
			setDonationSaved(false);
			createDonationProps?.setFailedModalType(EDonationFailedType.FAILED);
		}
	}, [donationId]);

	return {
		txHash,
		donationSaved,
		createDonation,
		donationMinted,
	};
};
