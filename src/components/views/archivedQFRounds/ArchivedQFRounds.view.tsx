import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, Flex } from '@giveth/ui-design-system';
import { ArchivedQFBanner } from './ArchivedQFBanner';
import { EQFPageStatus, QFHeader } from './QFHeader';
import { client } from '@/apollo/apolloClient';
import { FETCH_QF_ROUNDS } from '@/apollo/gql/gqlQF';
import { IArchivedQFRound } from '@/apollo/types/types';
import { ArchivedQFRoundsTable } from './ArchivedQFRoundsTable';
import { ArchivedQFRoundsMiddleBanner } from './ArchivedQFRoundsMiddleBanner';

export const ArchivedQFRoundsView = () => {
	const [archivedQFRounds, setArchivedQFRounds] = useState<
		IArchivedQFRound[]
	>([]);
	useEffect(() => {
		const fetchQFRounds = async () => {
			const {
				data: { qfRounds },
			} = await client.query({
				query: FETCH_QF_ROUNDS,
				fetchPolicy: 'network-only',
				variables: {},
			});
			setArchivedQFRounds(qfRounds);
		};
		fetchQFRounds();
	}, []);
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
