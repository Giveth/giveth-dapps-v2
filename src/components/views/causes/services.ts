// services/causesService.ts

import { ICause } from '@/apollo/types/types';

export interface IQueries {
	skip?: number;
	limit?: number;
	connectedWalletUserId?: number;
	mainCategory?: string;
	qfRoundSlug?: string | null;
	projectType?: string;
}

export interface Page {
	data: ICause[];
	previousCursor?: number;
	nextCursor?: number;
	totalCount?: number;
}
