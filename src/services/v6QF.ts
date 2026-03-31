import config from '@/configuration';
import { gqlRequest } from '@/helpers/requests';
import {
	buildV6ProjectUrl,
	getActiveV6QfRound,
	IV6Project,
	V6_PROJECT_BY_ID_WITH_QF_ROUNDS_QUERY,
} from '@/lib/helpers/v6QF';

interface IV6ProjectByIdResponse {
	data?: {
		project?: IV6Project | null;
	};
	errors?: {
		message: string;
	}[];
}

export interface IV6ActiveQfProjectRedirect {
	projectSlug: string;
	projectTitle: string;
	redirectUrl: string;
}

export const V6_ACTIVE_QF_PROJECT_REDIRECT_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const fetchV6ActiveQfProjectRedirect = async (projectId: number) => {
	if (!config.V6_FRONTEND_LINK || !config.V6_GRAPHQL_ENDPOINT) {
		return null;
	}

	const response = (await gqlRequest(
		config.V6_GRAPHQL_ENDPOINT,
		false,
		V6_PROJECT_BY_ID_WITH_QF_ROUNDS_QUERY,
		{ id: projectId },
	)) as IV6ProjectByIdResponse;

	if (response.errors?.length) {
		throw new Error(response.errors[0].message);
	}

	const project = response.data?.project;
	if (!project?.slug || !getActiveV6QfRound(project)) {
		return null;
	}

	return {
		projectSlug: project.slug,
		projectTitle: project.title,
		redirectUrl: buildV6ProjectUrl(config.V6_FRONTEND_LINK, project.slug),
	};
};

export const getV6ActiveQfProjectRedirect = async (projectId?: number) => {
	if (!projectId || Number.isNaN(projectId)) {
		return null;
	}

	try {
		return await fetchV6ActiveQfProjectRedirect(projectId);
	} catch (error) {
		console.error('Error fetching v6 QF round data:', error);
		return null;
	}
};

export const qcOptions = (projectId: number) => {
	return {
		queryKey: ['v6-active-qf-project-redirect', projectId],
		queryFn: () => getV6ActiveQfProjectRedirect(projectId),
		staleTime: V6_ACTIVE_QF_PROJECT_REDIRECT_STALE_TIME,
		gcTime: V6_ACTIVE_QF_PROJECT_REDIRECT_STALE_TIME * 5,
	};
};
