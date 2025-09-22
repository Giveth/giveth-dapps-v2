// services/projectsService.ts

import { client } from '@/apollo/apolloClient';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { FETCH_QF_PROJECTS } from '@/apollo/gql/gqlQF';
import { EProjectType } from '@/apollo/types/gqlEnums';
import { IMainCategory, IProject } from '@/apollo/types/types';
import { getMainCategorySlug } from '@/helpers/projects';

export interface IQueries {
	skip?: number;
	limit?: number;
	connectedWalletUserId?: number;
	mainCategory?: string;
	qfRoundSlug?: string | null;
	projectType?: EProjectType;
	qfRoundId?: number;
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
	qfRoundId?: number,
): Promise<Page> => {
	const currentPage = pageParam;

	if (qfRoundId && qfRoundId > 0) {
		variables.qfRoundId = qfRoundId;
	}

	const res = await client.query({
		query:
			qfRoundId && qfRoundId > 0 ? FETCH_QF_PROJECTS : FETCH_ALL_PROJECTS,
		variables: {
			...variables,
			...contextVariables,
			mainCategory: isArchivedQF
				? undefined
				: getMainCategorySlug(selectedMainCategory),
			qfRoundSlug: isArchivedQF ? routerQuerySlug : null,
		},
	});

	let projectsData = [];

	if (qfRoundId && qfRoundId > 0) {
		projectsData = res.data?.qfProjects?.projects;
	} else {
		projectsData = res.data?.allProjects?.projects;
	}

	return {
		data: projectsData,
		previousCursor: currentPage > 0 ? currentPage - 1 : undefined,
		nextCursor: projectsData.length > 0 ? currentPage + 1 : undefined,
		totalCount: qfRoundId
			? res.data?.qfProjects?.totalCount
			: res.data?.allProjects?.totalCount,
	};
};
