import { useState } from 'react';
import QRCode from 'qrcode';
import { client } from '@/apollo/apolloClient';
import {
	CREATE_DRAFT_DONATION,
	FETCH_DRAFT_DONATION,
	MARK_DRAFT_DONATION_AS_FAILED,
	RENEW_DRAFT_DONATION_EXPIRATION,
	VERIFY_QR_DONATION_TRANSACTION,
} from '@/apollo/gql/gqlDonations';
import { ICreateDraftDonation } from '@/components/views/donate/common/helpers';
import StorageLabel from '@/lib/localStorage';
import { IDraftDonation } from '@/apollo/types/gqlTypes';
import { IProject } from '@/apollo/types/types';

export type TQRStatus = 'waiting' | 'failed' | 'success' | 'expired';

type TDraftDonationsStorage = Record<string, number>;

export const parseDraftDonationsStorage = (
	storedDraftDonations: string | null,
): TDraftDonationsStorage => {
	if (!storedDraftDonations) return {};

	try {
		const parsed = JSON.parse(storedDraftDonations);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return {};
		}

		return Object.entries(parsed).reduce<TDraftDonationsStorage>(
			(drafts, [key, draftId]) => {
				if (typeof draftId === 'number' && Number.isFinite(draftId)) {
					drafts[key] = draftId;
				}
				return drafts;
			},
			{},
		);
	} catch {
		return {};
	}
};

const getDraftDonationStorageKey = (projectId: number, walletAddress: string) =>
	`${projectId}:${walletAddress.toUpperCase()}`;

export const getStoredDraftDonationId = (
	projectId: number,
	walletAddress: string,
): number | undefined => {
	const storedDraftDonations = parseDraftDonationsStorage(
		localStorage.getItem(StorageLabel.DRAFT_DONATIONS),
	);

	return (
		storedDraftDonations[
			getDraftDonationStorageKey(projectId, walletAddress)
		] ??
		storedDraftDonations[walletAddress] ??
		storedDraftDonations[walletAddress.toUpperCase()]
	);
};

export const clearStoredDraftDonationId = (
	projectId: number,
	walletAddress: string,
) => {
	const storedDraftDonations = parseDraftDonationsStorage(
		localStorage.getItem(StorageLabel.DRAFT_DONATIONS),
	);

	delete storedDraftDonations[
		getDraftDonationStorageKey(projectId, walletAddress)
	];
	delete storedDraftDonations[walletAddress];
	delete storedDraftDonations[walletAddress.toUpperCase()];

	localStorage.setItem(
		StorageLabel.DRAFT_DONATIONS,
		JSON.stringify(storedDraftDonations),
	);
};

const storeDraftDonationId = (
	projectId: number,
	walletAddress: string,
	draftDonationId: number,
) => {
	const storedDraftDonations = parseDraftDonationsStorage(
		localStorage.getItem(StorageLabel.DRAFT_DONATIONS),
	);
	storedDraftDonations[getDraftDonationStorageKey(projectId, walletAddress)] =
		draftDonationId;
	localStorage.setItem(
		StorageLabel.DRAFT_DONATIONS,
		JSON.stringify(storedDraftDonations),
	);
};

export const generateStellarPaymentQRCode = async (
	toWalletAddress: string,
	amount: number,
	memo = '',
	draftDonationId?: number,
) => {
	const formattedAddress = toWalletAddress.toUpperCase();

	const paymentData = `stellar:${formattedAddress}?amount=${amount}&memo=${memo || draftDonationId}`;

	try {
		// Generate the QR code as a data URL
		const qrCodeDataURL = await QRCode.toDataURL(paymentData);
		return qrCodeDataURL;
	} catch (error) {
		console.error('Error generating QR code:', error);
		throw error;
	}
};

export const useQRCodeDonation = (project: IProject) => {
	const [draftDonation, setDraftDonation] = useState<IDraftDonation | null>(
		null,
	);
	const [status, setStatus] = useState<TQRStatus>('waiting');
	const [loading, setLoading] = useState(false);

	const createDraftDonation = async (
		payload: ICreateDraftDonation,
	): Promise<number | undefined> => {
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
				qfRoundId,
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
					roundId: qfRoundId,
				},
				fetchPolicy: 'no-cache',
			});

			storeDraftDonationId(projectId, walletAddress, createDraftDonation);
			return createDraftDonation;
		} catch (error: any) {
			console.error('Error creating draft donation', error.message);
			throw error.message;
		}
	};

	const retrieveDraftDonation = async (
		draftDonationId: number,
		options?: { throwOnError?: boolean },
	) => {
		const statusMap: Record<string, TQRStatus> = {
			pending: 'waiting',
			matched: 'success',
			failed: 'failed',
		};

		try {
			setLoading(true);

			if (!draftDonationId) {
				setDraftDonation(null);
				return setLoading(false);
			}

			const {
				data: { getDraftDonationById },
			} = (await client.query({
				query: FETCH_DRAFT_DONATION,
				variables: { id: draftDonationId },
				fetchPolicy: 'no-cache',
			})) as { data: { getDraftDonationById: IDraftDonation | null } };

			if (!getDraftDonationById) {
				setDraftDonation(null);
				setLoading(false);
				return null;
			}

			if (
				getDraftDonationById.expiresAt &&
				new Date(getDraftDonationById.expiresAt) < new Date() &&
				getDraftDonationById.status === 'pending'
			) {
				setStatus('expired');
			} else setStatus(statusMap[getDraftDonationById.status]);

			setDraftDonation(getDraftDonationById);
			setLoading(false);
			return getDraftDonationById;
		} catch (error: any) {
			console.error('Error retrieving draft donation', error);
			setDraftDonation(null);
			setLoading(false);
			if (options?.throwOnError) throw error;
			return;
		}
	};

	const checkDraftDonationStatus = async (draftDonationId: number) => {
		if (!draftDonationId) return;

		const {
			data: { verifyQRDonationTransaction },
		} = await client.query({
			query: VERIFY_QR_DONATION_TRANSACTION,
			variables: { id: draftDonationId },
			fetchPolicy: 'no-cache',
		});

		if (!verifyQRDonationTransaction) return;

		return verifyQRDonationTransaction;
	};

	const markDraftDonationAsFailed = async (draftDonationId: number) => {
		try {
			if (!draftDonationId) return;

			const {
				data: { getDraftDonationById },
			} = await client.query({
				query: FETCH_DRAFT_DONATION,
				variables: { id: Number(draftDonationId) },
				fetchPolicy: 'no-cache',
			});

			if (
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
		} catch (error: any) {
			console.error('Error marking draft donation as failed', error);
		}
	};

	const renewExpirationDate = async (
		id: number,
	): Promise<string | undefined> => {
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

			const expiresAt = renewDraftDonationExpirationDate?.expiresAt;
			if (!expiresAt) return;

			const parsedExpirationDate = new Date(expiresAt);
			if (Number.isNaN(parsedExpirationDate.getTime())) return;

			return parsedExpirationDate.toISOString();
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

		async function updateTimer() {
			const now = new Date().getTime();
			const leftTime = endTime - now;

			const minutes = leftTime > 0 ? Math.floor(leftTime / 60000) : 0;
			const seconds =
				leftTime > 0 ? Math.floor((leftTime % 60000) / 1000) : 0;

			if (!timerElement) return;

			if (['success', 'expired', 'failed'].includes(status)) {
				clearInterval(timerInterval);
				timerElement.textContent = '00 : 00';
				return;
			}

			if (leftTime <= 0) {
				clearInterval(timerInterval);
				timerElement.textContent = '00 : 00';

				if (draftDonation?.id) {
					const retDraftDonation = await checkDraftDonationStatus(
						Number(draftDonation.id),
					);
					if (retDraftDonation?.status === 'matched') {
						setDraftDonation(retDraftDonation);
						setStatus('success');
						return;
					} else {
						await markDraftDonationAsFailed(draftDonation?.id!);
						setStatus('failed');
						return;
					}
				}
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
		setDraftDonation,
		renewExpirationDate,
		createDraftDonation,
		retrieveDraftDonation,
		checkDraftDonationStatus,
		markDraftDonationAsFailed,
	};
};
