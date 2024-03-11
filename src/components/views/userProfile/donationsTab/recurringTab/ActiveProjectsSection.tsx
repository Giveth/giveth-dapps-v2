import { H5, neutralColors, Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import ToggleSwitch from '@/components/ToggleSwitch';
import { RecurringDonationFiltersButton } from './RecurringDonationFiltersButton';
import { client } from '@/apollo/apolloClient';
import { EDirection, EDonationStatus } from '@/apollo/types/gqlEnums';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import { useProfileContext } from '@/context/profile.context';
import { FETCH_USER_RECURRING_DONATIONS } from '@/apollo/gql/gqlUser';
import DonationTable from '@/components/views/userProfile/donationsTab/recurringTab/RecurringDonationsTable';
import { IUserRecurringDonations } from '@/apollo/types/gqlTypes';

const itemPerPage = 10;

export enum ERecurringDonationSortField {
	createdAt = 'createdAt',
	flowRate = 'flowRate',
}
export interface IOrder {
	field: ERecurringDonationSortField;
	direction: EDirection;
}

export const ActiveProjectsSection = () => {
	const [showArchive, setShowArchive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [donations, setDonations] = useState<IWalletRecurringDonation[]>([]);
	const [totalDonations, setTotalDonations] = useState<number>(0);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState<IOrder>({
		field: ERecurringDonationSortField.createdAt,
		direction: EDirection.DESC,
	});
	const { myAccount, user } = useProfileContext();
	const { formatMessage } = useIntl();

	const changeOrder = (orderBy: ERecurringDonationSortField) => {
		if (orderBy === order.field) {
			setOrder({
				field: orderBy,
				direction:
					order.direction === EDirection.ASC
						? EDirection.DESC
						: EDirection.ASC,
			});
		} else {
			setOrder({
				field: orderBy,
				direction: EDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!user) return;
		const fetchUserDonations = async () => {
			setLoading(true);
			const { data: userDonations } = await client.query({
				query: FETCH_USER_RECURRING_DONATIONS,
				variables: {
					userId: parseFloat(user.id || '') || -1,
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: order,
					status: !myAccount ? EDonationStatus.VERIFIED : null,
					finished: showArchive,
				},
			});
			setLoading(false);
			if (userDonations?.recurringDonationsByUserId) {
				const recurringDonationsByUserId: IUserRecurringDonations =
					userDonations.recurringDonationsByUserId;
				setDonations(recurringDonationsByUserId.recurringDonations);
				setTotalDonations(recurringDonationsByUserId.totalCount);
			}
		};
		fetchUserDonations().then();
	}, [user, page, order.field, order.direction, myAccount, showArchive]);
	return (
		<Wrapper>
			<Flex $justifyContent='space-between'>
				<H5 weight={900}>Active projects</H5>
				<Flex gap='24px'>
					<StyledToggleSwitch
						isOn={showArchive}
						label='Switch to Archive Donations'
						toggleOnOff={() => setShowArchive(archive => !archive)}
					/>
					<RecurringDonationFiltersButton />
				</Flex>
			</Flex>
			<DonationTable
				donations={donations}
				order={order}
				changeOrder={changeOrder}
				myAccount={myAccount}
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 12px;
	background-color: ${neutralColors.gray[100]};
	padding: 24px;
	border-radius: 12px;
`;

const StyledToggleSwitch = styled(ToggleSwitch)`
	flex-direction: row-reverse;
`;
