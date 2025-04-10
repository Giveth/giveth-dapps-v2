import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { neutralColors } from '@giveth/ui-design-system';
import { client } from '@/apollo/apolloClient';
import { FETCH_USER_DONATIONS } from '@/apollo/gql/gqlUser';
import { EDirection, EDonationStatus } from '@/apollo/types/gqlEnums';
import { IUserDonations } from '@/apollo/types/gqlTypes';
import { IWalletDonation } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import NothingToSee from '@/components/views/userProfile/NothingToSee';
import DonationTable from '@/components/views/userProfile/donationsTab/oneTimeTab/OneTimeDonationsTable';
import { EOrderBy, IOrder } from '../../projectsTab/type';
import { useProfileContext } from '@/context/profile.context';
import { WrappedSpinner } from '@/components/Spinner';

const itemPerPage = 10;

export const OneTimeTab = () => {
	const [loading, setLoading] = useState(false);
	const [donations, setDonations] = useState<IWalletDonation[]>([]);
	const [totalDonations, setTotalDonations] = useState<number>(0);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});
	const { myAccount, user } = useProfileContext();
	const { formatMessage } = useIntl();

	const changeOrder = (orderBy: EOrderBy) => {
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
		if (!user) return;
		const fetchUserDonations = async () => {
			setLoading(true);
			const { data: userDonations } = await client.query({
				query: FETCH_USER_DONATIONS,
				variables: {
					userId: parseFloat(user.id || '') || -1,
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: order.by,
					direction: order.direction,
					status: !myAccount ? EDonationStatus.VERIFIED : null,
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
		fetchUserDonations().then();
	}, [user, page, order.by, order.direction, myAccount]);

	return (
		<>
			<DonationTableWrapper>
				{!loading && totalDonations === 0 ? (
					<NothingWrapper>
						<NothingToSee
							title={`${
								myAccount
									? formatMessage({
											id: 'label.you_havent_donated_to_any_projects_yet',
										})
									: formatMessage({
											id: 'label.this_user_hasnt_donated_to_any_project_yet',
										})
							}`}
						/>
					</NothingWrapper>
				) : (
					<DonationTable
						donations={donations}
						order={order}
						changeOrder={changeOrder}
						myAccount={myAccount}
					/>
				)}
				{loading && (
					<StyledWrappedSpinner>
						<WrappedSpinner size={250} />
					</StyledWrappedSpinner>
				)}
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

const DonationTableWrapper = styled.div`
	position: relative;
	overflow: auto;
	margin-bottom: 40px;
`;

export const StyledWrappedSpinner = styled.div`
	position: absolute !important;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: ${neutralColors.gray[100]}aa;
	min-height: 250px;
`;

export const NothingWrapper = styled.div`
	position: relative;
	padding: 100px 0;
`;
