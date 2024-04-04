import styled from 'styled-components';
import {
	B,
	H5,
	neutralColors,
	Flex,
	IconInfoOutline24,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import { type FC } from 'react';
import { StreamRow } from './StreamRow';
import { useProfileDonateTabData } from './ProfileDonateTab.context';
import links from '@/lib/constants/links';

export const ActiveStreamsSection: FC = () => {
	const { tokenStreams } = useProfileDonateTabData();
	return (
		<Wrapper>
			<H5 weight={900}>Streamable Token Balances</H5>
			<DonationTableContainer>
				<TableHeaderRow>
					<TableHeader>
						<B>Current Balance</B>
					</TableHeader>
					<TableHeader>
						<B>Streaming at a Rate of</B>
					</TableHeader>
					<TableHeader>
						<B>Supporting</B>
					</TableHeader>
					<TableHeader>
						<B>Top-up before</B>
					</TableHeader>
					<TableHeader>
						<B>Actions</B>
					</TableHeader>
				</TableHeaderRow>
				{Object.entries(tokenStreams).map(([key, value]) => (
					<StreamRow key={key} tokenStream={value} />
				))}
			</DonationTableContainer>
			<StyledHr />
			<Flex gap='8px'>
				<IconInfoOutline24 />
				<Desc>
					We retrieve data from the superfluid app to guarantee the
					precision of your balance, flow rate, and end time. If you
					notice discrepancies such as a higher total flow rate or
					number of projects than what is displayed in the recurring
					donation table, please verify them on the{' '}
					<a
						href={links.SUPERFLUID_DASHBOARD}
						target='_blank'
						rel='noopener noreferrer'
					>
						Superfluid dashboard
					</a>{' '}
					.
				</Desc>
			</Flex>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 12px;
	background-color: ${neutralColors.gray[100]};
	padding: 26px 24px;
	border-radius: 12px;
`;

const DonationTableContainer = styled.div<{ $myAccount?: boolean }>`
	display: grid;
	grid-template-columns: ${props =>
		props.$myAccount
			? '1fr 4fr 1fr 1.5fr 1fr 1fr'
			: 'auto auto auto auto auto'};
	overflow: auto;
`;

const TableHeaderRow = styled.div`
	display: contents;
	& > *:first-child {
		border-radius: 12px 0 0 12px;
	}
	& > *:last-child {
		border-radius: 0 12px 12px 0;
	}
`;

export const TableCell = styled(Flex)`
	align-items: center;
	overflow-x: auto;
	gap: 8px;
	padding: 22px 24px;
`;

const TableHeader = styled(TableCell)`
	background-color: ${neutralColors.gray[200]};
`;

const StyledHr = styled.hr`
	border: none;
	border-top: 1px solid ${neutralColors.gray[300]};
	width: 100%;
	margin: 8px 0;
`;

const Desc = styled(P)`
	color: ${neutralColors.gray[800]};
	& > a {
		color: ${brandColors.giv[500]};
		transition: color 0.2s ease-in-out;
		&:hover {
			color: ${brandColors.giv[700]};
		}
	}
`;
