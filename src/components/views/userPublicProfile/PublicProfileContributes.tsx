import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { brandColors, neutralColors, P } from '@giveth/ui-design-system';

import { Flex } from '@/components/styled-components/Flex';
import PublicProfileDonationsTab from './donationsTab/PublicProfileDonationsTab';
import PublicProfileLikedTab from './PublicProfileLikedTab';
import PublicProfileProjectsTab from './projectsTab/PublicProfileProjectsTab';
import PublicProfileOverviewTab from './PublicProfileOverviewTab';
import { IUserPublicProfileView } from './UserPublicProfile.view';
import { Container } from '@/components/Grid';
import ContributeCard from '@/components/views/userPublicProfile/PublicProfileContributeCard';

enum EPublicProfile {
	OVERVIEW,
	PROJECTS,
	DONATIONS,
	LIKED,
}

interface ITab {
	active: boolean;
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
			<PublicProfileTabsContainer>
				{myAccount && (
					<PublicProfileTab
						active={tab === EPublicProfile.OVERVIEW}
						onClick={() => setTab(EPublicProfile.OVERVIEW)}
					>
						Overview
					</PublicProfileTab>
				)}
				<PublicProfileTab
					active={tab === EPublicProfile.PROJECTS}
					onClick={() => setTab(EPublicProfile.PROJECTS)}
				>
					{`${myAccount ? 'My ' : userName + '’s'} projects`}
					{myAccount && user?.projectsCount != 0 && (
						<Count active={tab === EPublicProfile.PROJECTS}>
							{user?.projectsCount}
						</Count>
					)}
				</PublicProfileTab>
				<PublicProfileTab
					active={tab === EPublicProfile.DONATIONS}
					onClick={() => setTab(EPublicProfile.DONATIONS)}
				>
					{`${myAccount ? 'My ' : ''}Donations`}
					{myAccount && user?.donationsCount != 0 && (
						<Count active={tab === EPublicProfile.DONATIONS}>
							{user?.donationsCount}
						</Count>
					)}
				</PublicProfileTab>
				<PublicProfileTab
					active={tab === EPublicProfile.LIKED}
					onClick={() => setTab(EPublicProfile.LIKED)}
				>
					Liked projects
					{myAccount && !!user.likedProjectsCount && (
						<Count active={tab === EPublicProfile.LIKED}>
							{user?.likedProjectsCount}
						</Count>
					)}
				</PublicProfileTab>
			</PublicProfileTabsContainer>
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

const PublicProfileTabsContainer = styled(Flex)`
	padding: 37px 0;
	gap: 16px;
	max-width: 600px;
	overflow: auto;
`;

const PublicProfileTab = styled(P)<ITab>`
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
	align-items: center;
	text-align: center;
	border-radius: 50%;
	font-size: 12px;
	margin-left: 4px;
`;

export default PublicProfileContributes;
