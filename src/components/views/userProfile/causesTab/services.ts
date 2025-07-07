import { client } from '@/apollo/apolloClient';
import { FETCH_USER_PROJECTS } from '@/apollo/gql/gqlUser';
import { IProject } from '@/apollo/types/types';
import { IOrder } from '../projectsTab/type';
import { userProjectsPerPage } from '../projectsTab/constants';

export const fetchUserCauses = async (
	userId: string,
	page: number,
	order: IOrder,
) => {
	const { data } = await client.query({
		query: FETCH_USER_PROJECTS,
		variables: {
			userId: parseFloat(userId || '') || -1,
			take: userProjectsPerPage,
			skip: page * userProjectsPerPage,
			orderBy: order.by,
			direction: order.direction,
			projectType: 'cause',
		},
		fetchPolicy: 'network-only',
	});
	return data.projectsByUserId as {
		projects: IProject[];
		totalCount: number;
	};
};
