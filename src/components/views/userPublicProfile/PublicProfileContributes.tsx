import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import PublicProfileDonationsTab from './donationsTab/PublicProfileDonationsTab';
import PublicProfileLikedTab from './PublicProfileLikedTab';
import PublicProfileProjectsTab from './projectsTab/PublicProfileProjectsTab';
import PublicProfileOverviewTab from './PublicProfileOverviewTab';
import { IUserPublicProfileView } from './UserPublicProfile.view';
import { Container } from '@/components/Grid';
import ContributeCard from '@/components/views/userPublicProfile/PublicProfileContributeCard';
import {
	TabsContainer,
	TabItem,
	TabItemCount,
} from '@/components/styled-components/Tabs';

enum EPublicProfile {
	OVERVIEW,
	PROJECTS,
	DONATIONS,
	LIKED,
}

const PublicProfileContributes: FC<IUserPublicProfileView> = ({
	user,
	myAccount,
}) => {
	const router = useRouter();
	const [tab, setTab] = useState(
		myAccount ? EPublicProfile.OVERVIEW : EPublicProfile.PROJECTS,
	);

	useEffect(() => {
		const tab = router?.query?.tab;
		switch (tab) {
			case 'projects':
				setTab(EPublicProfile.PROJECTS);
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
						Overview
					</TabItem>
				)}
				<TabItem
					active={tab === EPublicProfile.PROJECTS}
					onClick={() => setTab(EPublicProfile.PROJECTS)}
				>
					{`${myAccount ? 'My ' : userName + '’s'} projects`}
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
					{`${myAccount ? 'My ' : ''}Donations`}
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
					Liked projects
					{myAccount && !!user.likedProjectsCount && (
						<TabItemCount active={tab === EPublicProfile.LIKED}>
							{user?.likedProjectsCount}
						</TabItemCount>
					)}
				</TabItem>
			</TabsContainer>
			{tab === EPublicProfile.OVERVIEW && (
				<PublicProfileOverviewTab user={user} />
			)}
			{tab === EPublicProfile.PROJECTS && (
				<PublicProfileProjectsTab user={user} myAccount={myAccount} />
			)}
			{tab === EPublicProfile.DONATIONS && (
				<PublicProfileDonationsTab user={user} myAccount={myAccount} />
			)}
			{tab === EPublicProfile.LIKED && (
				<PublicProfileLikedTab user={user} myAccount={myAccount} />
			)}
		</ProfileContainer>
	);
};

const ProfileContainer = styled(Container)`
	padding: 0 10px !important;
`;

export default PublicProfileContributes;
