import { IUser } from '@/types/entities';
import {
	brandColors,
	Container,
	GLink,
	H2,
	H3,
	H5,
	IconCopy,
	IconExternalLink,
	neutralColors,
	P,
	Subline,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Row } from '../../styled-components/Grid';
import PublicProfileProjects from './PublicProfileProjects';

interface UserPublicProfileView {
	user: IUser;
}

const UserPublicProfileView: FC<UserPublicProfileView> = ({ user }) => {
	return (
		<>
			<PubliCProfileHeader>
				<Container>
					<UserInfoWithAvatarRow>
						{user.avatar ? (
							<img src={user.avatar} alt={user.name} />
						) : (
							<Image
								src='/images/avatar.svg'
								width={128}
								height={128}
								alt='user avatar'
							/>
						)}
						<UserInforRow>
							<H3 weight={700}>{user.name}</H3>
							{user.url && (
								<Website size='Big' href={user.url}>
									{user.url}
								</Website>
							)}
							<WalletContainer>
								<GLink size='Big'>{user.walletAddress}</GLink>
								<WalletIconsContainer>
									<IconCopy />
								</WalletIconsContainer>
								<WalletIconsContainer>
									<IconExternalLink />
								</WalletIconsContainer>
							</WalletContainer>
						</UserInforRow>
					</UserInfoWithAvatarRow>
				</Container>
			</PubliCProfileHeader>
			<UserContributeInfo>
				<Container>
					<UserContributeTitle
						weight={700}
					>{`${user.name}’s donations & projects`}</UserContributeTitle>
					<ContributeCardContainer>
						<ContributeCard>
							<ContributeCardTitles>
								donations
							</ContributeCardTitles>
							<ContributeCardTitles>
								Total amount donated
							</ContributeCardTitles>
							<H2>2</H2>
							<H5>$50.32</H5>
						</ContributeCard>
						<ContributeCard>
							<ContributeCardTitles>
								Projects
							</ContributeCardTitles>
							<ContributeCardTitles>
								Donation received
							</ContributeCardTitles>
							<H2>1</H2>
							<H5>$780.18</H5>
						</ContributeCard>
					</ContributeCardContainer>
				</Container>
			</UserContributeInfo>
			<PublicProfileProjects user={user} />
		</>
	);
};

export default UserPublicProfileView;

const PubliCProfileHeader = styled.div`
	padding: 173px 0 32px;
	background-color: ${neutralColors.gray[100]};
`;

const UserInfoWithAvatarRow = styled(Row)`
	gap: 24px;
`;

const Website = styled(GLink)`
	color: ${brandColors.pinky[500]};
`;

const UserInforRow = styled(Row)`
	flex-direction: column;
	flex: 1;
	justify-content: space-between;
	align-items: flex-start;
`;

const WalletContainer = styled(Row)`
	gap: 18px;
`;

const WalletIconsContainer = styled.div`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

const UserContributeInfo = styled.div`
	padding: 40px 0 60px;
`;

const UserContributeTitle = styled(H5)`
	margin-bottom: 16px;
`;

const ContributeCardContainer = styled(Row)`
	gap: 16px;
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
