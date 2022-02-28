import styled from 'styled-components';
import { H5 } from '@giveth/ui-design-system';
import { parseCookies } from '@/lib/helpers';

import { client } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';

import { IUser } from '@/apollo/types/types';
import UserPublicProfileView from '@/components/views/userPublicProfile/UserPublicProfile.view';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FC } from 'react';

interface IUserRouteProps {
	user: IUser;
}

const NoUserContainer = styled.div`
	padding: 200px;
`;

const UserRoute: FC<IUserRouteProps> = ({ user }) => {
	return (
		<>
			<Head>
				<title>Giveth | {user?.name}</title>
			</Head>
			{user ? (
				<UserPublicProfileView user={user} myAccount={true} />
			) : (
				<NoUserContainer>
					<H5>Not logged in or user not found</H5>
				</NoUserContainer>
			)}
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { req } = context;
	const data = parseCookies(req);
	const userFromCookie = data.giveth_user
		? JSON.parse(data.giveth_user)
		: null;
	let user = null;
	if (userFromCookie) {
		const { data: userData } = await client.query({
			query: GET_USER_BY_ADDRESS,
			fetchPolicy: 'no-cache',
			variables: {
				address: userFromCookie?.walletAddress,
			},
		});
		user = userData?.userByAddress;
	}

	return {
		props: {
			user: user,
		},
	};
};

export default UserRoute;
