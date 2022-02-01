import { client } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { GetServerSideProps } from 'next';

const UserRoute = () => {
	return <div>User: NoBody :D</div>;
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { query } = context;
	const queryAddress = query.address;
	if (!queryAddress) return { props: {} };
	const address = Array.isArray(queryAddress)
		? queryAddress[0].toLowerCase()
		: queryAddress.toLowerCase();
	const { data: userData } = await client.query({
		query: `${GET_USER_BY_ADDRESS}`,
		variables: {
			address: address,
		},
	});
	const user = userData?.userByAddress;
	console.log('user', user);
	return {
		props: {
			user,
		},
	};
};

export default UserRoute;
