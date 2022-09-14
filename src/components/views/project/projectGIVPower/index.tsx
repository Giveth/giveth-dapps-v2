import { captureException } from '@sentry/nextjs';
import { useEffect, useState } from 'react';
import GIVPowerHeader from './GIVPowerHeader';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BOOSTINGS } from '@/apollo/gql/gqlPowerBoosting';
import { IProjectPower, IUserProjectPowers } from '@/apollo/types/types';

interface ProjectGIVPowerIndexProps {
	userId?: string;
	projectId: string;
	projectPower?: IProjectPower;
}

const ProjectGIVPowerIndex = ({
	projectId,
	projectPower,
}: ProjectGIVPowerIndexProps) => {
	const [boostingsData, setBoostingsData] = useState<IUserProjectPowers>();
	console.log('Count', boostingsData);
	const hasGivPower = boostingsData ? boostingsData.totalCount > 0 : false;
	const fetchProjectBoostings = async () => {
		if (projectId) {
			client
				.query({
					query: FETCH_PROJECT_BOOSTINGS,
					variables: {
						projectId: +projectId,
						take: 50,
						skip: 0,
					},
					fetchPolicy: 'network-only',
				})
				.then(
					(res: {
						data: { userProjectPowers: IUserProjectPowers };
					}) => {
						console.log('Res', res?.data);
						setBoostingsData(res?.data?.userProjectPowers ?? []);
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
			<GIVPowerHeader projectPower={projectPower} />
			{hasGivPower ? (
				<GIVPowerTable
					boostingsData={boostingsData?.userProjectPowers ?? []}
					totalCount={boostingsData?.totalCount ?? 0}
				/>
			) : (
				<NoBoost />
			)}
		</>
	);
};

export default ProjectGIVPowerIndex;
