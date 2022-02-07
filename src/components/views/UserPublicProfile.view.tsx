import { IUser } from '@/types/entities';
import {
	brandColors,
	Container,
	GLink,
	H3,
	IconCopy,
	IconExternalLink,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Row } from '../styled-components/Grid';

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
