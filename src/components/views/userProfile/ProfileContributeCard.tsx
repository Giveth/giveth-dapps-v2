import { brandColors, H2, H5, Subline } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';

import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '../../styled-components/Flex';
import { IUserProfileView } from '@/components/views/userProfile/UserProfile.view';
import { formatUSD } from '@/lib/helpers';

const ProfileContributeCard: FC<IUserProfileView> = ({ user, myAccount }) => {
	const userName = user?.name || 'Unknown';

	return (
		<>
			{!myAccount && (
				<UserContributeTitle
					weight={700}
				>{`${userName}’s donations & projects`}</UserContributeTitle>
			)}

			<ContributeCardContainer>
				<ContributeCard>
					<ContributeCardTitles>donations</ContributeCardTitles>
					<ContributeCardTitles>
						Total amount donated
					</ContributeCardTitles>
					<H2>{user.donationsCount || 0}</H2>
					<H5>${formatUSD(user.totalDonated)}</H5>
				</ContributeCard>
				<ContributeCard>
					<ContributeCardTitles>Projects</ContributeCardTitles>
					<ContributeCardTitles>
						Donation received
					</ContributeCardTitles>
					<H2>{user.projectsCount || 0}</H2>
					<H5>${formatUSD(user.totalReceived)}</H5>
				</ContributeCard>
			</ContributeCardContainer>
		</>
	);
};

const UserContributeTitle = styled(H5)`
	margin-bottom: 16px;
	margin-top: 40px;
`;

const ContributeCardContainer = styled(Flex)`
	gap: 32px;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const ContributeCard = styled.div`
	background: ${brandColors.giv['000']};
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 12px;
	display: grid;
	padding: 24px;
	grid-template-columns: 1fr 1fr;
	width: 100%;
`;

const ContributeCardTitles = styled(Subline)`
	text-transform: uppercase;
`;

export default ProfileContributeCard;
