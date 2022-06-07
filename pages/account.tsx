import styled from 'styled-components';
import { H5 } from '@giveth/ui-design-system';
import Head from 'next/head';
import { FC } from 'react';
import UserPublicProfileView from '@/components/views/userPublicProfile/UserPublicProfile.view';
import { useAppSelector } from '@/features/hooks';

const NoUserContainer = styled.div`
	padding: 200px;
`;

const UserRoute: FC = () => {
	const user = useAppSelector(state => state.user.userData);
	return (
		<>
			<Head>
				<title>Giveth | {user?.name}</title>
			</Head>
			{user ? (
				<UserPublicProfileView user={user} myAccount />
			) : (
				<NoUserContainer>
					<H5>Not logged in or user not found</H5>
				</NoUserContainer>
			)}
		</>
	);
};

export default UserRoute;
