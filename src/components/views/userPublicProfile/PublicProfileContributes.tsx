import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { brandColors, neutralColors, P } from '@giveth/ui-design-system';

import { Flex } from '@/components/styled-components/Flex';
import PublicProfileDonationsTab from './PublicProfileDonationsTab';
import PublicProfileLikedTab from './PublicProfileLikedTab';
import PublicProfileProjectsTab from './PublicProfileProjectsTab';
import PublicProfileOverviewTab from './PublicProfileOverviewTab';
import { IUserPublicProfileView } from './UserPublicProfile.view';
  
import { Container } from '@/components/Grid';
import { mediaQueries } from '@/utils/constants';

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

	return (
		<PubliCProfileTabsAndProjectContainer>
			<ProfileContainer>
				<PubliCProfileTabsContainer>
					{myAccount && (
						<PubliCProfileTab
							active={tab === EPublicProfile.OVERVIEW}
							onClick={() => setTab(EPublicProfile.OVERVIEW)}
						>
							Overview
						</PubliCProfileTab>
					)}
					<PubliCProfileTab
						active={tab === EPublicProfile.PROJECTS}
						onClick={() => setTab(EPublicProfile.PROJECTS)}
					>
						{`${myAccount ? 'My ' : user.name + '’s'} projects`}
						{myAccount && user?.projectsCount != 0 && (
							<Count active={tab === EPublicProfile.PROJECTS}>
								{user?.projectsCount}
							</Count>
						)}
					</PubliCProfileTab>
					<PubliCProfileTab
						active={tab === EPublicProfile.DONATIONS}
						onClick={() => setTab(EPublicProfile.DONATIONS)}
					>
						{`${myAccount ? 'My ' : ''}Donations`}
						{myAccount && user?.donationsCount != 0 && (
							<Count active={tab === EPublicProfile.DONATIONS}>
								{user?.donationsCount}
							</Count>
						)}
					</PubliCProfileTab>
					<PubliCProfileTab
						active={tab === EPublicProfile.LIKED}
						onClick={() => setTab(EPublicProfile.LIKED)}
					>
						Liked projects
						{myAccount && !!user.likedProjectsCount && (
							<Count active={tab === EPublicProfile.LIKED}>
								{user?.likedProjectsCount}
							</Count>
						)}
					</PubliCProfileTab>
				</PubliCProfileTabsContainer>
				{tab === EPublicProfile.OVERVIEW && (
					<PublicProfileOverviewTab
						user={user}
						myAccount={myAccount}
					/>
				)}
				{tab === EPublicProfile.PROJECTS && (
					<PublicProfileProjectsTab
						user={user}
						myAccount={myAccount}
					/>
				)}
				{tab === EPublicProfile.DONATIONS && (
					<DonationsTableWrapper>
						<PublicProfileDonationsTab
							user={user}
							myAccount={myAccount}
						/>
					</DonationsTableWrapper>
				)}
				{tab === EPublicProfile.LIKED && (
					<PublicProfileLikedTab user={user} myAccount={myAccount} />
				)}
			</ProfileContainer>
		</PubliCProfileTabsAndProjectContainer>
	);
};

export default PublicProfileContributes;

const PubliCProfileTabsAndProjectContainer = styled.div``;

const ProfileContainer = styled(Container)`
	${mediaQueries.mobileL} {
		padding: 0 0 0 10px !important;
	}
	${mediaQueries.mobileM} {
		padding: 0 0 0 10px !important;
	}
	${mediaQueries.mobileS} {
		padding: 0 0 0 10px !important;
	}
`;

const PubliCProfileTabsContainer = styled(Flex)`
	padding: 37px 0;
	gap: 16px;
	max-width: 600px;
	overflow: auto;
`;

const DonationsTableWrapper = styled.div`
	overflow: auto;
`;

const PubliCProfileTab = styled(P)<ITab>`
	display: flex;
	flex-direction: row;
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
		box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
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
