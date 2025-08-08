import { client } from '@/apollo/apolloClient';
import {
	FETCH_CAUSES_BY_USER_ID,
	FETCH_USER_CAUSES,
} from '@/apollo/gql/gqlCauses';
import { IProject } from '@/apollo/types/types';
import { IOrder } from '../projectsTab/type';
import { userProjectsPerPage } from '../projectsTab/constants';

export const fetchUserCauses = async (
	userId: string,
	page: number,
	order: IOrder,
) => {
	const { data } = await client.query({
		query: FETCH_USER_CAUSES,
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

export const fetchUserCausesAdmin = async (userId: string, page: number) => {
	const { data } = await client.query({
		query: FETCH_CAUSES_BY_USER_ID,
		variables: {
			userId: parseFloat(userId || '') || -1,
			take: userProjectsPerPage,
			skip: page * userProjectsPerPage,
		},
		fetchPolicy: 'network-only',
	});
	return data.causesByUserId as {
		projects: IProject[];
		totalCount: number;
	};
};
