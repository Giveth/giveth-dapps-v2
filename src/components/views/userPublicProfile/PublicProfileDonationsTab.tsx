import { client } from '@/apollo/apolloClient';
import { FETCH_USER_DONATIONS } from '@/apollo/gql/gqlUser';
import { IUserDonations } from '@/apollo/types/gqlTypes';
import { IWalletDonation } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { Row } from '@/components/styled-components/Grid';
import { ETheme } from '@/context/general.context';
import { networksParams } from '@/helpers/blockchain';
import { smallFormatDate } from '@/lib/helpers';
import {
	B,
	brandColors,
	IconArrowBottom,
	IconArrowTop,
	IconExternalLink,
	IconLink24,
	IconSort16,
	neutralColors,
	P,
	SublineBold,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	IUserPublicProfileView,
	EOrderBy,
	EDirection,
	IOrder,
} from './UserPublicProfile.view';

const itemPerPage = 10;

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

const PublicProfileDonationsTab: FC<IUserPublicProfileView> = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [donations, setDonations] = useState<IWalletDonation[]>([]);
	const [totalDonations, setTotalDonations] = useState<number>(0);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});

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
		if (!user) return;
		const fetchUserDonations = async () => {
			setLoading(true);
			const { data: userDonations } = await client.query({
				query: FETCH_USER_DONATIONS,
				variables: {
					userId: parseFloat(user.id) || -1,
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: order.by,
					direction: order.direction,
				},
			});
			setLoading(false);
			if (userDonations?.donationsByUserId) {
				const donationsByUserId: IUserDonations =
					userDonations.donationsByUserId;
				setDonations(donationsByUserId.donations);
				setTotalDonations(donationsByUserId.totalCount);
			}
		};
		fetchUserDonations();
	}, [user, page, order.by, order.direction]);

	return (
		<>
			<DonationTableWrapper>
				<DonationTable
					donations={donations}
					order={order}
					orderChangeHandler={orderChangeHandler}
				/>
				{loading && <Loading />}
			</DonationTableWrapper>
			<Pagination
				currentPage={page}
				totalCount={totalDonations}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
		</>
	);
};

export default PublicProfileDonationsTab;

interface DonationTable {
	donations: IWalletDonation[];
	order: IOrder;
	orderChangeHandler: (orderby: EOrderBy) => void;
}
const DonationTable: FC<DonationTable> = ({
	donations,
	order,
	orderChangeHandler,
}) => {
	return (
		<DonationTablecontainer>
			<TabelHeader
				onClick={() => orderChangeHandler(EOrderBy.CreationDate)}
			>
				<B>Donated at</B>
				{injectSortIcon(order, EOrderBy.CreationDate)}
			</TabelHeader>
			<TabelHeader>
				<B>Project</B>
			</TabelHeader>
			<TabelHeader>
				<B>Currency</B>
			</TabelHeader>
			<TabelHeader
				onClick={() => orderChangeHandler(EOrderBy.TokenAmount)}
			>
				<B>Amount</B>
				{injectSortIcon(order, EOrderBy.TokenAmount)}
			</TabelHeader>
			<TabelHeader onClick={() => orderChangeHandler(EOrderBy.UsdAmount)}>
				<B>USD Value</B>
				{injectSortIcon(order, EOrderBy.UsdAmount)}
			</TabelHeader>
			{donations.map((donation, idx) => (
				<RowWrapper key={idx}>
					<TabelCell>
						<P>{smallFormatDate(new Date(donation.createdAt))}</P>
					</TabelCell>
					<Link href={`/project/${donation.project.slug}`} passHref>
						<ProjectTitleCell>
							<B>{donation.project.title}</B>
							<IconLink24 />
						</ProjectTitleCell>
					</Link>
					<TabelCell>
						<CurrencyBadge>{donation.currency}</CurrencyBadge>
					</TabelCell>
					<TabelCell>
						<P>{donation.amount}</P>
						<TransactionLink
							href={
								networksParams[donation.transactionNetworkId]
									? `${
											networksParams[
												donation.transactionNetworkId
											].blockExplorerUrls[0]
									  }/tx/${donation.transactionId}`
									: ''
							}
							target='_blank'
						>
							<IconExternalLink size={16} />
						</TransactionLink>
					</TabelCell>
					<TabelCell>
						<P>{donation.valueUsd?.toFixed(2)}$</P>
					</TabelCell>
				</RowWrapper>
			))}
		</DonationTablecontainer>
	);
};

const DonationTablecontainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 5fr 1fr 1fr 1fr;
`;

const TabelHeader = styled(Row)`
	height: 40px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
	align-items: center;
	${props =>
		props.onClick &&
		`cursor: pointer;
	gap: 8px;
	align-items: center;`}
`;

const TabelCell = styled(Row)`
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	align-items: center;
	gap: 8px;
`;

const ProjectTitleCell = styled(TabelCell)`
	cursor: pointer;
	& > svg {
		display: none;
	}
	&:hover > svg {
		display: block;
	}
`;

const CurrencyBadge = styled(SublineBold)`
	padding: 2px 8px;
	border: 2px solid ${neutralColors.gray[400]};
	border-radius: 50px;
	color: ${neutralColors.gray[700]};
`;

const Loading = styled(Row)`
	position: absolute;
	left: 0;
	right: 0;
	top: 42px;
	bottom: 0;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[800]
			: neutralColors.gray[200]}aa;
`;

const DonationTableWrapper = styled.div`
	position: relative;
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

const TransactionLink = styled.a`
	cursor: pointer;
	color: ${brandColors.pinky[500]};
`;
