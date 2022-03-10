import { useEffect, useState } from 'react';
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
import { Row } from '@/components/styled-components/Grid';
import Pagination from '@/components/Pagination';
import { networksParams } from '@/helpers/blockchain';
import { smallFormatDate } from '@/lib/helpers';

const itemPerPage = 10;

enum EOrderBy {
	TokenAmount = 'TokenAmount',
	UsdAmount = 'UsdAmount',
	CreationDate = 'CreationDate',
}

enum EDirection {
	DESC = 'DESC',
	ASC = 'ASC',
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
					orderBy: order.by,
					direction: order.direction,
				},
			});
			const { donationsByProjectId } = projectDonations;
			if (!!donationsByProjectId?.donations) {
				setPageDonations(donationsByProjectId.donations);
			}
		};
		fetchProjectDonations();
	}, [page, order.by, order.direction, id]);

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
				{/*TODO Implement search function*/}
				{/*<SearchBox onChange={() => {}} value='' />*/}
			</UpperSection>
			{activeTab === 0 && (
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
						<B>Currency</B>
					</TableHeader>
					<TableHeader
						onClick={() => orderChangeHandler(EOrderBy.TokenAmount)}
					>
						<B>Amount</B>
						{injectSortIcon(order, EOrderBy.TokenAmount)}
					</TableHeader>
					<TableHeader
						onClick={() => orderChangeHandler(EOrderBy.UsdAmount)}
					>
						<B>USD Value</B>
						{injectSortIcon(order, EOrderBy.UsdAmount)}
					</TableHeader>
					{pageDonations.map((donation, idx) => (
						<RowWrapper key={idx}>
							<TableCell>
								<P>
									{smallFormatDate(
										new Date(donation.createdAt),
									)}
								</P>
							</TableCell>
							<TableCell>
								<P>
									{donation.user?.name ||
										donation.user?.firstName}
								</P>
							</TableCell>
							<TableCell>
								<CurrencyBadge>
									{donation.currency}
								</CurrencyBadge>
							</TableCell>
							<TableCell>
								<P>{donation.amount}</P>
								<TransactionLink
									href={
										networksParams[
											donation.transactionNetworkId
										]
											? `${
													networksParams[
														donation
															.transactionNetworkId
													].blockExplorerUrls[0]
											  }/tx/${donation.transactionId}`
											: ''
									}
									target='_blank'
								>
									<IconExternalLink size={16} />
								</TransactionLink>
							</TableCell>
							<TableCell>
								<P>{donation.valueUsd?.toFixed(2)}$</P>
							</TableCell>
						</RowWrapper>
					))}
				</DonationTableContainer>
			)}
			<Pagination
				currentPage={page}
				totalCount={totalDonations || 0}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin: 50px 0px 32px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-width: 750px;
`;

const UpperSection = styled.div`
	display: flex;
	gap: 30px;
	align-items: center;
	max-width: 750px;
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

const DonationTableContainer = styled.div`
	margin-top: 12px;
	display: grid;
	grid-template-columns: 1.25fr 2fr 1fr 1fr 1fr;
	width: 100%;
	max-width: 750px;
`;

const TableHeader = styled(Row)`
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

const TableCell = styled(Row)`
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

const TransactionLink = styled.a`
	cursor: pointer;
	color: ${brandColors.pinky[500]};
`;

export default ProjectDonationTable;
