import { H2, H5 } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '../../styled-components/Flex';
import { IUserProfileView } from '@/components/views/userProfile/UserProfile.view';
import { formatUSD } from '@/lib/helpers';
import { ContributeCard, ContributeCardTitles } from './common.sc';

const ProfileContributeCard: FC<IUserProfileView> = ({ user, myAccount }) => {
	const userName = user?.name || 'Unknown';
	const { formatMessage } = useIntl();

	return (
		<>
			{!myAccount && (
				<UserContributeTitle weight={700}>
					{formatMessage({ id: 'label.donations_and_projects' })}
				</UserContributeTitle>
			)}

			<ContributeCardContainer>
				<ContributeCard>
					<ContributeCardTitles>
						{formatMessage({ id: 'label.donations' })}
					</ContributeCardTitles>
					<ContributeCardTitles>
						{formatMessage({ id: 'label.total_amount_donated' })}
					</ContributeCardTitles>
					<H2>{user.donationsCount || 0}</H2>
					<H5>${formatUSD(user.totalDonated)}</H5>
				</ContributeCard>
				<ContributeCard>
					<ContributeCardTitles>
						{formatMessage({ id: 'label.projects' })}
					</ContributeCardTitles>
					<ContributeCardTitles>
						{formatMessage({ id: 'label.donantion_received' })}
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

export default ProfileContributeCard;
