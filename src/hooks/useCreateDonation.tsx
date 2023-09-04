import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { fetchTransaction, fetchEnsAddress } from '@wagmi/core';
import { useWaitForTransaction } from 'wagmi';
import { sendTransaction } from '@/lib/helpers';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { isAddressENS } from '@/lib/wallet';
import { IOnTxHash, saveDonation, updateDonation } from '@/services/donation';
import { ICreateDonation } from '@/components/views/donate/helpers';

// interface ICreateDonation {
// 	to: `0x${string}`;
// 	value: string;
// 	contractAddress: `0x${string}`;
// 	symbol: string;
// 	projectId: number;
// 	anonymous: boolean;
// 	chainvineReferred: boolean;
// }

export const useCreateDonation = () => {
	const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType | null>(null);
	const [donating, setDonating] = useState<boolean>(false);
	const [donationSaved, setDonationSaved] = useState<boolean>(false);
	const [donationId, setDonationId] = useState<number>(0);
	const { isLoading, status } = useWaitForTransaction({
		hash: txHash,
	});
	console.log('isLoading', isLoading, txHash, status);
	const handleSaveDonation = async (
		txHash: `0x${string}`,
		props: ICreateDonation,
	) => {
		setTxHash(txHash);
		const transaction = await fetchTransaction({ hash: txHash });
		const {
			anonymous,
			projectId,
			chainvineReferred,
			amount,
			token,
			contractAddress,
		} = props;

		const donationData: IOnTxHash = {
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
			contractAddress,
		};

		try {
			const donationId = await saveDonation({ ...donationData });
			setDonationId(donationId);
			setDonationSaved(true);
			setIsSaved(donationId > 0);
			return donationId;
		} catch {
			setFailedModalType(EDonationFailedType.NOT_SAVED);
			setDonating(false);
		}
	};

	const handleError = (error: any, donationId: number) => {
		const localTxHash = error.replacement?.hash || error.transactionHash;
		setTxHash(localTxHash);

		if (error.replacement && error.cancelled) {
			setFailedModalType(EDonationFailedType.CANCELLED);
		} else if (
			error.reason === 'transaction failed' ||
			error.code === 'ACTION_REJECTED'
		) {
			setFailedModalType(EDonationFailedType.FAILED);
		} else {
			setFailedModalType(EDonationFailedType.REJECTED);
		}

		setDonating(false);
		setDonationSaved(false);
		updateDonation(donationId, EDonationStatus.FAILED);
		captureException(error, { tags: { section: 'confirmDonation' } });
	};

	const createDonation = async (props: ICreateDonation) => {
		const { walletAddress, amount, token } = props;
		const { address } = token;

		const toAddress = isAddressENS(walletAddress!)
			? await fetchEnsAddress({ name: walletAddress })
			: walletAddress;

		const transactionObj = {
			to: toAddress! as `0x${string}`,
			value: amount.toString(),
		};

		try {
			const hash = await sendTransaction(transactionObj, address);
			if (!hash) return { isSaved: false, txHash: '', isMinted: false };
			const donationId = await handleSaveDonation(hash, props);
			if (!donationId)
				return {
					isSaved: false,
					txHash: hash,
					isMinted: status === 'success',
				};
			return {
				isSaved: donationId > 0,
				txHash: hash,
			};
		} catch (error: any) {
			handleError(error, 0); // Assuming donationId as 0 for this case
			return { isSaved: false, txHash: '', isMinted: false };
		}
	};

	useEffect(() => {
		if (status === 'success') {
			updateDonation(donationId, EDonationStatus.VERIFIED).then(()=> {
                
            });
		}
	}, [status]);

	return {
		txHash,
		isSaved,
		failedModalType,
		donating,
		donationSaved,
		createDonation,
	};
};
