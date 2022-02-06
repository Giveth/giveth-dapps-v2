import { IUser } from '@/types/entities';
import { Container, GLink, H3 } from '@giveth/ui-design-system';
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
								<GLink size='Big' href={user.url}>
									{user.url}
								</GLink>
							)}
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
`;

const UserInfoWithAvatarRow = styled(Row)`
	gap: 24px;
`;

const UserInforRow = styled(Row)`
	flex-direction: column;
`;
