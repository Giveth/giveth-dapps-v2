import { captureException } from '@sentry/nextjs';
import { useEffect, useState } from 'react';
import GIVPowerHeader from './GIVPowerHeader';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BOOSTINGS } from '@/apollo/gql/gqlPowerBoosting';
import { IPowerBoostingsData } from '@/apollo/types/types';

const hasGivPower = false;

interface ProjectGIVPowerIndexProps {
	userId?: string;
	projectId: string;
}

const ProjectGIVPowerIndex = ({
	userId,
	projectId,
}: ProjectGIVPowerIndexProps) => {
	const [boostingsData, setBoostingsData] = useState<
		IPowerBoostingsData | []
	>([]);
	const fetchProjectBoostings = async () => {
		if (userId && projectId) {
			client
				.query({
					query: FETCH_PROJECT_BOOSTINGS,
					variables: {
						projectId: +projectId,
						userId: +userId,
						take: 50,
					},
					fetchPolicy: 'network-only',
				})
				.then(
					(res: {
						data: { userProjectPowers: IPowerBoostingsData };
					}) => {
						console.log('Res', res);
						setBoostingsData(res?.data?.userProjectPowers);
					},
				)
				.catch((error: unknown) => {
					captureException(error, {
						tags: {
							section: 'fetchProjectBoostings',
						},
					});
				});
		}
	};

	useEffect(() => {
		fetchProjectBoostings();
	}, []);

	return (
		<>
			<GIVPowerHeader />
			{hasGivPower ? <GIVPowerTable /> : <NoBoost />}
		</>
	);
};

export default ProjectGIVPowerIndex;
