import { type FC, useState } from 'react';
import { Col, Row } from '@giveth/ui-design-system';

import { useIntl } from 'react-intl';
import { IUserProfileView } from '../UserProfile.view';

import { UserContributeTitle, UserProfileTab } from '../common.sc';
import { DonateContributeCard } from '@/components/ContributeCard';
import { useProfileContext } from '@/context/profile.context';
import { OneTimeTab } from './oneTimeTab/OneTimeTab';
import { RecurringTab } from './recurringTab/RecurringTab';

enum ETab {
	OneTime,
	Recurring,
}

const ProfileDonationsTab: FC<IUserProfileView> = () => {
	const [tab, setTab] = useState(ETab.Recurring);
	const { myAccount, user } = useProfileContext();
	const { formatMessage } = useIntl();

	const userName = user?.name || 'Unknown';

	return (
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
			{tab === ETab.OneTime && <OneTimeTab />}
			{tab === ETab.Recurring && <RecurringTab />}
		</UserProfileTab>
	);
};

export default ProfileDonationsTab;
