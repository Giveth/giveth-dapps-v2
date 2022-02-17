import ContributeCard from './PublicProfileContributeCard';
import { Row } from '@/components/styled-components/Grid';
import { ETheme } from '@/context/general.context';
import { mediaQueries } from '@/lib/helpers';
import {
	brandColors,
	Container,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import { IUserPublicProfileView } from './UserPublicProfile.view';

const PublicProfileOverviewTab: FC<IUserPublicProfileView> = ({ user }) => {
	return (
		<>
			<UserContributeInfo>
				<ContributeCard user={user} />
			</UserContributeInfo>
		</>
	);
};

export default PublicProfileOverviewTab;

export const ProjectsContainer = styled(Container)`
	display: grid;
	position: relative;
	gap: 24px;
	margin-bottom: 64px;
	padding: 0;

	${mediaQueries['lg']} {
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries['xl']} {
		grid-template-columns: repeat(3, 1fr);
	}

	${mediaQueries['xxl']} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const UserContributeInfo = styled.div`
	padding: 40px 0 60px;
`;

export const Loading = styled(Row)`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[800]
			: neutralColors.gray[200]}aa;
`;
