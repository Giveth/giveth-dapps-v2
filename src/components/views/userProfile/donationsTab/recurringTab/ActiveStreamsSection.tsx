import styled from 'styled-components';
import {
	B,
	H5,
	neutralColors,
	Flex,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import { type FC } from 'react';
import { useIntl } from 'react-intl';
import { StreamRow } from './StreamRow';
import { useProfileDonateTabData } from './ProfileDonateTab.context';
import links from '@/lib/constants/links';

export const ActiveStreamsSection: FC = () => {
	const { tokenStreams } = useProfileDonateTabData();
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
			<H5 weight={900}>
				{formatMessage({
					id: 'label.stream_balances',
				})}
			</H5>
			<Desc>
				{formatMessage({
					id: 'label.active_streams_subheader',
				})}{' '}
				<a
					href={links.SUPERFLUID_DASHBOARD}
					target='_blank'
					rel='noopener noreferrer'
				>
					Superfluid Dashboard
				</a>{' '}
				.
			</Desc>
			<DonationTableContainer>
				<TableHeaderRow>
					<TableHeader>
						<B>
							{formatMessage({
								id: 'label.current_balance',
							})}
						</B>
					</TableHeader>
					<TableHeader>
						<B>
							{formatMessage({
								id: 'label.streaming_at_rate_of',
							})}
						</B>
					</TableHeader>
					<TableHeader>
						<B>
							{formatMessage({
								id: 'label.network',
							})}
						</B>
					</TableHeader>
					<TableHeader>
						<B>
							{formatMessage({
								id: 'label.supporting',
							})}
						</B>
					</TableHeader>
					<TableHeader>
						<B>
							{formatMessage({
								id: 'label.top_up_before',
							})}
						</B>
					</TableHeader>
					<TableHeader>
						<B>
							{formatMessage({
								id: 'label.actions',
							})}
						</B>
					</TableHeader>
				</TableHeaderRow>
				{Object.entries(tokenStreams).map(([key, value]) => (
					<StreamRow key={key} tokenStream={value} />
				))}
			</DonationTableContainer>
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
			: 'auto auto auto auto auto auto'};
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

const Desc = styled(P)`
	padding: 8px;
	border-radius: 8px;
	background: ${neutralColors.gray[200]};
	color: ${neutralColors.gray[800]};
	& > a {
		color: ${brandColors.giv[500]};
		transition: color 0.2s ease-in-out;
		font-weight: 500;
		&:hover {
			color: ${brandColors.giv[700]};
		}
	}
`;
