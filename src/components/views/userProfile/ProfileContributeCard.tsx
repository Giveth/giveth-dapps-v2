import { H2, H5 } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';

import { IUserProfileView } from '@/components/views/userProfile/UserProfile.view';
import { formatUSD } from '@/lib/helpers';
import { ContributeCard, ContributeCardTitles } from './common.sc';
import { Col, Row } from '@/components/Grid';

const ProfileContributeCard: FC<IUserProfileView> = ({ user }) => {
	return (
		<ContributeCardContainer>
			<Col lg={6}>
				<ContributeCard>
					<ContributeCardTitles>donations</ContributeCardTitles>
					<ContributeCardTitles>
						Total amount donated
					</ContributeCardTitles>
					<H2>{user.donationsCount || 0}</H2>
					<H5>${formatUSD(user.totalDonated)}</H5>
				</ContributeCard>
			</Col>
			<Col lg={6}>
				<ContributeCard>
					<ContributeCardTitles>Projects</ContributeCardTitles>
					<ContributeCardTitles>
						Donation received
					</ContributeCardTitles>
					<H2>{user.projectsCount || 0}</H2>
					<H5>${formatUSD(user.totalReceived)}</H5>
				</ContributeCard>
			</Col>
		</ContributeCardContainer>
	);
};

export const UserContributeTitle = styled(H5)`
	margin-bottom: 16px;
	margin-top: 40px;
`;

const ContributeCardContainer = styled(Row)``;

export default ProfileContributeCard;
