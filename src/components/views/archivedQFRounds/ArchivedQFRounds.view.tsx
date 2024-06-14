import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, Flex, OutlineButton } from '@giveth/ui-design-system';
import { QFHeader } from './QFHeader';
import { client } from '@/apollo/apolloClient';
import { IArchivedQFRound } from '@/apollo/types/types';
import { ArchivedQFRoundsTable } from './ArchivedQFRoundsTable';
import { ArchivedQFRoundsMiddleBanner } from './ArchivedQFRoundsMiddleBanner';
import { FETCH_ARCHIVED_QF_ROUNDS } from '@/apollo/gql/gqlQF';
import { useArchivedQFRounds } from './archivedQfRounds.context';
import { EQFRoundsSortBy } from '@/apollo/types/gqlEnums';
import { showToastError } from '@/lib/helpers';
import { WrappedSpinner } from '@/components/Spinner';
import { ArchivedQFRoundsSort } from './ArchivedQFRoundsSort';
import { DefaultQFBanner } from '@/components/DefaultQFBanner';

enum EQfArchivedRoundsSort {
	allocatedFund = 'allocatedFund',
	totalDonations = 'totalDonations',
	uniqueDonors = 'uniqueDonors',
	beginDate = 'beginDate',
}

enum EOrderDirection {
	ASC = 'ASC',
	DESC = 'DESC',
}

interface HeaderWrapperProps {
	$gap: string;
	$justifyContent: string;
}

const ITEMS_PER_PAGE = 10;

export const ArchivedQFRoundsView = () => {
	const [archivedQFRounds, setArchivedQFRounds] = useState<
		IArchivedQFRound[]
	>([]);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const { orderBy } = useArchivedQFRounds();

	const fetchQFRounds = useCallback(
		async (isLoadMore: boolean = false, skip: number) => {
			setLoading(true);
			let field = EQfArchivedRoundsSort.beginDate;
			let direction = EOrderDirection.DESC;
			switch (orderBy) {
				case EQFRoundsSortBy.MATCHING_POOL:
					field = EQfArchivedRoundsSort.allocatedFund;
					direction = EOrderDirection.DESC;
					break;
				case EQFRoundsSortBy.UNIQUE_DONORS:
					field = EQfArchivedRoundsSort.uniqueDonors;
					direction = EOrderDirection.DESC;
					break;
				case EQFRoundsSortBy.NEWEST:
					field = EQfArchivedRoundsSort.beginDate;
					direction = EOrderDirection.DESC;
					break;
				case EQFRoundsSortBy.OLDEST:
					field = EQfArchivedRoundsSort.beginDate;
					direction = EOrderDirection.ASC;
					break;
				default:
					break;
			}
			try {
				const {
					data: { qfArchivedRounds },
				} = await client.query({
					query: FETCH_ARCHIVED_QF_ROUNDS,
					fetchPolicy: 'network-only',
					variables: {
						limit: ITEMS_PER_PAGE,
						skip,
						orderBy: {
							field,
							direction,
						},
					},
				});
				if (qfArchivedRounds.length < ITEMS_PER_PAGE) {
					setHasMore(false);
				}
				setArchivedQFRounds(prev => {
					return isLoadMore
						? [...prev, ...qfArchivedRounds]
						: qfArchivedRounds;
				});
			} catch (error) {
				showToastError(error);
			} finally {
				setLoading(false);
			}
		},
		[orderBy],
	);

	useEffect(() => {
		if (loading) return;
		fetchQFRounds(false, 0);
	}, [fetchQFRounds]);

	const loadMore = () => {
		fetchQFRounds(true, archivedQFRounds.length);
	};

	return (
		<Wrapper>
			<DefaultQFBanner />
			<Container>
				<HeaderWrapper $gap='24px' $justifyContent='space-between'>
					<QFHeader />
					<ArchivedQFRoundsSort />
				</HeaderWrapper>

				<ArchivedQFRoundsTable
					archivedQFRounds={archivedQFRounds.slice(0, 5)}
				/>
				{archivedQFRounds.length == 0 && loading && (
					<WrappedSpinner size={100} />
				)}
			</Container>
			<ArchivedQFRoundsMiddleBanner />
			<Container>
				<ArchivedQFRoundsTable
					archivedQFRounds={archivedQFRounds.slice(
						5,
						archivedQFRounds.length,
					)}
				/>
			</Container>
			{archivedQFRounds.length > 0 && loading ? (
				<WrappedSpinner size={100} />
			) : hasMore ? (
				<LoadMoreButton
					buttonType='texty-primary'
					onClick={loadMore}
					label='Load More'
				/>
			) : null}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 40px;
`;

const HeaderWrapper = styled(Flex)<HeaderWrapperProps>`
	margin-bottom: 24px;
	gap: ${props => props.$gap};
`;

const LoadMoreButton = styled(OutlineButton)`
	margin: 20px auto;
`;
