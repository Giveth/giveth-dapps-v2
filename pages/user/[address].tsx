import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FC } from 'react';
import styled from 'styled-components';
import { H3 } from '@giveth/ui-design-system';
import { Container } from '@/components/Grid';

import { client } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { IUser } from '@/apollo/types/types';
import UserPublicProfileView from '@/components/views/userPublicProfile/UserPublicProfile.view';

interface IUserRouteProps {
	user?: IUser;
}

const UserRoute: FC<IUserRouteProps> = ({ user }) => {
	if (!user) {
		return (
			<Container>
				<NotFound>User not found</NotFound>
			</Container>
		);
	}

	return (
		<>
			<Head>
				<title>Giveth | {user.name}</title>
			</Head>
			<UserPublicProfileView user={user} />
		</>
	);
};

const NotFound = styled(H3)`
	margin: 200px 0;
`;

export const getServerSideProps: GetServerSideProps = async context => {
	const { query } = context;
	const queryAddress = query.address;
	if (!queryAddress) return { props: {} };
	const address = Array.isArray(queryAddress)
		? queryAddress[0].toLowerCase()
		: queryAddress.toLowerCase();
	const { data: userData } = await client.query({
		query: GET_USER_BY_ADDRESS,
		variables: {
			address: address,
		},
	});
	const user = userData?.userByAddress;
	return {
		props: {
			user,
		},
	};
};

export default UserRoute;
