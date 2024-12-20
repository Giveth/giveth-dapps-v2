import React, { useEffect, useState, useCallback } from 'react';
import { Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import DonationStatusSection from '@/components/views/transaction/DonationStatusSection';
import QRDetailsSection from '@/components/views/transaction/QRDetailsSection';
import ErrorsIndex from '../Errors/ErrorsIndex';
import { WrappedSpinner } from '@/components/Spinner';
import { IDraftDonation } from '@/apollo/types/gqlTypes';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_DONATION_BY_ID,
	FETCH_DRAFT_DONATION,
} from '@/apollo/gql/gqlDonations';
import { FETCH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import { formatBalance } from '@/lib/helpers';
import config from '@/configuration';
import { ChainType } from '@/types/config';
import { fetchPriceWithCoingeckoId } from '@/services/token';

export type TQRStatus = 'pending' | 'failed' | 'successful';

const TransactionView = () => {
	const router = useRouter();
	const { id } = router.query;

	const [status, setStatus] = useState<TQRStatus>('pending');
	const [draftDonationData, setDraftDonationData] =
		useState<IDraftDonation | null>(null);
	const [donationData, setDonationData] = useState<any>(null);
	const [usdAmount, setUsdAmount] = useState<string>('0.00');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const calculateUsdAmount = useCallback(
		(tokenPrice?: number, amount?: number): string => {
			if (!tokenPrice || !amount) return '0.00';
			return formatBalance(amount * tokenPrice);
		},
		[],
	);

	const fetchTokenPrice = useCallback(async () => {
		const coingeckoChainId =
			config.NETWORKS_CONFIG[ChainType.STELLAR].coingeckoChainName;
		const price = await fetchPriceWithCoingeckoId(coingeckoChainId);
		return price;
	}, []);

	const fetchDraftDonation = useCallback(async () => {
		setIsLoading(true);
		if (!id) return setDraftDonationData(null);

		try {
			const {
				data: { getDraftDonationById },
			} = await client.query({
				query: FETCH_DRAFT_DONATION,
				variables: { id: Number(id) },
				fetchPolicy: 'no-cache',
			});

			const statusMap: Record<string, TQRStatus> = {
				pending: 'pending',
				matched: 'successful',
				failed: 'failed',
			};
			setStatus(statusMap[getDraftDonationById.status]);
			setDraftDonationData(getDraftDonationById);

			if (getDraftDonationById.projectId) {
				const {
					data: { projectById },
				} = await client.query({
					query: FETCH_PROJECT_BY_ID,
					variables: { id: getDraftDonationById.projectId },
				});
				getDraftDonationById.project = projectById;
			}

			const tokensPrice = await fetchTokenPrice();
			if (getDraftDonationById.status === 'matched') {
				const {
					data: { getDonationById: donationById },
				} = await client.query({
					query: FETCH_DONATION_BY_ID,
					variables: {
						id: Number(getDraftDonationById.matchedDonationId),
					},
					fetchPolicy: 'no-cache',
				});
				setDonationData(donationById);
				setUsdAmount(formatBalance(donationById.valueUsd));
			} else {
				setUsdAmount(
					calculateUsdAmount(
						tokensPrice,
						getDraftDonationById.amount,
					),
				);
			}

			setIsLoading(false);
		} catch (error) {
			console.error('Error retrieving draft donation', error);
			setDraftDonationData(null);
			setIsLoading(false);
		}
	}, [id, calculateUsdAmount, fetchTokenPrice]);

	useEffect(() => {
		if (!id) return;

		const eventSource = new EventSource(
			`${process.env.NEXT_PUBLIC_BASE_ROUTE_test}/events`,
		);

		eventSource.onmessage = (event: MessageEvent) => {
			const { data, type } = JSON.parse(event.data);
			if (data.draftDonationId === Number(id)) {
				if (type === 'new-donation') {
					fetchDraftDonation();
				} else if (type === 'draft-donation-failed') {
					setStatus('failed');
				}
			}
		};

		fetchDraftDonation();

		return () => {
			eventSource.close();
		};
	}, [id, fetchDraftDonation]);

	if (isLoading) return <WrappedSpinner />;
	if (!draftDonationData) return <ErrorsIndex statusCode='404' />;

	return (
		<Container>
			<DonationStatusSection
				status={status}
				draftDonationData={draftDonationData}
				donationData={donationData}
				usdAmount={usdAmount}
				setStatus={setStatus}
			/>
			{status === 'pending' && (
				<QRDetailsSection
					draftDonationData={draftDonationData}
					usdAmount={usdAmount}
					status={status}
				/>
			)}
		</Container>
	);
};

const Container = styled(Flex)`
	margin-block: 40px;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
`;

export default TransactionView;
