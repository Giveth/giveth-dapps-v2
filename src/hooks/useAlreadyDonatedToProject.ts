import { useEffect, useState } from 'react';
import { client } from '@/apollo/apolloClient';
import { FETCH_DOES_DONATED_PROJECT_IN_ROUND } from '@/apollo/gql/gqlQF';
import { IProject } from '@/apollo/types/types';
import { useAppSelector } from '@/features/hooks';
import { getActiveRound } from '@/helpers/qf';

export const useAlreadyDonatedToProject = (project?: IProject) => {
	const [alreadyDonated, setAlreadyDonated] = useState(false);
	const { userData } = useAppSelector(state => state.user);

	useEffect(() => {
		if (!userData?.id || !project?.id) return;
		const activeRound = getActiveRound(project?.qfRounds);
		if (!activeRound) return;
		const doesAlreadyDonated = async () => {
			try {
				const { data } = await client.query({
					query: FETCH_DOES_DONATED_PROJECT_IN_ROUND,
					variables: {
						projectId: Number(project.id),
						qfRoundId: Number(activeRound.id),
						userId: Number(userData.id),
					},
					fetchPolicy: 'no-cache',
				});
				setAlreadyDonated(
					data.doesDonatedToProjectInQfRound as boolean,
				);
			} catch (error) {
				console.log('error', error);
			}
		};
		doesAlreadyDonated();
	}, [userData?.id, project?.id, project?.qfRounds]);
	return alreadyDonated;
};
