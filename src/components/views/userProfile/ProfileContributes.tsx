import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

import ProfileDonationsTab from './donationsTab/ProfileDonationsTab';
import ProfileLikedTab from './ProfileLikedTab';
import ProfileProjectsTab from './projectsTab/ProfileProjectsTab';
import ProfileOverviewTab from './ProfileOverviewTab';
import { IUserProfileView } from './UserProfile.view';
import { Container } from '@/components/Grid';
import ContributeCard from '@/components/views/userProfile/ProfileContributeCard';
import { ProfileBoostedTab } from './boostedTab/ProfileBoostedTab';
import { IS_BOOSTING_ENABLED } from '@/configuration';
import {
	TabItem,
	TabItemCount,
	TabsContainer,
} from '@/components/styled-components/Tabs';

enum EPublicProfile {
	OVERVIEW,
	BOOSTED,
	PROJECTS,
	DONATIONS,
	LIKED,
}

const ProfileContributes: FC<IUserProfileView> = ({ user, myAccount }) => {
	const router = useRouter();
	const { formatMessage } = useIntl();
	const [tab, setTab] = useState(
		myAccount ? EPublicProfile.OVERVIEW : EPublicProfile.PROJECTS,
	);

	useEffect(() => {
		const tab = router?.query?.tab;
		switch (tab) {
			case 'projects':
				setTab(EPublicProfile.PROJECTS);
				break;
			case 'boosted':
				setTab(EPublicProfile.BOOSTED);
				break;
			case 'donations':
				setTab(EPublicProfile.DONATIONS);
				break;
			case 'liked':
				setTab(EPublicProfile.LIKED);
				break;
			default:
				setTab(
					myAccount
						? EPublicProfile.OVERVIEW
						: EPublicProfile.PROJECTS,
				);
		}
	}, [router?.query?.tab]);

	const userName = user?.name || 'Unknown';

	return (
		<ProfileContainer>
			{!myAccount && tab === EPublicProfile.PROJECTS && (
				<ContributeCard user={user} />
			)}
			<TabsContainer>
				{myAccount && (
					<TabItem
						active={tab === EPublicProfile.OVERVIEW}
						onClick={() => setTab(EPublicProfile.OVERVIEW)}
					>
						{formatMessage({ id: 'label.overview' })}
					</TabItem>
				)}
				{/* // TODO: Boosting - remove this for boosting launch */}
				{myAccount && IS_BOOSTING_ENABLED && (
					<TabItem
						active={tab === EPublicProfile.BOOSTED}
						onClick={() => setTab(EPublicProfile.BOOSTED)}
					>
						{formatMessage({
							id: 'label.boosted_projects',
						})}
					</TabItem>
				)}
				<TabItem
					active={tab === EPublicProfile.PROJECTS}
					onClick={() => setTab(EPublicProfile.PROJECTS)}
				>
					{`${
						myAccount
							? formatMessage({ id: 'label.my_projects' })
							: formatMessage({ id: 'label.projects' })
					}`}
					{myAccount && user?.projectsCount != 0 && (
						<TabItemCount active={tab === EPublicProfile.PROJECTS}>
							{user?.projectsCount}
						</TabItemCount>
					)}
				</TabItem>
				<TabItem
					active={tab === EPublicProfile.DONATIONS}
					onClick={() => setTab(EPublicProfile.DONATIONS)}
				>
					{`${
						myAccount
							? formatMessage({
								id: 'label.my_donations',
							})
							: formatMessage({ id: 'label.donations' })
					}`}
					{myAccount && user?.donationsCount != 0 && (
						<TabItemCount active={tab === EPublicProfile.DONATIONS}>
							{user?.donationsCount}
						</TabItemCount>
					)}
				</TabItem>
				<TabItem
					active={tab === EPublicProfile.LIKED}
					onClick={() => setTab(EPublicProfile.LIKED)}
				>
					{formatMessage({ id: 'label.liked_projects' })}
					{myAccount && !!user.likedProjectsCount && (
						<TabItemCount active={tab === EPublicProfile.LIKED}>
							{user?.likedProjectsCount}
						</TabItemCount>
					)}
				</TabItem>
			</TabsContainer>
			{tab === EPublicProfile.OVERVIEW && (
				<ProfileOverviewTab user={user} />
			)}
			{tab === EPublicProfile.BOOSTED && (
				<ProfileBoostedTab user={user} />
			)}
			{tab === EPublicProfile.PROJECTS && (
				<ProfileProjectsTab user={user} myAccount={myAccount} />
			)}
			{tab === EPublicProfile.DONATIONS && (
				<ProfileDonationsTab user={user} myAccount={myAccount} />
			)}
			{tab === EPublicProfile.LIKED && (
				<ProfileLikedTab user={user} myAccount={myAccount} />
			)}
		</ProfileContainer>
	);
};

const ProfileContainer = styled(Container)`
	padding: 0 10px !important;
`;

export default ProfileContributes;
