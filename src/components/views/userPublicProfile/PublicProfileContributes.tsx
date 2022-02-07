import {
	brandColors,
	Container,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { Row } from '../../styled-components/Grid';
import PublicProfileProjectsTab from './PublicProfileProjectsTab';
import { IUserPublicProfileView } from './UserPublicProfile.view';

enum EPublicProfile {
	PROJECTS,
	DONATIONS,
	LIKED,
}

const PublicProfileContributes: FC<IUserPublicProfileView> = ({ user }) => {
	const [tab, setTab] = useState(EPublicProfile.PROJECTS);
	return (
		<PubliCProfileTabsAndProjectContianer>
			<Container>
				<PubliCProfileTabsContainer>
					<PubliCProfileTab
						active={tab === EPublicProfile.PROJECTS}
						onClick={() => setTab(EPublicProfile.PROJECTS)}
					>{`${user.name}’s projects`}</PubliCProfileTab>
					<PubliCProfileTab
						active={tab === EPublicProfile.DONATIONS}
						onClick={() => setTab(EPublicProfile.DONATIONS)}
					>
						Donations
					</PubliCProfileTab>
					<PubliCProfileTab
						active={tab === EPublicProfile.LIKED}
						onClick={() => setTab(EPublicProfile.LIKED)}
					>
						Liked projects
					</PubliCProfileTab>
				</PubliCProfileTabsContainer>
				{tab === EPublicProfile.PROJECTS && (
					<PublicProfileProjectsTab user={user} />
				)}
			</Container>
		</PubliCProfileTabsAndProjectContianer>
	);
};

export default PublicProfileContributes;

const PubliCProfileTabsAndProjectContianer = styled.div``;

const PubliCProfileTabsContainer = styled(Row)`
	padding-bottom: 37px;
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
