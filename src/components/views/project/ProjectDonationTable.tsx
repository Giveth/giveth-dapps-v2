import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import {
	B,
	brandColors,
	H6,
	IconExternalLink,
	neutralColors,
	P,
} from '@giveth/ui-design-system';

import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { IDonation, IProject } from '@/apollo/types/types';
import SearchBox from '@/components/SearchBox';
import { Flex } from '@/components/styled-components/Flex';
import Pagination from '@/components/Pagination';
import { smallFormatDate, formatTxLink, compareAddresses } from '@/lib/helpers';
import config from '@/configuration';
import {
	EDirection,
	EDonationStatus,
	EDonationType,
} from '@/apollo/types/gqlEnums';
import ExternalLink from '@/components/ExternalLink';
import SortIcon from '@/components/SortIcon';
import ETHIcon from '/public/images/currencies/eth/24.svg';
import GnosisIcon from '/public/images/currencies/gnosisChain/24.svg';
import { useAppSelector } from '@/features/hooks';
import DonationStatus from '@/components/badges/DonationStatusBadge';

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
	project?: IProject;
}

const ProjectDonationTable = ({
	donations,
	totalDonations,
	project,
}: IProjectDonationTable) => {
	const [pageDonations, setPageDonations] = useState<IDonation[]>(donations);
	const [page, setPage] = useState<number>(0);
	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});
	const [activeTab, setActiveTab] = useState<number>(0);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const user = useAppSelector(state => state.user.userData);

	const { id, traceCampaignId, adminUser } = project || {};
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
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: { field: order.by, direction: order.direction },
					searchTerm,
					status: isAdmin ? null : EDonationStatus.VERIFIED,
				},
			});
			const { donationsByProjectId } = projectDonations;
			if (!!donationsByProjectId?.donations) {
				setPageDonations(donationsByProjectId.donations);
			}
		};
		fetchProjectDonations().then();
	}, [page, order.by, order.direction, id, searchTerm]);

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
						Donations
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
							Donated at
							<SortIcon
								order={order}
								title={EOrderBy.CreationDate}
							/>
						</TableHeader>
						<TableHeader>Donor</TableHeader>
						{isAdmin && <TableHeader>Status</TableHeader>}
						<TableHeader>Network</TableHeader>
						<TableHeader
							onClick={() =>
								orderChangeHandler(EOrderBy.TokenAmount)
							}
						>
							Amount
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
							USD Value
							<SortIcon
								order={order}
								title={EOrderBy.UsdAmount}
							/>
						</TableHeader>
						{pageDonations.map(donation => (
							<RowWrapper key={donation.id}>
								<TableCell>
									{smallFormatDate(
										new Date(donation.createdAt),
									)}
								</TableCell>
								<TableCell>
									{donation.donationType ===
									EDonationType.POIGNART
										? 'PoignART'
										: donation.anonymous
										? 'Anonymous'
										: donation.user?.name ||
										  donation.user?.firstName}
								</TableCell>
								{isAdmin && (
									<TableCell>
										<DonationStatus
											status={donation.status}
										/>
									</TableCell>
								)}
								<TableCell>
									<Image
										alt='chain logo'
										src={
											donation.transactionNetworkId ===
											config.XDAI_NETWORK_NUMBER
												? GnosisIcon
												: ETHIcon
										}
										height={24}
										width={24}
									/>
									<P>
										{donation.transactionNetworkId ===
										config.XDAI_NETWORK_NUMBER
											? 'Gnosis'
											: 'Ethereum'}
									</P>
								</TableCell>
								<TableCell>
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
								</TableCell>
								<TableCell>
									{donation.valueUsd &&
										donation.valueUsd.toFixed(2) + ' USD'}
								</TableCell>
							</RowWrapper>
						))}
					</DonationTableContainer>
				</DonationTableWrapper>
			)}
			<Pagination
				currentPage={page}
				totalCount={
					!!searchTerm ? pageDonations.length : totalDonations || 0
				}
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
			? '1.25fr 2fr 1fr 1.25fr 1fr 1fr'
			: '1.25fr 2fr 1.25fr 1fr 1fr'};
	min-width: 800px;
`;

const TableHeader = styled(B)`
	height: 40px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
	align-items: center;
	display: flex;
	${props =>
		props.onClick &&
		`cursor: pointer;
	gap: 8px;
	align-items: center;`}
`;

const RowWrapper = styled.div`
	display: contents;
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
	& > div:first-child {
		padding-left: 4px;
	}
`;

const TableCell = styled(Flex)`
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	align-items: center;
	gap: 8px;
`;

export default ProjectDonationTable;
