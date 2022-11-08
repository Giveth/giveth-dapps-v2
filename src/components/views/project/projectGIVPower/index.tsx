import { captureException } from '@sentry/nextjs';
import { useEffect, useState } from 'react';
import GIVPowerHeader from './GIVPowerHeader';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BOOSTINGS } from '@/apollo/gql/gqlPowerBoosting';
import { IProjectPower, IUserProjectPowers } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { Flex } from '@/components/styled-components/Flex';

interface ProjectGIVPowerIndexProps {
	userId?: string;
	projectId: string;
	projectPower?: IProjectPower;
	projectFuturePower?: IProjectPower;
	isAdmin: boolean;
}

const itemPerPage = 10;

const ProjectGIVPowerIndex = ({
	projectId,
	projectPower,
	projectFuturePower,
	isAdmin,
}: ProjectGIVPowerIndexProps) => {
	const [boostingsData, setBoostingsData] = useState<IUserProjectPowers>();
	const [page, setPage] = useState(0);
	const hasGivPower = boostingsData ? boostingsData.totalCount > 0 : false;
	const totalCount = boostingsData?.totalCount ?? 0;
	console.log('projectFuturePower', projectFuturePower);
	const fetchProjectBoostings = async () => {
		if (projectId) {
			client
				.query({
					query: FETCH_PROJECT_BOOSTINGS,
					variables: {
						projectId: +projectId,
						take: itemPerPage,
						skip: page * itemPerPage,
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
	}, [page]);

	return (
		<>
			<GIVPowerHeader
				projectPower={projectPower}
				projectFuturePower={projectFuturePower}
			/>
			{hasGivPower ? (
				<>
					<GIVPowerTable
						boostingsData={boostingsData?.userProjectPowers ?? []}
						projectPower={projectPower}
					/>
					<Flex justifyContent='flex-end'>
						<Pagination
							totalCount={totalCount}
							currentPage={page}
							setPage={setPage}
							itemPerPage={itemPerPage}
						/>
					</Flex>
				</>
			) : (
				<NoBoost isAdmin={isAdmin} />
			)}
		</>
	);
};

export default ProjectGIVPowerIndex;
