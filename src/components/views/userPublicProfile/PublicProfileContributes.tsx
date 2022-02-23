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

const PublicProfileContributes: FC<IUserPublicProfileView> = ({
	user,
	myAccount,
}) => {
	const [tab, setTab] = useState(
		myAccount ? EPublicProfile.OVERVIEW : EPublicProfile.PROJECTS,
	);
	return (
		<PubliCProfileTabsAndProjectContianer>
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
					</PubliCProfileTab>
					<PubliCProfileTab
						active={tab === EPublicProfile.DONATIONS}
						onClick={() => setTab(EPublicProfile.DONATIONS)}
					>
						{`${myAccount ? 'My ' : ''}Donations`}
					</PubliCProfileTab>
					<PubliCProfileTab
						active={tab === EPublicProfile.LIKED}
						onClick={() => setTab(EPublicProfile.LIKED)}
					>
						Liked projects
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
		</PubliCProfileTabsAndProjectContianer>
	);
};

export default PublicProfileContributes;

const PubliCProfileTabsAndProjectContianer = styled.div``;

const PubliCProfileTabsContainer = styled(Row)`
	padding: 37px 0;
	gap: 16px;
`;

interface ITab {
	active?: boolean;
}

const PubliCProfileTab = styled(P)<ITab>`
	padding: 9px 16px;
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	${props =>
		props.active &&
		`
		background: ${neutralColors.gray[100]};
		box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
		border-radius: 50px;
	`}
`;
