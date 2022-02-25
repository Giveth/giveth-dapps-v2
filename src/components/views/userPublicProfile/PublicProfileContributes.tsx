import {
	brandColors,
	Container,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { Row } from '../../styled-components/Grid';
import PublicProfileDonationsTab from './PublicProfileDonationsTab';
import PublicProfileLikedTab from './PublicProfileLikedTab';
import PublicProfileProjectsTab from './PublicProfileProjectsTab';
import PublicProfileOverviewTab from './PublicProfileOverviewTab';
import { IUserPublicProfileView } from './UserPublicProfile.view';

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
	const [tab, setTab] = useState(
		myAccount ? EPublicProfile.OVERVIEW : EPublicProfile.PROJECTS,
	);
	return (
		<PubliCProfileTabsAndProjectContainer>
			<Container>
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
						{myAccount && user?.donationsCount != 0 && (
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
					<PublicProfileDonationsTab
						user={user}
						myAccount={myAccount}
					/>
				)}
				{tab === EPublicProfile.LIKED && (
					<PublicProfileLikedTab user={user} myAccount={myAccount} />
				)}
			</Container>
		</PubliCProfileTabsAndProjectContainer>
	);
};

export default PublicProfileContributes;

const PubliCProfileTabsAndProjectContainer = styled.div``;

const PubliCProfileTabsContainer = styled(Row)`
	padding: 37px 0;
	gap: 16px;
`;

const PubliCProfileTab = styled(P)<ITab>`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 9px 16px;
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
	align-itmes: center;
	text-align: center;
	border-radius: 50%;
	font-size: 12px;
	margin-left: 4px;
`;
