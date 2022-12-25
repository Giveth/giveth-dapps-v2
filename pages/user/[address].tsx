import { GetServerSideProps } from 'next';
import { FC } from 'react';

import { client } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { IUser } from '@/apollo/types/types';
import UserProfileView from '@/components/views/userProfile/UserProfile.view';
import { GeneralMetatags } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import ErrorsIndex from '@/components/views/Errors/ErrorsIndex';

interface IUserRouteProps {
	user?: IUser;
}

const UserRoute: FC<IUserRouteProps> = ({ user }) => {
	// When user is not found, GQL doesn't return any error. After backend is fixed, this can be deleted.
	if (!user) {
		return <ErrorsIndex statusCode='404' />;
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
			<UserProfileView user={user} />
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
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
			fetchPolicy: 'no-cache',
		});
		const user = userData?.userByAddress;
		return {
			props: {
				user,
			},
		};
	} catch (error: any) {
		const statusCode = transformGraphQLErrorsToStatusCode(
			error?.graphQLErrors,
		);
		return {
			props: {
				errorStatus: statusCode,
			},
		};
	}
};

export default UserRoute;
