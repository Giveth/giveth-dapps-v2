import { FC } from 'react';
import styled from 'styled-components';
import { H3 } from '@giveth/ui-design-system';
import { Container } from '@/components/Grid';

import { client } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { IUser } from '@/apollo/types/types';
import UserPublicProfileView from '@/components/views/userPublicProfile/UserPublicProfile.view';
import { GeneralMetatags } from '@/components/Metatag';

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
			<GeneralMetatags
				info={{
					title: `Giveth | ${
						user.name || `${user.firstName} ${user.lastName}`
					} User Profile`,
					desc: 'See the donations, projects & other public information about this user.',
					image:
						user.avatar || 'https://i.ibb.co/HTbdCdd/Thumbnail.png',
					url: `https://giveth.io/user/${user.walletAddress}`,
				}}
			/>
			<UserPublicProfileView user={user} />
		</>
	);
};

const NotFound = styled(H3)`
	margin: 200px 0;
`;

export const getServerSideProps = async (context: any) => {
	try {
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
	} catch (error) {
		throw new Error('Erorr on GET_USER_BY_ADDRESS');
	}
};

export default UserRoute;
