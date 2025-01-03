import { FC } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
	B,
	brandColors,
	IconLink24,
	neutralColors,
	P,
	semanticColors,
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
import {
	ERecurringDonationStatus,
	IWalletRecurringDonation,
} from '@/apollo/types/types';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import NetworkLogo from '@/components/NetworkLogo';
import SortIcon from '@/components/SortIcon';
import { formatDonation, limitFraction } from '@/helpers/number';
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
			<TableHeader>
				{formatMessage({ id: 'label.usd_value' })}
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
						<NetworkLogoWrapper>
							<NetworkLogo
								chainId={donation.networkId}
								logoSize={32}
							/>
						</NetworkLogoWrapper>
					</DonationTableCell>
					{!myAccount &&
					donation.status === ERecurringDonationStatus.ENDED ? (
						<DonationTableCell>
							<B>
								{formatMessage({
									id: 'label.donation_finalized',
								})}
							</B>
						</DonationTableCell>
					) : (
						<DonationTableCell>
							<B color={semanticColors.jade[500]}>
								{formatDonation(
									limitFraction(
										formatUnits(
											BigInt(donation.flowRate) *
												ONE_MONTH_SECONDS,
											18,
										),
									),
									undefined,
									undefined,
									undefined,
									3,
								)}
							</B>
							<Currency>{donation.currency} /mo</Currency>
						</DonationTableCell>
					)}
					<DonationTableCell>
						<B>
							{limitFraction(donation.amountStreamed, 10, true) ||
								0}
						</B>
						<Currency>{donation.currency}</Currency>
					</DonationTableCell>
					<DonationTableCell>
						{formatDonation(donation.totalUsdStreamed, '$') || 0}
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
									recurringNetworkId={donation.networkId}
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

const NetworkLogoWrapper = styled.div`
	margin-left: 5px;
`;

const DonationTableContainer = styled.div<{ $myAccount?: boolean }>`
	display: grid;
	grid-template-columns: ${props =>
		props.$myAccount
			? '1.2fr 2fr 0.6fr 1.3fr 1.5fr 1fr 0.5fr 0.6fr'
			: '1fr 2fr .5fr 1fr 1fr 1fr'};
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
