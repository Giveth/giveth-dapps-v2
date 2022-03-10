import { brandColors, H2, H3, H5, Subline } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import { Flex } from '../../styled-components/Flex';
import { IUser } from '@/apollo/types/types';
import { Container } from '@/components/Grid';

export interface IUserPublicProfileView {
	user: IUser;
	myAccount?: boolean;
}

const PublicProfileContributeCard: FC<IUserPublicProfileView> = ({
	user,
	myAccount,
}) => {
	return (
		<Container>
			{!myAccount && (
				<UserContributeTitle
					weight={700}
				>{`${user.name}’s donations & projects`}</UserContributeTitle>
			)}

			<ContributeCardContainer>
				<ContributeCard>
					<ContributeCardTitles>donations</ContributeCardTitles>
					<ContributeCardTitles>
						Total amount donated
					</ContributeCardTitles>
					<H2>{user.donationsCount || 0}</H2>
					<H5>${user.totalDonated || 0}</H5>
				</ContributeCard>
				<ContributeCard>
					<ContributeCardTitles>Projects</ContributeCardTitles>
					<ContributeCardTitles>
						Donation received
					</ContributeCardTitles>
					<H2>{user.projectsCount}</H2>
					<H5>${user.totalReceived}</H5>
				</ContributeCard>
			</ContributeCardContainer>
		</Container>
	);
};

const UserContributeTitle = styled(H5)`
	margin-bottom: 16px;
`;

const ContributeCardContainer = styled(Flex)`
	gap: 32px;
`;

const ContributeCard = styled.div`
	background: ${brandColors.giv['000']};
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 12px;
	display: grid;
	padding: 24px;
	width: 556px;
	grid-template-columns: 1fr 1fr;
`;

const ContributeCardTitles = styled(Subline)`
	text-transform: uppercase;
`;

export default PublicProfileContributeCard;
