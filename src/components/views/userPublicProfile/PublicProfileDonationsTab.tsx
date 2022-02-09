import { client } from '@/apollo/apolloClient';
import { FETCH_USER_DONATIONS } from '@/apollo/gql/gqlUser';
import { IUserDonations } from '@/apollo/types/gqlTypes';
import { IWalletDonation } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { smallFormatDate } from '@/lib/helpers';
import { B, P, SublineBold } from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IUserPublicProfileView } from './UserPublicProfile.view';

const itemPerPage = 2;

enum EOrderBy {
	TokenAmount = 'TokenAmount',
	UsdAmount = 'UsdAmount',
	CreationDate = 'CreationDate',
}

enum EDirection {
	DESC = 'DESC',
	ASC = 'ASC',
}

const PublicProfileDonationsTab: FC<IUserPublicProfileView> = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [donations, setDonations] = useState<IWalletDonation[]>([]);
	const [totalDonations, setTotalDonations] = useState<number>(0);
	const [page, setPage] = useState(0);
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
					orderBy: EOrderBy.CreationDate,
					direction: EDirection.ASC,
				},
				fetchPolicy: 'network-only',
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
	}, [user, page]);

	return (
		<>
			{loading && <div>Loading</div>}
			<DonationTable donations={donations} />
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
}
const DonationTable: FC<DonationTable> = ({ donations }) => {
	return (
		<DonationTablecontainer>
			<B>Donated at</B>
			<B>Project</B>
			<B>Currency</B>
			<B>Amount</B>
			{donations.map(donation => (
				<>
					<P>{smallFormatDate(new Date(donation.createdAt))}</P>
					<B>{donation.project.title}</B>
					<SublineBold>{donation.currency}</SublineBold>
					<P>{donation.amount}</P>
				</>
			))}
		</DonationTablecontainer>
	);
};

const DonationTablecontainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 5fr 1fr 1fr;
`;
