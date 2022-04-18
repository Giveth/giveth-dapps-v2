import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import {
	B,
	brandColors,
	H6,
	IconArrowBottom,
	IconArrowTop,
	IconExternalLink,
	IconSort16,
	neutralColors,
	P,
	SublineBold,
} from '@giveth/ui-design-system';

import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { IDonation } from '@/apollo/types/types';
import SearchBox from '@/components/SearchBox';
import { Flex } from '@/components/styled-components/Flex';
import Pagination from '@/components/Pagination';
import { smallFormatDate, formatTxLink } from '@/lib/helpers';
import config from '@/configuration';
import { EDirection, EDonationType } from '@/apollo/types/gqlEnums';
import ExternalLink from '@/components/ExternalLink';

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

const injectSortIcon = (order: IOrder, title: EOrderBy) => {
	return order.by === title ? (
		order.direction === EDirection.DESC ? (
			<IconArrowBottom size={16} />
		) : (
			<IconArrowTop size={16} />
		)
	) : (
		<IconSort16 />
	);
};

interface IProjectDonationTable {
	donations: IDonation[];
	id?: string;
	showTrace: boolean;
	totalDonations?: number;
}

const ProjectDonationTable = ({
	donations,
	id,
	showTrace,
	totalDonations,
}: IProjectDonationTable) => {
	const [pageDonations, setPageDonations] = useState<IDonation[]>(donations);
	const [page, setPage] = useState<number>(0);
	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});
	const [activeTab, setActiveTab] = useState<number>(0);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const orderChangeHandler = (orderby: EOrderBy) => {
		if (orderby === order.by) {
			setOrder({
				by: orderby,
				direction:
					order.direction === EDirection.ASC
						? EDirection.DESC
						: EDirection.ASC,
			});
		} else {
			setOrder({
				by: orderby,
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
				},
			});
			const { donationsByProjectId } = projectDonations;
			if (!!donationsByProjectId?.donations) {
				setPageDonations(donationsByProjectId.donations);
			}
		};
		fetchProjectDonations();
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
					{showTrace && (
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
					<DonationTableContainer>
						<TableHeader
							onClick={() =>
								orderChangeHandler(EOrderBy.CreationDate)
							}
						>
							<B>Donated at</B>
							{injectSortIcon(order, EOrderBy.CreationDate)}
						</TableHeader>
						<TableHeader>
							<B>Donor</B>
						</TableHeader>
						<TableHeader>
							<B>Network</B>
						</TableHeader>
						<TableHeader>
							<B>Currency</B>
						</TableHeader>
						<TableHeader
							onClick={() =>
								orderChangeHandler(EOrderBy.TokenAmount)
							}
						>
							<B>Amount</B>
							{injectSortIcon(order, EOrderBy.TokenAmount)}
						</TableHeader>
						<TableHeader
							onClick={() =>
								orderChangeHandler(EOrderBy.UsdAmount)
							}
						>
							<B>USD Value</B>
							{injectSortIcon(order, EOrderBy.UsdAmount)}
						</TableHeader>
						{pageDonations.map(donation => (
							<RowWrapper key={donation.id}>
								<TableCell>
									<P>
										{smallFormatDate(
											new Date(donation.createdAt),
										)}
									</P>
								</TableCell>
								<TableCell>
									<P>
										{donation.donationType ===
										EDonationType.POIGNART
											? 'PoignART'
											: donation.anonymous
											? 'Anonymous'
											: donation.user?.name ||
											  donation.user?.firstName}
									</P>
								</TableCell>
								<TableCell>
									<P>
										{donation.transactionNetworkId ===
										config.XDAI_NETWORK_NUMBER ? (
											<NetworkCell>
												<Image
													alt='Gnosis chain logo'
													src='/images/currencies/gnosisChain/24.svg'
													height={24}
													width={24}
												/>
												<P>Gnosis</P>
											</NetworkCell>
										) : (
											<NetworkCell>
												<Image
													alt='Ethereum chain logo'
													src='/images/currencies/eth/24.svg'
													height={24}
													width={24}
												/>
												<P>Ethereum</P>
											</NetworkCell>
										)}
									</P>
								</TableCell>
								<TableCell>
									<CurrencyBadge>
										{donation.currency}
									</CurrencyBadge>
								</TableCell>
								<TableCell>
									<P>{donation.amount}</P>
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
								</TableCell>
								<TableCell>
									{donation.valueUsd && (
										<P>{donation.valueUsd.toFixed(2)}$</P>
									)}
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

const DonationTableContainer = styled.div`
	margin-top: 12px;
	display: grid;
	width: 100%;
	grid-template-columns: 1.25fr 2fr 1.25fr 1fr 1fr 1fr;
	min-width: 800px;
`;

const TableHeader = styled(Flex)`
	height: 40px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
	align-items: center;
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

const CurrencyBadge = styled(SublineBold)`
	padding: 2px 8px;
	border: 2px solid ${neutralColors.gray[400]};
	border-radius: 50px;
	color: ${neutralColors.gray[700]};
`;

const NetworkCell = styled.div`
	display: flex;
	gap: 8px;
`;

export default ProjectDonationTable;
