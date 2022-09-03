import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { brandColors, neutralColors, P } from '@giveth/ui-design-system';

import { Flex } from '@/components/styled-components/Flex';
import ProfileDonationsTab from './donationsTab/ProfileDonationsTab';
import ProfileLikedTab from './ProfileLikedTab';
import ProfileProjectsTab from './projectsTab/ProfileProjectsTab';
import ProfileOverviewTab from './ProfileOverviewTab';
import { IUserProfileView } from './UserProfile.view';
import { Container } from '@/components/Grid';
import ContributeCard from '@/components/views/userProfile/ProfileContributeCard';

enum EProfile {
	OVERVIEW,
	BOOSTED,
	PROJECTS,
	DONATIONS,
	LIKED,
}

interface ITab {
	active: boolean;
}

const ProfileContributes: FC<IUserProfileView> = ({ user, myAccount }) => {
	const router = useRouter();
	const [tab, setTab] = useState(
		myAccount ? EProfile.OVERVIEW : EProfile.PROJECTS,
	);

	useEffect(() => {
		const tab = router?.query?.tab;
		switch (tab) {
			case 'projects':
				setTab(EProfile.PROJECTS);
				break;
			case 'donations':
				setTab(EProfile.DONATIONS);
				break;
			case 'liked':
				setTab(EProfile.LIKED);
				break;
			default:
				setTab(myAccount ? EProfile.OVERVIEW : EProfile.PROJECTS);
		}
	}, [router?.query?.tab]);

	const userName = user?.name || 'Unknown';

	return (
		<ProfileContainer>
			{!myAccount && tab === EProfile.PROJECTS && (
				<ContributeCard user={user} />
			)}
			<ProfileTabsContainer>
				{myAccount && (
					<ProfileTab
						active={tab === EProfile.OVERVIEW}
						onClick={() => setTab(EProfile.OVERVIEW)}
					>
						Overview
					</ProfileTab>
				)}
				{myAccount && (
					<ProfileTab
						active={tab === EProfile.BOOSTED}
						onClick={() => setTab(EProfile.BOOSTED)}
					>
						Boosted projects
					</ProfileTab>
				)}
				<ProfileTab
					active={tab === EProfile.PROJECTS}
					onClick={() => setTab(EProfile.PROJECTS)}
				>
					{`${myAccount ? 'My ' : userName + '’s'} projects`}
					{myAccount && user?.projectsCount != 0 && (
						<Count active={tab === EProfile.PROJECTS}>
							{user?.projectsCount}
						</Count>
					)}
				</ProfileTab>
				<ProfileTab
					active={tab === EProfile.DONATIONS}
					onClick={() => setTab(EProfile.DONATIONS)}
				>
					{`${myAccount ? 'My ' : ''}Donations`}
					{myAccount && user?.donationsCount != 0 && (
						<Count active={tab === EProfile.DONATIONS}>
							{user?.donationsCount}
						</Count>
					)}
				</ProfileTab>
				<ProfileTab
					active={tab === EProfile.LIKED}
					onClick={() => setTab(EProfile.LIKED)}
				>
					Liked projects
					{myAccount && !!user.likedProjectsCount && (
						<Count active={tab === EProfile.LIKED}>
							{user?.likedProjectsCount}
						</Count>
					)}
				</ProfileTab>
			</ProfileTabsContainer>
			{tab === EProfile.OVERVIEW && <ProfileOverviewTab user={user} />}
			{tab === EProfile.PROJECTS && (
				<ProfileProjectsTab user={user} myAccount={myAccount} />
			)}
			{tab === EProfile.DONATIONS && (
				<ProfileDonationsTab user={user} myAccount={myAccount} />
			)}
			{tab === EProfile.LIKED && (
				<ProfileLikedTab user={user} myAccount={myAccount} />
			)}
		</ProfileContainer>
	);
};

const ProfileContainer = styled(Container)`
	padding: 0 10px !important;
`;

const ProfileTabsContainer = styled(Flex)`
	padding: 37px 0;
	gap: 16px;
	max-width: 600px;
	overflow: auto;
`;

const ProfileTab = styled(P)<ITab>`
	display: flex;
	align-items: center;
	padding: 9px 10px;
	word-break: break-word;
	white-space: nowrap;
	cursor: pointer;
	color: ${(props: ITab) =>
		props.active ? brandColors.deep[600] : brandColors.pinky[500]};
	${props =>
		props.active &&
		`
		background: ${neutralColors.gray[100]};
		box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
		border-radius: 50px;
	`}
`;

const Count = styled.div`
	background-color: ${(props: ITab) =>
		props.active ? neutralColors.gray[500] : brandColors.pinky[500]};
	color: white;
	width: 24px;
	height: 24px;
	text-align: center;
	border-radius: 50%;
	font-size: 12px;
	margin-left: 4px;
`;

export default ProfileContributes;
