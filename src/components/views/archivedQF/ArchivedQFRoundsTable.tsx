import { type FC } from 'react';
import styled from 'styled-components';
import {
	GLink,
	P,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { IArchivedQFRound } from '@/apollo/types/types';
import { formatDate } from '@/lib/helpers';

interface ArchivedQFRoundsTableProps {
	archivedQFRounds: IArchivedQFRound[];
}

export const ArchivedQFRoundsTable: FC<ArchivedQFRoundsTableProps> = ({
	archivedQFRounds,
}) => {
	return (
		<Table>
			<TH>
				<GLink size='Big'>Funding Round</GLink>
				<GLink size='Big'>Matching Pool</GLink>
				<GLink size='Big'>Total Donations</GLink>
				<GLink size='Big'>Unique Donors</GLink>
				<GLink size='Big'>Round started</GLink>
				<GLink size='Big'>Round Ended</GLink>
				<GLink size='Big'></GLink>
			</TH>
			{archivedQFRounds.map((round, index) => (
				<TR key={round.id}>
					<P>{round.name}</P>
					<P>{round.matchingFund}</P>
					<P>{round.raisedFundInUsd}</P>
					<P>{round.uniqueDonors}</P>
					<P>{formatDate(new Date(round.beginDate))}</P>
					<P>{formatDate(new Date(round.endDate))}</P>
					<P></P>
				</TR>
			))}
		</Table>
	);
};

const Table = styled.div`
	display: grid;
	grid-template-columns: 2fr 1fr 1fr 1fr 2fr 2fr 120px;
	overflow: auto;
	min-width: 900px;
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	${mediaQueries.laptopS} {
		min-width: 1000px;
	}
`;

const TH = styled.div`
	display: contents;
	& > span:first-child {
		padding-left: 16px;
		border-radius: 16px 0 0 16px;
	}
	& > span {
		padding: 16px 0;
		background-color: ${neutralColors.gray[200]};
		margin-bottom: 16px;
	}
	& > span:last-child {
		padding-right: 16px;
		border-radius: 0 16px 16px 0;
	}
`;

const TR = styled.div`
	display: contents;
	& > div:first-child {
		font-weight: 700;
		padding-left: 8px;
	}
	& > div {
		padding: 16px 0;
		border-bottom: 1px solid ${neutralColors.gray[300]};
		margin-bottom: 16px;
	}
	& > div:last-child {
		padding-right: 16px;
	}
	&:hover {
		& > div {
			background-color: ${neutralColors.gray[200]};
		}
	}
`;
