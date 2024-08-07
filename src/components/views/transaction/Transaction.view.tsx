import React, { useEffect, useState } from 'react';
import { Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import DonationStatusSection from '@/components/views/transaction/DonationStatusSection';
import QRDetailsSection from '@/components/views/transaction/QRDetailsSection';
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
import ErrorsIndex from '../Errors/ErrorsIndex';
import { WrappedSpinner } from '@/components/Spinner';

export type TQRStatus = 'pending' | 'failed' | 'successful';

const TransactionView = () => {
	const router = useRouter();
	const { id } = router.query;

	const [status, setStatus] = useState<TQRStatus>('pending');
	const [draftDonationData, setDraftDonationData] = useState<any>(null);
	const [donationData, setDonationData] = useState<any>(null);
	const [tokenPrice, setTokenPrice] = useState<number | null>(null);
	const [usdAmount, setUsdAmount] = useState<string>('0.00');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const calculateUsdAmount = () => {
		if (!tokenPrice) return '0.00';

		const _tokenPrice = Math.floor(tokenPrice * 100);
		const amountInUsd = (draftDonationData?.amount * _tokenPrice) / 100;

		return formatBalance(amountInUsd);
	};

	const fetchTokenPrice = async () => {
		const coingeckoChainId =
			config.NETWORKS_CONFIG[ChainType.STELLAR].coingeckoChainName;
		const price = await fetchPriceWithCoingeckoId(coingeckoChainId);
		if (price) {
			setTokenPrice(price);
		}
	};

	useEffect(() => {
		const statusMap: Record<string, TQRStatus> = {
			pending: 'pending',
			matched: 'successful',
			failed: 'failed',
		};

		const fetchDraftDonation = async (): Promise<void> => {
			if (!id) return setDraftDonationData(null);

			try {
				const {
					data: { getDraftDonationById },
				} = (await client.query({
					query: FETCH_DRAFT_DONATION,
					variables: { id: Number(id) },
					fetchPolicy: 'no-cache',
				})) as { data: { getDraftDonationById: IDraftDonation } };

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
				}

				await fetchTokenPrice();

				setIsLoading(false);

				setUsdAmount(
					draftDonationData?.status === 'matched'
						? formatBalance(donationData.valueUsd)
						: calculateUsdAmount(),
				);
			} catch (error: any) {
				console.error('Error retrieving draft donation', error);
				setDraftDonationData(null);
				setIsLoading(false);
			}
		};

		fetchDraftDonation();
	}, [id]);

	if (isLoading) {
		return <WrappedSpinner />;
	}

	if (!draftDonationData) {
		return <ErrorsIndex statusCode='404' />;
	}

	return (
		<Container>
			<DonationStatusSection
				status={status}
				draftDonationData={draftDonationData}
				donationData={donationData}
				usdAmount={usdAmount}
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
