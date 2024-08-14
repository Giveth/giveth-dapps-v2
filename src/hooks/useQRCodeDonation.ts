import { useState } from 'react';
import QRCode from 'qrcode';
import { client } from '@/apollo/apolloClient';
import {
	CREATE_DRAFT_DONATION,
	FETCH_DRAFT_DONATION,
	MARK_DRAFT_DONATION_AS_FAILED,
	RENEW_DRAFT_DONATION_EXPIRATION,
} from '@/apollo/gql/gqlDonations';
import { ICreateDraftDonation } from '@/components/views/donate/helpers';
import StorageLabel from '@/lib/localStorage';
import { IDraftDonation } from '@/apollo/types/gqlTypes';
import { useDonateData } from '@/context/donate.context';

export type TQRStatus = 'waiting' | 'failed' | 'success' | 'expired';

export const useQRCodeDonation = () => {
	const { project } = useDonateData();

	const [draftDonation, setDraftDonation] = useState<IDraftDonation | null>(
		null,
	);
	const [status, setStatus] = useState<TQRStatus>('waiting');
	const [loading, setLoading] = useState(false);

	const generateStellarPaymentQRCode = async (
		toWalletAddress: string,
		amount: number,
		memo = '',
	) => {
		const formattedAddress = toWalletAddress.toUpperCase();

		const paymentData = `stellar:${formattedAddress}?amount=${amount}&memo=${memo}`;

		try {
			// Generate the QR code as a data URL
			const qrCodeDataURL = await QRCode.toDataURL(paymentData);
			return qrCodeDataURL;
		} catch (error) {
			console.error('Error generating QR code:', error);
			throw error;
		}
	};

	const createDraftDonation = async (
		payload: ICreateDraftDonation,
	): Promise<void> => {
		try {
			const {
				chainId,
				amount,
				token,
				walletAddress,
				projectId,
				anonymous,
				chainvineReferred,
				useDonationBox,
				relevantDonationTxHash,
				memo,
			} = payload;

			// generate QR code from (toWalletAddress, amount, token, memo)
			const qrCodeDataUrl = await generateStellarPaymentQRCode(
				walletAddress,
				amount,
				memo,
			);

			const {
				data: { createDraftDonation },
			} = await client.mutate({
				mutation: CREATE_DRAFT_DONATION,
				variables: {
					networkId: chainId,
					amount: amount,
					token: token.symbol,
					projectId: projectId,
					toAddress: walletAddress,
					tokenAddress: token.address,
					anonymous: anonymous,
					referrerId: chainvineReferred,
					usingDonationBox: useDonationBox,
					relevantDonationTxHash: relevantDonationTxHash,
					toWalletMemo: memo,
					qrCodeDataUrl,
					isQRDonation: true,
				},
				fetchPolicy: 'no-cache',
			});

			// save draft donation to local storage
			localStorage.setItem(
				StorageLabel.DRAFT_DONATION,
				createDraftDonation,
			);
		} catch (error: any) {
			console.error('Error creating draft donation', error);
		}
	};

	const retrieveDraftDonation = async (): Promise<void> => {
		const statusMap: Record<string, TQRStatus> = {
			pending: 'waiting',
			matched: 'success',
			failed: 'failed',
		};

		try {
			setLoading(true);
			const draftDonationId = localStorage.getItem(
				StorageLabel.DRAFT_DONATION,
			);

			if (!draftDonationId) {
				setDraftDonation(null);
				return setLoading(false);
			}

			const {
				data: { getDraftDonationById },
			} = (await client.query({
				query: FETCH_DRAFT_DONATION,
				variables: { id: Number(draftDonationId) },
				fetchPolicy: 'no-cache',
			})) as { data: { getDraftDonationById: IDraftDonation } };

			setStatus(statusMap[getDraftDonationById.status]);
			setDraftDonation(getDraftDonationById);
			setLoading(false);
		} catch (error: any) {
			console.error('Error retrieving draft donation', error);
			setDraftDonation(null);
			setLoading(false);
		}
	};

	const markDraftDonationAsFailed = async () => {
		try {
			const draftDonationId = localStorage.getItem(
				StorageLabel.DRAFT_DONATION,
			);

			const {
				data: { getDraftDonationById },
			} = await client.query({
				query: FETCH_DRAFT_DONATION,
				variables: { id: Number(draftDonationId) },
				fetchPolicy: 'no-cache',
			});

			if (
				!draftDonationId ||
				!getDraftDonationById ||
				getDraftDonationById.status !== 'pending' ||
				getDraftDonationById.projectId != project.id
			) {
				return;
			}

			await client.mutate({
				mutation: MARK_DRAFT_DONATION_AS_FAILED,
				variables: { id: Number(draftDonationId) },
				fetchPolicy: 'no-cache',
			});

			localStorage.removeItem(StorageLabel.DRAFT_DONATION);
		} catch (error: any) {
			console.error('Error marking draft donation as failed', error);
		}
	};

	const renewExpirationDate = async (
		id: number,
	): Promise<Date | undefined> => {
		try {
			const {
				data: { renewDraftDonationExpirationDate },
			} = await client.mutate({
				mutation: RENEW_DRAFT_DONATION_EXPIRATION,
				variables: {
					id: Number(id),
				},
				fetchPolicy: 'no-cache',
			});
			return renewDraftDonationExpirationDate.expiresAt;
		} catch (error: any) {
			console.error(
				'Error renewing draft donation expiration date',
				error,
			);
			return;
		}
	};

	function startTimer(expiresAt: Date) {
		if (!expiresAt) return;

		const endTime = new Date(expiresAt).getTime();
		const timerElement = document.getElementById('timer');
		let timerInterval: NodeJS.Timeout;

		function updateTimer() {
			const now = new Date().getTime();
			const leftTime = endTime - now;

			const minutes = leftTime > 0 ? Math.floor(leftTime / 60000) : 0;
			const seconds =
				leftTime > 0 ? Math.floor((leftTime % 60000) / 1000) : 0;

			if (!timerElement) return;

			if (leftTime <= 0) {
				clearInterval(timerInterval);
				timerElement.textContent = '00 : 00';
				setStatus('expired');
				return;
			}

			timerElement.textContent = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
		}

		updateTimer();
		timerInterval = setInterval(updateTimer, 1000);

		// Return a function to stop the timer
		return function stopTimer() {
			clearInterval(timerInterval);
		};
	}

	return {
		status,
		loading,
		draftDonation,
		setStatus,
		startTimer,
		renewExpirationDate,
		markDraftDonationAsFailed,
		createDraftDonation,
		retrieveDraftDonation,
	};
};
