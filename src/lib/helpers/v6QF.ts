import { getNowUnixMS } from '@/helpers/time';

export interface IV6QFRound {
	id: number | string;
	isActive: boolean;
	beginDate: string;
	endDate: string;
}

export interface IV6Project {
	id: number | string;
	slug: string;
	title: string;
	qfRounds?: IV6QFRound[];
}

export const V6_PROJECT_BY_ID_WITH_QF_ROUNDS_QUERY = `
	query ProjectById($id: Int!) {
		project(id: $id) {
			id
			slug
			title
			qfRounds {
				id
				isActive
				beginDate
				endDate
			}
		}
	}
`;

export const isV6QfRoundCurrentlyActive = (round?: IV6QFRound | null) => {
	if (!round?.isActive) return false;

	const now = getNowUnixMS();
	const beginDate = new Date(round.beginDate).getTime();
	const endDate = new Date(round.endDate).getTime();

	return beginDate <= now && now <= endDate;
};

export const getActiveV6QfRound = (project?: IV6Project | null) => {
	return project?.qfRounds?.find(round => isV6QfRoundCurrentlyActive(round));
};

export const buildV6ProjectUrl = (baseUrl: string, projectSlug: string) => {
	const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
	return new URL(`project/${projectSlug}`, normalizedBaseUrl).toString();
};
