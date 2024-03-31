import { FC } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
	B,
	brandColors,
	IconLink24,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { formatUnits } from 'viem';
import { smallFormatDate } from '@/lib/helpers';
import { slugToProjectView } from '@/lib/routeCreators';
import {
	RowWrapper,
	TableCell,
	TableHeader,
} from '@/components/styled-components/Table';
import { ERecurringDonationSortField, IOrder } from './ActiveProjectsSection';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import NetworkLogo from '@/components/NetworkLogo';
import SortIcon from '@/components/SortIcon';
import { limitFraction } from '@/helpers/number';
import { StreamActionButton } from './StreamActionButton';
import RecurringDonationStatusBadge from '@/components/badges/RecurringDonationStatusBadge';

interface RecurringDonationTable {
	donations: IWalletRecurringDonation[];
	order: IOrder;
	changeOrder: (orderBy: ERecurringDonationSortField) => void;
	myAccount?: boolean;
	refetch: () => void;
}

const RecurringDonationTable: FC<RecurringDonationTable> = ({
	donations,
	order,
	changeOrder,
	myAccount,
	refetch,
}) => {
	const { formatMessage, locale } = useIntl();

	return (
		<DonationTableContainer $myAccount={myAccount}>
			<TableHeader
				onClick={() =>
					changeOrder(ERecurringDonationSortField.createdAt)
				}
			>
				{formatMessage({ id: 'label.donating_since' })}
				<SortIcon
					order={order}
					title={ERecurringDonationSortField.createdAt}
				/>
			</TableHeader>
			<TableHeader>{formatMessage({ id: 'label.project' })}</TableHeader>
			<TableHeader>{formatMessage({ id: 'label.network' })}</TableHeader>
			<TableHeader
				onClick={() =>
					changeOrder(ERecurringDonationSortField.flowRate)
				}
			>
				{formatMessage({ id: 'label.amount' })}
				<SortIcon
					order={order}
					title={ERecurringDonationSortField.flowRate}
				/>
			</TableHeader>
			<TableHeader>
				{formatMessage({ id: 'label.total_donated' })}
			</TableHeader>

			{myAccount && (
				<>
					<TableHeader>
						{formatMessage({ id: 'label.status' })}
					</TableHeader>
					<TableHeader>
						{formatMessage({ id: 'label.actions' })}
					</TableHeader>
				</>
			)}

			{donations.map(donation => (
				<DonationRowWrapper key={donation.id}>
					<DonationTableCell>
						{smallFormatDate(new Date(donation.createdAt), locale)}
					</DonationTableCell>
					<Link href={slugToProjectView(donation.project.slug)}>
						<ProjectTitleCell>
							<B>{donation.project.title}</B>
							<IconLink24 />
						</ProjectTitleCell>
					</Link>
					<DonationTableCell>
						<NetworkLogo
							chainId={donation.networkId}
							logoSize={32}
						/>
					</DonationTableCell>
					<DonationTableCell>
						<B>
							{limitFraction(
								formatUnits(
									BigInt(donation.flowRate) *
										ONE_MONTH_SECONDS,
									18,
								),
							)}
						</B>
						<Currency>{donation.currency} /mo</Currency>
					</DonationTableCell>
					<DonationTableCell>
						{donation.totalDonated || 0}
						<Currency>{donation.currency}</Currency>
					</DonationTableCell>
					{myAccount && (
						<>
							<DonationTableCell>
								<RecurringDonationStatusBadge
									status={donation.status}
									isArchived={donation.isArchived}
								/>
							</DonationTableCell>
							<DonationTableCell>
								<StreamActionButton
									donation={donation}
									refetch={refetch}
								/>
							</DonationTableCell>
						</>
					)}
				</DonationRowWrapper>
			))}
		</DonationTableContainer>
	);
};

const Currency = styled(P)`
	color: ${neutralColors.gray[600]};
	white-space: nowrap;
	text-overflow: ellipsis;
`;

const DonationRowWrapper = styled(RowWrapper)`
	&:hover > div,
	&:hover > a {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
`;

const DonationTableCell = styled(TableCell)<{ $bold?: boolean }>`
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	font-weight: ${props => (props.$bold ? 500 : 400)};
`;

const DonationTableContainer = styled.div<{ $myAccount?: boolean }>`
	display: grid;
	grid-template-columns: ${props =>
		props.$myAccount
			? '1.5fr 2fr 1fr 1.7fr 1.2fr 1fr 1fr '
			: '1.5fr 2fr 1.5fr 1fr 1fr '};
	overflow: auto;
	min-width: 900px;
	margin: 0 10px;
`;

const ProjectTitleCell = styled(DonationTableCell)`
	cursor: pointer;
	& > svg {
		display: none;
	}
	&:hover > svg {
		display: block;
	}
`;

export default RecurringDonationTable;
