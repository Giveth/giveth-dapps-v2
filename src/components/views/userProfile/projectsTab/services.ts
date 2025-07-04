import { client } from '@/apollo/apolloClient';
import { IOrder } from './type';
import { FETCH_USER_PROJECTS } from '@/apollo/gql/gqlUser';
import { userProjectsPerPage } from './constants';
import { IProject } from '@/apollo/types/types';

export const fetchUserProjects = async (
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
			projectType: 'project',
		},
		fetchPolicy: 'network-only',
	});
	return data.projectsByUserId as {
		projects: IProject[];
		totalCount: number;
	};
};
