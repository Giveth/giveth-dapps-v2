import { type FC } from 'react';
import styled from 'styled-components';
import {
	ButtonLink,
	Flex,
	GLink,
	P,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { IArchivedQFRound } from '@/apollo/types/types';
import { formatDate } from '@/lib/helpers';
import { Shadow } from '@/components/styled-components/Shadow';
import Routes from '@/lib/constants/Routes';
import { formatDonation } from '@/helpers/number';

interface ArchivedQFRoundsTableProps {
	archivedQFRounds: IArchivedQFRound[];
}

export const ArchivedQFRoundsTable: FC<ArchivedQFRoundsTableProps> = ({
	archivedQFRounds,
}) => {
	return (
		<Wrapper>
			<Table>
				<TH>
					<StyledGLink size='Big'>Funding Round</StyledGLink>
					<StyledGLink size='Big'>Matching Pool</StyledGLink>
					<StyledGLink size='Big'>Donations (USD value)</StyledGLink>
					<StyledGLink size='Big'>Unique Donors</StyledGLink>
					<StyledGLink size='Big'>Round Duration</StyledGLink>
					<StyledGLink size='Big'></StyledGLink>
				</TH>
				{archivedQFRounds.map(round => (
					<TR key={round.id}>
						<P>{round.name}</P>
						<P>
							<Flex gap='1px'>
								{!round.allocatedTokenSymbol && <span>$</span>}
								<span>{round.allocatedFund}</span>
								{round.allocatedTokenSymbol && (
									<span>{round.allocatedTokenSymbol}</span>
								)}
							</Flex>
						</P>
						<P>{formatDonation(round.totalDonations, '$') || 0}</P>
						<P>
							{round.isDataAnalysisDone ? (
								round.uniqueDonors
							) : (
								<AnalysisStatus>Pending</AnalysisStatus>
							)}
						</P>
						<Flex $flexDirection='column'>
							<P>{formatDate(new Date(round.beginDate))}</P>
							<P>{formatDate(new Date(round.endDate))}</P>
						</Flex>
						<P>
							<Link href={Routes.QFArchived + '/' + round.slug}>
								<SeeProjectsLink
									label='see projects'
									linkType='texty-gray'
									size='small'
								/>
							</Link>
						</P>
					</TR>
				))}
			</Table>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	overflow-x: auto;
`;

const Table = styled.div`
	display: grid;
	grid-template-columns: 2fr 1fr 1.5fr 1fr 1.5fr 140px;
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
		border-radius: 16px 0 0 16px;
	}
	& > span {
		padding: 16px;
		background-color: ${neutralColors.gray[200]};
		margin-bottom: 16px;
	}
	& > span:last-child {
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
		padding: 16px;
		border-bottom: 1px solid ${neutralColors.gray[300]};
		margin-bottom: 16px;
	}
	& > div:last-child {
		padding-right: 16px;
		padding-top: 8px;
	}
	&:hover {
		& > div {
			background-color: ${neutralColors.gray[200]};
		}
	}
`;

const SeeProjectsLink = styled(ButtonLink)`
	padding: 8px 16px;
	box-shadow: ${Shadow.Neutral[500]};
	display: inline-block;
`;

const StyledGLink = styled(GLink)`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

const AnalysisStatus = styled(P)`
	color: ${neutralColors.gray[600]};
`;
