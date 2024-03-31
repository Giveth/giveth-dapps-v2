import { H5, neutralColors, Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import ToggleSwitch from '@/components/ToggleSwitch';
import { RecurringDonationFiltersButton } from './RecurringDonationFiltersButton';
import { client } from '@/apollo/apolloClient';
import { EDirection } from '@/apollo/types/gqlEnums';
import {
	ERecurringDonationStatus,
	IWalletRecurringDonation,
} from '@/apollo/types/types';
import { useProfileContext } from '@/context/profile.context';
import { FETCH_USER_RECURRING_DONATIONS } from '@/apollo/gql/gqlUser';
import DonationTable from '@/components/views/userProfile/donationsTab/recurringTab/RecurringDonationsTable';
import { IUserRecurringDonations } from '@/apollo/types/gqlTypes';
import Pagination from '@/components/Pagination';
import { WrappedSpinner } from '@/components/Spinner';
import NothingToSee from '../../NothingToSee';
import { NothingWrapper, StyledWrappedSpinner } from '../oneTimeTab/OneTimeTab';

const itemPerPage = 10;

export enum ERecurringDonationSortField {
	createdAt = 'createdAt',
	flowRate = 'flowRate',
}
export interface IOrder {
	by: ERecurringDonationSortField;
	direction: EDirection;
}

export interface IFinishStatus {
	active: boolean;
	ended: boolean;
}

export const ActiveProjectsSection = () => {
	const [trigger, setTrigger] = useState(false);
	const [showArchive, setShowArchive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [donations, setDonations] = useState<IWalletRecurringDonation[]>([]);
	const [totalDonations, setTotalDonations] = useState<number>(0);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState<IOrder>({
		by: ERecurringDonationSortField.createdAt,
		direction: EDirection.DESC,
	});
	const [tokenFilters, setTokenFilters] = useState([] as string[]);
	const [statusFilters, setStatusFilters] = useState<IFinishStatus>({
		active: false,
		ended: false,
	});
	const { myAccount, user } = useProfileContext();
	const { formatMessage } = useIntl();

	const changeOrder = (orderBy: ERecurringDonationSortField) => {
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
				query: FETCH_USER_RECURRING_DONATIONS,
				variables: {
					userId: parseFloat(user.id || '') || -1,
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: { field: order.by, direction: order.direction },
					status: !myAccount
						? ERecurringDonationStatus.ACTIVE
						: showArchive
							? ERecurringDonationStatus.ARCHIVED
							: null,
					finishStatus: statusFilters,
					filteredTokens: tokenFilters,
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
	}, [
		user,
		page,
		order.by,
		order.direction,
		myAccount,
		showArchive,
		statusFilters,
		tokenFilters,
		trigger,
	]);
	return (
		<Wrapper>
			<Flex $justifyContent='space-between'>
				<H5 weight={900}>Recurring Donations</H5>
				<Flex gap='24px'>
					<StyledToggleSwitch
						isOn={showArchive}
						label='Switch to Archive Donations'
						toggleOnOff={() => setShowArchive(archive => !archive)}
					/>
					<RecurringDonationFiltersButton
						statusFilters={statusFilters}
						setStatusFilters={setStatusFilters}
						tokenFilters={tokenFilters}
						setTokenFilters={setTokenFilters}
					/>
				</Flex>
			</Flex>
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
						refetch={() => {
							setTrigger(prev => !prev);
						}}
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
		</Wrapper>
	);
};

const DonationTableWrapper = styled.div`
	position: relative;
	overflow: auto;
	margin-bottom: 40px;
`;

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
