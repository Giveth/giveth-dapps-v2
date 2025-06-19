// services/causesService.ts

import { client } from '@/apollo/apolloClient';
import { FETCH_ALL_CAUSES } from '@/apollo/gql/gqlCauses';
import { IMainCategory, ICause } from '@/apollo/types/types';
import { getMainCategorySlug } from '@/helpers/projects';

export interface IQueries {
	skip?: number;
	limit?: number;
	connectedWalletUserId?: number;
	mainCategory?: string;
	qfRoundSlug?: string | null;
}

export interface Page {
	data: ICause[];
	previousCursor?: number;
	nextCursor?: number;
	totalCount?: number;
}

export const fetchCauses = async (
	pageParam: number,
	variables: IQueries,
	contextVariables: any,
	isArchivedQF?: boolean,
	selectedMainCategory?: IMainCategory,
	routerQuerySlug?: string | string[],
): Promise<Page> => {
	const currentPage = pageParam;

	const res = await client.query({
		query: FETCH_ALL_CAUSES,
		variables: {
			...variables,
			...contextVariables,
			mainCategory: isArchivedQF
				? undefined
				: getMainCategorySlug(selectedMainCategory),
			qfRoundSlug: isArchivedQF ? routerQuerySlug : null,
		},
	});

	const dataCauses: ICause[] = res.data?.allCauses?.causes;

	return {
		data: dataCauses,
		previousCursor: currentPage > 0 ? currentPage - 1 : undefined,
		nextCursor: dataCauses.length > 0 ? currentPage + 1 : undefined,
		totalCount: res.data?.allCauses?.totalCount,
	};
};
