import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	B,
	brandColors,
	neutralColors,
	Flex,
	FlexCenter,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { formatUnits } from 'viem';
import { client } from '@/apollo/apolloClient';
import { IAdminUser, IDonation } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { smallFormatDate } from '@/lib/helpers';
import { EDirection } from '@/apollo/types/gqlEnums';
import SortIcon from '@/components/SortIcon';
import {
	RowWrapper,
	TableCell,
	TableHeader,
} from '@/components/styled-components/Table';
import { useProjectContext } from '@/context/project.context';
import { UserWithPFPInCell } from '../../../UserWithPFPInCell';
import { formatDonation } from '@/helpers/number';
import { Spinner } from '@/components/Spinner';
import { NoDonation } from './NoDonation';
import { FETCH_RECURRING_DONATIONS_BY_PROJECTID } from '@/apollo/gql/gqlProjects';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';

const itemPerPage = 10;

export enum RecurringDonationSortField {
	createdAt = 'createdAt',
	flowRate = 'flowRate',
}

interface IOrder {
	by: RecurringDonationSortField;
	direction: EDirection;
}

interface IPageRecurringDonations {
	donations: IDonation[];
	totalCount?: number;
}

interface IRecurringDonationsResponse {
	recurringDonations: IRecurringDonation[];
	totalCount: number;
}

interface IRecurringDonation {
	id: string;
	txHash: string;
	networkId: number;
	currency: string;
	anonymous: boolean;
	status: string;
	amountStreamed: number;
	totalUsdStreamed: number;
	flowRate: string;
	donor: IAdminUser;
	createdAt: string;
}

const ProjectRecurringDonationTable = () => {
	const [loading, setLoading] = useState(true);
	const [pageRecurringDonations, setPageRecurringDonations] =
		useState<IRecurringDonationsResponse>();
	const [page, setPage] = useState<number>(0);
	const [order, setOrder] = useState<IOrder>({
		by: RecurringDonationSortField.createdAt,
		direction: EDirection.DESC,
	});
	const { projectData } = useProjectContext();

	const { formatMessage, locale } = useIntl();
	const { id } = projectData || {};

	const orderChangeHandler = (orderBy: RecurringDonationSortField) => {
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
		setLoading(true);
	}, []);

	useEffect(() => {
		if (!id) return;
		const fetchProjectRecurringDonations = async () => {
			const { data: projectRecurringDonations } = await client.query({
				query: FETCH_RECURRING_DONATIONS_BY_PROJECTID,
				variables: {
					projectId: parseInt(id),
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: { field: order.by, direction: order.direction },
				},
			});
			console.log(
				'projectRecurringDonations',
				projectRecurringDonations.recurringDonationsByProjectId,
			);
			setLoading(false);
			const { recurringDonationsByProjectId } = projectRecurringDonations;
			if (!!recurringDonationsByProjectId) {
				setPageRecurringDonations(recurringDonationsByProjectId);
			}
		};
		fetchProjectRecurringDonations();
	}, [page, order.by, order.direction, id]);

	if (loading)
		return (
			<LoadingWrapper>
				<Spinner />
			</LoadingWrapper>
		);

	//TODO: Show meaningful message when there is no donation
	if (pageRecurringDonations?.totalCount === 0)
		return <NoDonation selectedQF={null} />;

	return (
		<Wrapper>
			<DonationTableWrapper>
				<DonationTableContainer>
					<TableHeader
						onClick={() =>
							orderChangeHandler(
								RecurringDonationSortField.createdAt,
							)
						}
					>
						{formatMessage({ id: 'label.donated_at' })}
						<SortIcon
							order={order}
							title={RecurringDonationSortField.createdAt}
						/>
					</TableHeader>
					<TableHeader>
						<LeftPadding>
							{formatMessage({ id: 'label.donor' })}
						</LeftPadding>
					</TableHeader>

					{/* <TableHeader>
						{formatMessage({ id: 'label.network' })}
					</TableHeader> */}
					<TableHeader
					// onClick={() => orderChangeHandler(EOrderBy.TokenAmount)}
					>
						{formatMessage({ id: 'label.amount' })}
						{/* <SortIcon order={order} title={EOrderBy.TokenAmount} /> */}
					</TableHeader>
					<TableHeader
					// onClick={() => orderChangeHandler(EOrderBy.UsdAmount)}
					>
						Total Donated
						{/* <SortIcon order={order} title={EOrderBy.UsdAmount} /> */}
					</TableHeader>
					<TableHeader
					// onClick={() => orderChangeHandler(EOrderBy.UsdAmount)}
					>
						{formatMessage({ id: 'label.usd_value' })}
						{/* <SortIcon order={order} title={EOrderBy.UsdAmount} /> */}
					</TableHeader>
					{pageRecurringDonations?.recurringDonations?.map(
						donation => (
							<DonationRowWrapper key={donation.id}>
								<DonationTableCell>
									{smallFormatDate(
										new Date(donation.createdAt),
										locale,
									)}
								</DonationTableCell>
								<DonationTableCell>
									{donation.anonymous ? (
										<LeftPadding>
											{formatMessage({
												id: 'label.anonymous',
											})}
										</LeftPadding>
									) : (
										<UserWithPFPInCell
											user={donation.donor}
										/>
									)}
								</DonationTableCell>
								{/* <DonationTableCell>
									<NetworkLogo
										logoSize={24}
										chainId={donation.networkId}
										chainType={ChainType.EVM}
									/>
									<NetworkName>
										{getChainName(
											donation.networkId,
											ChainType.EVM,
										)}
									</NetworkName>
								</DonationTableCell> */}
								<DonationTableCell>
									<B>
										{formatDonation(
											formatUnits(
												BigInt(donation.flowRate) *
													ONE_MONTH_SECONDS,
												18,
											),
										)}
									</B>
									<Currency>{donation.currency}</Currency>
									{/* {!donation.anonymous && (
										<ExternalLink
											href={formatTxLink({
												networkId:
													donation.transactionNetworkId,
												txHash: donation.transactionId,
												chainType: donation.chainType,
											})}
										>
											<IconExternalLink
												size={16}
												color={brandColors.pinky[500]}
											/>
										</ExternalLink>
									)} */}
								</DonationTableCell>
								<DonationTableCell>
									{donation.totalUsdStreamed &&
										formatDonation(
											donation.amountStreamed,
											'$',
											locale,
										)}
									<Currency>{donation.currency}</Currency>
								</DonationTableCell>
								<DonationTableCell>
									{donation.totalUsdStreamed &&
										formatDonation(
											donation.totalUsdStreamed,
											'$',
											locale,
										)}
								</DonationTableCell>
							</DonationRowWrapper>
						),
					)}
				</DonationTableContainer>
			</DonationTableWrapper>
			<Pagination
				currentPage={page}
				totalCount={pageRecurringDonations?.totalCount ?? 0}
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

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 16px;
`;

const NetworkName = styled.div`
	width: 80%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
`;

const DonationTableWrapper = styled.div`
	display: block;
	overflow-x: auto;
	max-width: calc(100vw - 32px);
`;

const DonationTableContainer = styled.div<{ $isAdmin?: boolean }>`
	margin-top: 12px;
	display: grid;
	width: 100%;
	grid-template-columns: 1fr 1.2fr 1.1fr 1fr 1fr;
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

const LoadingWrapper = styled(FlexCenter)`
	height: 500px;
`;

export default ProjectRecurringDonationTable;
