import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	B,
	brandColors,
	IconExternalLink,
	neutralColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { IDonation, IQFRound } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import {
	smallFormatDate,
	formatTxLink,
	compareAddresses,
	formatUSD,
} from '@/lib/helpers';
import {
	EDirection,
	EDonationStatus,
	EDonationType,
} from '@/apollo/types/gqlEnums';
import ExternalLink from '@/components/ExternalLink';
import SortIcon from '@/components/SortIcon';
import { useAppSelector } from '@/features/hooks';
import DonationStatus from '@/components/badges/DonationStatusBadge';
import {
	RowWrapper,
	TableCell,
	TableHeader,
} from '@/components/styled-components/Table';
import { useProjectContext } from '@/context/project.context';
import NetworkLogo from '@/components/NetworkLogo';
import { networksParams } from '@/helpers/blockchain';
import { UserWithPFPInCell } from '../../../UserWithPFPInCell';

const itemPerPage = 10;

enum EOrderBy {
	TokenAmount = 'TokenAmount',
	UsdAmount = 'UsdAmount',
	CreationDate = 'CreationDate',
}

interface IOrder {
	by: EOrderBy;
	direction: EDirection;
}

interface IProjectDonationTable {
	selectedQF: IQFRound | null;
}

interface PageDonations {
	donations: IDonation[];
	totalCount?: number;
}

const ProjectDonationTable = ({ selectedQF }: IProjectDonationTable) => {
	const [pageDonations, setPageDonations] = useState<PageDonations>();
	const [page, setPage] = useState<number>(0);
	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});
	const { projectData } = useProjectContext();
	const user = useAppSelector(state => state.user.userData);
	const { formatMessage, locale } = useIntl();
	const { id, adminUser } = projectData || {};
	const isAdmin = compareAddresses(
		adminUser?.walletAddress,
		user?.walletAddress,
	);

	const orderChangeHandler = (orderBy: EOrderBy) => {
		if (orderBy === order.by) {
			setOrder({
				by: orderBy,
				direction:
					order.direction === EDirection.ASC
						? EDirection.DESC
						: EDirection.ASC,
			});
		} else {
			setOrder({
				by: orderBy,
				direction: EDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!id) return;
		const fetchProjectDonations = async () => {
			const { data: projectDonations } = await client.query({
				query: FETCH_PROJECT_DONATIONS,
				variables: {
					projectId: parseInt(id),
					qfRoundId:
						selectedQF !== null
							? parseInt(selectedQF.id)
							: undefined,
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: { field: order.by, direction: order.direction },
					status: isAdmin ? null : EDonationStatus.VERIFIED,
				},
			});
			const { donationsByProjectId } = projectDonations;
			if (!!donationsByProjectId?.donations) {
				setPageDonations(donationsByProjectId);
			}
		};
		fetchProjectDonations();
	}, [page, order.by, order.direction, id, isAdmin, selectedQF]);

	//TODO: Show meaningful message when there is no donation
	if (pageDonations?.totalCount === 0) return null;

	return (
		<Wrapper>
			<DonationTableWrapper>
				<DonationTableContainer isAdmin={isAdmin}>
					<TableHeader
						onClick={() =>
							orderChangeHandler(EOrderBy.CreationDate)
						}
					>
						{formatMessage({ id: 'label.donated_at' })}
						<SortIcon order={order} title={EOrderBy.CreationDate} />
					</TableHeader>
					<TableHeader>
						<LeftPadding>
							{formatMessage({ id: 'label.donor' })}
						</LeftPadding>
					</TableHeader>
					{isAdmin && (
						<TableHeader>
							{formatMessage({ id: 'label.status' })}
						</TableHeader>
					)}
					<TableHeader>
						{formatMessage({ id: 'label.network' })}
					</TableHeader>
					<TableHeader
						onClick={() => orderChangeHandler(EOrderBy.TokenAmount)}
					>
						{formatMessage({ id: 'label.amount' })}
						<SortIcon order={order} title={EOrderBy.TokenAmount} />
					</TableHeader>
					<TableHeader
						onClick={() => orderChangeHandler(EOrderBy.UsdAmount)}
					>
						{formatMessage({ id: 'label.usd_value' })}
						<SortIcon order={order} title={EOrderBy.UsdAmount} />
					</TableHeader>
					{pageDonations?.donations?.map(donation => (
						<DonationRowWrapper key={donation.id}>
							<DonationTableCell>
								{smallFormatDate(
									new Date(donation.createdAt),
									locale,
								)}
							</DonationTableCell>
							<DonationTableCell>
								{donation.donationType ===
								EDonationType.POIGNART ? (
									'PoignART'
								) : donation.anonymous ? (
									<LeftPadding>
										{formatMessage({
											id: 'label.anonymous',
										})}
									</LeftPadding>
								) : (
									<UserWithPFPInCell user={donation.user} />
								)}
							</DonationTableCell>
							{isAdmin && (
								<DonationTableCell>
									<DonationStatus status={donation.status} />
								</DonationTableCell>
							)}
							<DonationTableCell>
								<NetworkLogo
									logoSize={24}
									chainId={donation.transactionNetworkId}
								/>
								<NetworkName>
									{
										networksParams[
											donation.transactionNetworkId
										].chainName
									}
								</NetworkName>
							</DonationTableCell>
							<DonationTableCell>
								<B>{donation.amount}</B>
								<Currency>{donation.currency}</Currency>
								{!donation.anonymous && (
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
								)}
							</DonationTableCell>
							<DonationTableCell>
								{donation.valueUsd &&
									'$' + formatUSD(donation.valueUsd)}
							</DonationTableCell>
						</DonationRowWrapper>
					))}
				</DonationTableContainer>
			</DonationTableWrapper>
			<Pagination
				currentPage={page}
				totalCount={pageDonations?.totalCount ?? 0}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
		</Wrapper>
	);
};

const Currency = styled.div`
	color: ${neutralColors.gray[600]};
`;

const LeftPadding = styled.div`
	padding-left: 44px;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const NetworkName = styled.div`
	width: 80px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
`;

const DonationTableWrapper = styled.div`
	display: block;
	overflow-x: auto;
	max-width: calc(100vw - 32px);
`;

const DonationTableContainer = styled.div<{ isAdmin?: boolean }>`
	margin-top: 12px;
	display: grid;
	width: 100%;
	grid-template-columns: ${props =>
		props.isAdmin
			? '1fr 2.2fr 0.8fr 1.25fr 1.4fr 1fr'
			: '1fr 2.2fr 1.1fr 1.1fr 1fr'};
	min-width: 800px;
`;

const DonationRowWrapper = styled(RowWrapper)`
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
	&:hover #pfp-avatar {
		box-shadow: 0px 0.762881px 4.57729px 1.14432px rgba(225, 69, 141, 0.5);
	}
`;

const DonationTableCell = styled(TableCell)`
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

export default ProjectDonationTable;
