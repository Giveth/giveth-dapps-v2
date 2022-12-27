import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import {
	B,
	brandColors,
	H6,
	IconExternalLink,
	neutralColors,
} from '@giveth/ui-design-system';

import { useIntl } from 'react-intl';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { IDonation } from '@/apollo/types/types';
import SearchBox from '@/components/SearchBox';
import Pagination from '@/components/Pagination';
import {
	smallFormatDate,
	formatTxLink,
	compareAddresses,
	formatUSD,
} from '@/lib/helpers';
import config from '@/configuration';
import {
	EDirection,
	EDonationStatus,
	EDonationType,
} from '@/apollo/types/gqlEnums';
import ExternalLink from '@/components/ExternalLink';
import SortIcon from '@/components/SortIcon';
import { useAppSelector } from '@/features/hooks';
import DonationStatus from '@/components/badges/DonationStatusBadge';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import useDebounce from '@/hooks/useDebounce';
import {
	RowWrapper,
	TableCell,
	TableHeader,
} from '@/components/styled-components/Table';
import { IconEthereum } from '@/components/Icons/Eth';
import { useProjectContext } from '@/context/project.context';

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
	donations: IDonation[];
	totalDonations?: number;
}

interface PageDonations {
	donations: IDonation[];
	totalCount?: number;
}

const ProjectDonationTable = ({
	donations,
	totalDonations,
}: IProjectDonationTable) => {
	const [pageDonations, setPageDonations] = useState<PageDonations>({
		donations: donations,
		totalCount: totalDonations,
	});
	const [page, setPage] = useState<number>(0);
	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});
	const [activeTab, setActiveTab] = useState<number>(0);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const { projectData } = useProjectContext();
	const user = useAppSelector(state => state.user.userData);
	const { formatMessage, locale } = useIntl();
	const { id, traceCampaignId, adminUser } = projectData || {};
	const isAdmin = compareAddresses(
		adminUser?.walletAddress,
		user?.walletAddress,
	);

	const debouncedSearch = useDebounce(searchTerm, 500);

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
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: { field: order.by, direction: order.direction },
					searchTerm,
					status: isAdmin ? null : EDonationStatus.VERIFIED,
				},
			});
			const { donationsByProjectId } = projectDonations;
			if (!!donationsByProjectId?.donations) {
				setPageDonations(donationsByProjectId);
			}
		};
		fetchProjectDonations();
	}, [page, order.by, order.direction, id, debouncedSearch]);

	useEffect(() => {
		if (page !== 0) setPage(0);
	}, [searchTerm]);

	return (
		<Wrapper>
			<UpperSection>
				<Tabs>
					<Tab
						onClick={() => setActiveTab(0)}
						className={activeTab === 0 ? 'active' : ''}
					>
						{formatMessage({ id: 'label.donations' })}
					</Tab>
					{!!traceCampaignId && (
						<Tab
							onClick={() => setActiveTab(1)}
							className={activeTab === 1 ? 'active' : ''}
						>
							Traces
						</Tab>
					)}
				</Tabs>
				<SearchBox
					onChange={event => setSearchTerm(event)}
					value={searchTerm}
				/>
			</UpperSection>
			{activeTab === 0 && (
				<DonationTableWrapper>
					<DonationTableContainer isAdmin={isAdmin}>
						<TableHeader
							onClick={() =>
								orderChangeHandler(EOrderBy.CreationDate)
							}
						>
							{formatMessage({ id: 'label.donated_at' })}
							<SortIcon
								order={order}
								title={EOrderBy.CreationDate}
							/>
						</TableHeader>
						<TableHeader>
							{formatMessage({ id: 'label.donor' })}
						</TableHeader>
						{isAdmin && (
							<TableHeader>
								{formatMessage({ id: 'label.status' })}
							</TableHeader>
						)}
						<TableHeader>
							{formatMessage({ id: 'label.network' })}
						</TableHeader>
						<TableHeader>Source</TableHeader>
						<TableHeader
							onClick={() =>
								orderChangeHandler(EOrderBy.TokenAmount)
							}
						>
							{formatMessage({ id: 'label.amount' })}
							<SortIcon
								order={order}
								title={EOrderBy.TokenAmount}
							/>
						</TableHeader>
						<TableHeader
							onClick={() =>
								orderChangeHandler(EOrderBy.UsdAmount)
							}
						>
							{formatMessage({ id: 'label.usd_value' })}
							<SortIcon
								order={order}
								title={EOrderBy.UsdAmount}
							/>
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
									EDonationType.POIGNART
										? 'PoignART'
										: donation.anonymous
										? 'Anonymous'
										: donation.user?.name ||
										  donation.user?.firstName}
								</DonationTableCell>

								{isAdmin && (
									<DonationTableCell>
										<DonationStatus
											status={donation.status}
										/>
									</DonationTableCell>
								)}
								<DonationTableCell>
									{donation.transactionNetworkId ===
									config.XDAI_NETWORK_NUMBER ? (
										<>
											<IconGnosisChain size={24} />
											Gnosis
										</>
									) : (
										<>
											<IconEthereum size={24} />
											Ethereum
										</>
									)}
								</DonationTableCell>
								<DonationTableCell>
									{donation?.onramperId ? (
										<Image
											src='/images/powered_by_onramper.png'
											width='95'
											height='30'
											alt={'Powered by OnRamper'}
										/>
									) : (
										'Wallet'
									)}
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
			)}
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

const Wrapper = styled.div`
	margin: 50px 0 32px;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const UpperSection = styled.div`
	display: flex;
	gap: 30px;
	align-items: center;
`;

const Tabs = styled.div`
	display: flex;
	gap: 16px;

	> h6:nth-of-type(2) {
		border-left: 2px solid ${neutralColors.gray[300]};
		padding-left: 16px;
	}
`;

const Tab = styled(H6)`
	font-weight: 400;
	cursor: pointer;

	&.active {
		font-weight: 700;
	}
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
			? '1.25fr 1.25fr 1fr 1.25fr 1fr 1fr 1fr'
			: '1.25fr 1.25fr 1.25fr 1fr 1fr 1fr'};
	min-width: 800px;
`;

const DonationRowWrapper = styled(RowWrapper)`
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
`;

const DonationTableCell = styled(TableCell)`
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

export default ProjectDonationTable;
