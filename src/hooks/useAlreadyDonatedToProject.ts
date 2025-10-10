import { useEffect, useState } from 'react';
import { client } from '@/apollo/apolloClient';
import { FETCH_DOES_DONATED_PROJECT_IN_ROUND } from '@/apollo/gql/gqlQF';
import { IProject, IQFRound } from '@/apollo/types/types';
import { useAppSelector } from '@/features/hooks';
import { hasRoundStarted } from '@/helpers/qf';

export const useAlreadyDonatedToProject = (
	project?: IProject,
	qfRound?: IQFRound,
) => {
	const [alreadyDonated, setAlreadyDonated] = useState(false);
	const { userData } = useAppSelector(state => state.user);

	useEffect(() => {
		if (!userData?.id || !project?.id || !qfRound) return;
		const activeStartedRound = hasRoundStarted(qfRound);
		if (!activeStartedRound) return;
		const doesAlreadyDonated = async () => {
			try {
				const { data } = await client.query({
					query: FETCH_DOES_DONATED_PROJECT_IN_ROUND,
					variables: {
						projectId: Number(project.id),
						qfRoundId: Number(qfRound.id),
						userId: Number(userData.id),
					},
					fetchPolicy: 'no-cache',
				});
				setAlreadyDonated(
					data.doesDonatedToProjectInQfRound as boolean,
				);
			} catch (error) {
				console.error(
					'Error checking if user already donated to project',
					error,
				);
			}
		};
		doesAlreadyDonated();
	}, [userData?.id, project?.id, qfRound]);
	return alreadyDonated;
};
