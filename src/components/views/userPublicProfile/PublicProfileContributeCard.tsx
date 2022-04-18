import { brandColors, H2, H5, Subline } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import { FC } from 'react';
import styled from 'styled-components';
import { Flex } from '../../styled-components/Flex';
import { IUser } from '@/apollo/types/types';
import { Container } from '@/components/Grid';
import { roundNumber } from '@/helpers/number';

export interface IUserPublicProfileView {
	user: IUser;
	myAccount?: boolean;
}

const PublicProfileContributeCard: FC<IUserPublicProfileView> = ({
	user,
	myAccount,
}) => {
	return (
		<CustomContainer>
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
					<H5>${roundNumber(user.totalDonated) || 0}</H5>
				</ContributeCard>
				<ContributeCard>
					<ContributeCardTitles>Projects</ContributeCardTitles>
					<ContributeCardTitles>
						Donation received
					</ContributeCardTitles>
					<H2>{user.projectsCount}</H2>
					<H5>${roundNumber(user.totalReceived)}</H5>
				</ContributeCard>
			</ContributeCardContainer>
		</CustomContainer>
	);
};

const UserContributeTitle = styled(H5)`
	margin-bottom: 16px;
`;

const ContributeCardContainer = styled(Flex)`
	gap: 32px;
	justify-content: space-between;
	${mediaQueries.mobileS} {
		flex-direction: column;
		align-items: center;
	}
	${mediaQueries.tablet} {
		flex-direction: row;
	}
	${mediaQueries.laptop} {
		flex-direction: row;
	}
`;

const ContributeCard = styled.div`
	background: ${brandColors.giv['000']};
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 12px;
	display: grid;
	padding: 24px;
	width: 556px;
	grid-template-columns: 1fr 1fr;
	${mediaQueries.mobileS} {
		width: 100%;
	}
`;

const ContributeCardTitles = styled(Subline)`
	text-transform: uppercase;
`;

const CustomContainer = styled(Container)`
	padding: 0;
`;

export default PublicProfileContributeCard;
