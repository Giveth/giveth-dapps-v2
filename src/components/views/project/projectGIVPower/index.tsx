import { captureException } from '@sentry/nextjs';
import { useEffect, useState } from 'react';
import GIVPowerHeader from './GIVPowerHeader';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BOOSTINGS } from '@/apollo/gql/gqlPowerBoosting';
import { IUserProjectPowers } from '@/apollo/types/types';

interface ProjectGIVPowerIndexProps {
	userId?: string;
	projectId: string;
}

const ProjectGIVPowerIndex = ({
	userId,
	projectId,
}: ProjectGIVPowerIndexProps) => {
	const [boostingsData, setBoostingsData] = useState<IUserProjectPowers>();
	console.log('Count', boostingsData);
	const hasGivPower = boostingsData ? boostingsData.totalCount > 0 : false;
	const fetchProjectBoostings = async () => {
		if (userId && projectId) {
			client
				.query({
					query: FETCH_PROJECT_BOOSTINGS,
					variables: {
						projectId: +projectId,
						userId: +userId,
						take: 50,
						skip: 0,
					},
					fetchPolicy: 'network-only',
				})
				.then(
					(res: {
						data: { userProjectPowers: IUserProjectPowers };
					}) => {
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
			<GIVPowerHeader />
			{hasGivPower ? (
				<GIVPowerTable
					boostingsData={boostingsData?.userProjectPowers ?? []}
				/>
			) : (
				<NoBoost />
			)}
		</>
	);
};

export default ProjectGIVPowerIndex;
