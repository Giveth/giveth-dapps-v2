import { type FC, useState } from 'react';
import { Col, P, Row, neutralColors, Flex } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IUserProfileView } from '../UserProfile.view';
import { UserContributeTitle, UserProfileTab } from '../common.sc';
import { DonateContributeCard } from '@/components/ContributeCard';
import { useProfileContext } from '@/context/profile.context';
import { OneTimeTab } from './oneTimeTab/OneTimeTab';
import { RecurringTab } from './recurringTab/RecurringTab';
import { isRecurringActive } from '@/configuration';
import { ProfileDonateTabProvider } from './recurringTab/ProfileDonateTab.context';

enum ETab {
	ONE_TIME,
	RECURRING,
}

const tabs = [
	{
		id: ETab.ONE_TIME,
		label: 'label.one_time_donation',
		query: 'donations',
	},
	{
		id: ETab.RECURRING,
		label: 'label.recurring_donation',
		query: 'recurring-donations',
	},
];

const ProfileDonationsTab: FC<IUserProfileView> = () => {
	const router = useRouter();
	const [tab, setTab] = useState(
		router.query.tab === 'recurring-donations'
			? ETab.RECURRING
			: ETab.ONE_TIME,
	);
	const { myAccount, user } = useProfileContext();
	const { formatMessage } = useIntl();

	const userName = user?.name || 'Unknown';

	return (
		<ProfileDonateTabProvider>
			<UserProfileTab>
				{!myAccount && (
					<Row>
						<Col lg={6}>
							<DonateContributeCard />
						</Col>
					</Row>
				)}
				{!myAccount && (
					<UserContributeTitle weight={700}>
						{formatMessage(
							{
								id: 'label.user_donations',
							},
							{
								userName,
							},
						)}
					</UserContributeTitle>
				)}
				{isRecurringActive ? (
					<>
						<Tabs>
							{tabs.map(({ id, label, query }) => (
								<Link
									key={id}
									href={{
										query: { ...router.query, tab: query },
									}}
									shallow={true}
									scroll={false}
								>
									<Tab
										onClick={() => setTab(id)}
										className={`tab ${tab === id ? 'active' : ''}`}
										$isActive={tab === id}
									>
										{formatMessage({ id: label })}
									</Tab>
								</Link>
							))}
						</Tabs>
						{tab === ETab.ONE_TIME && <OneTimeTab />}
						{tab === ETab.RECURRING && <RecurringTab />}
					</>
				) : (
					<OneTimeTab />
				)}
			</UserProfileTab>
		</ProfileDonateTabProvider>
	);
};

const Tabs = styled(Flex)`
	gap: 8px;
	margin: 24px 0;
`;

interface ITab {
	$isActive: boolean;
}

const Tab = styled(P)<ITab>`
	padding: 16px;
	border-radius: 48px;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;
	${({ $isActive }) =>
		$isActive &&
		css`
			background-color: ${neutralColors.gray[100]};
			box-shadow: 0px 3px 20px 0px rgba(212, 218, 238, 0.4);
		`}
	&:hover {
		background-color: ${neutralColors.gray[100]};
	}
`;

export default ProfileDonationsTab;
