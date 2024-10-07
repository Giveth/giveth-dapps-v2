// services/projectsService.ts

import { client } from '@/apollo/apolloClient';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { IMainCategory, IProject } from '@/apollo/types/types';
import { getMainCategorySlug } from '@/helpers/projects';

export interface IQueries {
	skip?: number;
	limit?: number;
	connectedWalletUserId?: number;
	mainCategory?: string;
	qfRoundSlug?: string | null;
}

export interface Page {
	data: IProject[];
	previousCursor?: number;
	nextCursor?: number;
	totalCount?: number;
}

export const fetchProjects = async (
	pageParam: number,
	variables: IQueries,
	contextVariables: any,
	isArchivedQF?: boolean,
	selectedMainCategory?: IMainCategory,
	routerQuerySlug?: string | string[],
): Promise<Page> => {
	const currentPage = pageParam;

	const res = await client.query({
		query: FETCH_ALL_PROJECTS,
		variables: {
			...variables,
			...contextVariables,
			mainCategory: isArchivedQF
				? undefined
				: getMainCategorySlug(selectedMainCategory),
			qfRoundSlug: isArchivedQF ? routerQuerySlug : null,
		},
	});

	const dataProjects: IProject[] = res.data?.allProjects?.projects;

	return {
		data: dataProjects,
		previousCursor: currentPage > 0 ? currentPage - 1 : undefined,
		nextCursor: dataProjects.length > 0 ? currentPage + 1 : undefined,
		totalCount: res.data?.allProjects?.totalCount,
	};
};
