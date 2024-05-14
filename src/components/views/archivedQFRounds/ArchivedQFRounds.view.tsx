import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, Flex } from '@giveth/ui-design-system';
import { ArchivedQFBanner } from './ArchivedQFBanner';
import { EQFPageStatus, QFHeader } from './QFHeader';
import { client } from '@/apollo/apolloClient';
import { IArchivedQFRound } from '@/apollo/types/types';
import { ArchivedQFRoundsTable } from './ArchivedQFRoundsTable';
import { ArchivedQFRoundsMiddleBanner } from './ArchivedQFRoundsMiddleBanner';
import { FETCH_ARCHIVED_QF_ROUNDS } from '@/apollo/gql/gqlQF';
import { useArchivedQFRounds } from './archivedQfRounds.context';
import { EQFRoundsSortBy } from '@/apollo/types/gqlEnums';

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

export const ArchivedQFRoundsView = () => {
	const [archivedQFRounds, setArchivedQFRounds] = useState<
		IArchivedQFRound[]
	>([]);
	const { orderBy } = useArchivedQFRounds();

	useEffect(() => {
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

		const fetchQFRounds = async () => {
			const {
				data: { qfArchivedRounds },
			} = await client.query({
				query: FETCH_ARCHIVED_QF_ROUNDS,
				fetchPolicy: 'network-only',
				variables: {
					orderBy: {
						field,
						direction,
					},
				},
			});
			setArchivedQFRounds(qfArchivedRounds);
		};
		fetchQFRounds();
	}, [orderBy]);
	return (
		<Wrapper>
			<ArchivedQFBanner />
			<Container>
				<QFHeader status={EQFPageStatus.ARCHIVED} />
				<ArchivedQFRoundsTable
					archivedQFRounds={archivedQFRounds.slice(0, 5)}
				/>
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
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 40px;
`;
