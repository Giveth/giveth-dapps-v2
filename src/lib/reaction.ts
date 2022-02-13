import { IReaction } from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import {
	LIKE_PROJECT_MUTATION,
	UNLIKE_PROJECT_MUTATION,
} from '@/apollo/gql/gqlProjects';

export const likeProject = async (
	projectId: number | string,
): Promise<IReaction | undefined> => {
	const { data } = await client.mutate({
		mutation: LIKE_PROJECT_MUTATION,
		variables: {
			projectId: Number(projectId),
		},
	});

	return data.likeProject;
};

export const unlikeProject = async (
	reactionId: number | string,
): Promise<boolean> => {
	const { data } = await client.mutate({
		mutation: UNLIKE_PROJECT_MUTATION,
		variables: {
			reactionId: Number(reactionId),
		},
	});

	return data.unlikeProject;
};
