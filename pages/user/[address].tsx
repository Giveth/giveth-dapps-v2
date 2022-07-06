import { FC } from 'react';
import dynamic from 'next/dynamic';

import { client } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { IUser } from '@/apollo/types/types';
import UserPublicProfileView from '@/components/views/userPublicProfile/UserPublicProfile.view';
import { GeneralMetatags } from '@/components/Metatag';

interface IUserRouteProps {
	user?: IUser;
}

const NotFound = dynamic(
	() => import('@/components/views/Errors/ErrorsIndex'),
	{
		ssr: false,
	},
);

const UserRoute: FC<IUserRouteProps> = ({ user }) => {
	if (!user) {
		return <NotFound statusCode='404' />;
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
		throw error;
	}
};

export default UserRoute;
