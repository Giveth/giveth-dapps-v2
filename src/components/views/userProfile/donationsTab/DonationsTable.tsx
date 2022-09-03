import { FC } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
	B,
	brandColors,
	IconExternalLink,
	IconLink24,
	neutralColors,
} from '@giveth/ui-design-system';

import { formatUSD, smallFormatDate, formatTxLink } from '@/lib/helpers';
import { slugToProjectView } from '@/lib/routeCreators';
import ExternalLink from '@/components/ExternalLink';
import { IWalletDonation } from '@/apollo/types/types';
import {
	EOrderBy,
	IOrder,
} from '@/components/views/userProfile/UserProfile.view';
import SortIcon from '@/components/SortIcon';
import DonationStatus from '@/components/badges/DonationStatusBadge';
import {
	RowWrapper,
	TableCell,
	TableHeader,
} from '@/components/styled-components/Table';

interface DonationTable {
	donations: IWalletDonation[];
	order: IOrder;
	changeOrder: (orderBy: EOrderBy) => void;
	myAccount?: boolean;
}

const DonationTable: FC<DonationTable> = ({
	donations,
	order,
	changeOrder,
	myAccount,
}) => {
	return (
		<DonationTableContainer myAccount={myAccount}>
			<TableHeader onClick={() => changeOrder(EOrderBy.CreationDate)}>
				Donated at
				<SortIcon order={order} title={EOrderBy.CreationDate} />
			</TableHeader>
			<TableHeader>Project</TableHeader>
			{myAccount && <TableHeader>Status</TableHeader>}
			<TableHeader onClick={() => changeOrder(EOrderBy.TokenAmount)}>
				Amount
				<SortIcon order={order} title={EOrderBy.TokenAmount} />
			</TableHeader>
			<TableHeader onClick={() => changeOrder(EOrderBy.UsdAmount)}>
				USD Value
				<SortIcon order={order} title={EOrderBy.UsdAmount} />
			</TableHeader>
			{donations.map(donation => (
				<DonationRowWrapper key={donation.id}>
					<DonationTableCell>
						{smallFormatDate(new Date(donation.createdAt))}
					</DonationTableCell>
					<Link
						href={slugToProjectView(donation.project.slug)}
						passHref
					>
						<ProjectTitleCell>
							<B>{donation.project.title}</B>
							<IconLink24 />
						</ProjectTitleCell>
					</Link>
					{myAccount && (
						<DonationTableCell>
							<DonationStatus status={donation.status} />
						</DonationTableCell>
					)}
					<DonationTableCell>
						<B>{donation.amount}</B>
						<Currency>{donation.currency}</Currency>
						<ExternalLink
							href={formatTxLink(
								donation.transactionNetworkId,
								donation.transactionId,
							)}
						>
							<IconExternalLink
								size={16}
								color={brandColors.pinky[500]}
							/>
						</ExternalLink>
					</DonationTableCell>
					<DonationTableCell>
						{donation.valueUsd &&
							'$' + formatUSD(donation.valueUsd)}
					</DonationTableCell>
				</DonationRowWrapper>
			))}
		</DonationTableContainer>
	);
};

const Currency = styled.div`
	color: ${neutralColors.gray[600]};
`;

const DonationRowWrapper = styled(RowWrapper)`
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
`;

const DonationTableCell = styled(TableCell)<{ bold?: boolean }>`
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	font-weight: ${props => (props.bold ? 500 : 400)};
`;

const DonationTableContainer = styled.div<{ myAccount?: boolean }>`
	display: grid;
	grid-template-columns: ${props =>
		props.myAccount ? '1fr 4fr 1fr 1fr 1fr' : '1fr 4fr 1fr 1fr'};
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

export default DonationTable;
