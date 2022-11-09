import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import GIVPowerHeader from './GIVPowerHeader';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { IProjectPower, IUserProjectPowers } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { Flex } from '@/components/styled-components/Flex';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BOOSTINGS } from '@/apollo/gql/gqlPowerBoosting';
import { showToastError } from '@/lib/helpers';

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
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const hasGivPower = boostingsData ? boostingsData.totalCount > 0 : false;
	const totalCount = boostingsData?.totalCount ?? 0;

	useEffect(() => {
		const fetchProjectBoostings = async () => {
			setLoading(true);
			if (projectId) {
				try {
					const { data } = await client.query({
						query: FETCH_PROJECT_BOOSTINGS,
						variables: {
							projectId: +projectId,
							take: itemPerPage,
							skip: page * itemPerPage,
						},
						fetchPolicy: 'network-only',
					});
					const { userProjectPowers } = data;
					setBoostingsData(
						(userProjectPowers as IUserProjectPowers) ?? [],
					);
					console.log('userProjectPowers', userProjectPowers);
				} catch (err) {
					showToastError(err);
					captureException(err, {
						tags: { section: 'createProjectFetchCategories' },
					});
				}
				// const { data, loading } = await client.query({
				// 	query: FETCH_PROJECT_BOOSTINGS,
				// 	variables: {
				// 		projectId: +projectId,
				// 		take: itemPerPage,
				// 		skip: page * itemPerPage,
				// 	},
				// 	fetchPolicy: 'network-only',
				// });
				// console.log('res', res);
				// .then(
				// 	(res: {
				// 		data: { userProjectPowers: IUserProjectPowers };
				// 	}) => {
				// 		console.log('Res', res?.data);
				// 		setBoostingsData(
				// 			res?.data?.userProjectPowers ?? [],
				// 		);
				// 	},
				// )
				// .catch((error: unknown) => {
				// 	captureException(error, {
				// 		tags: {
				// 			section: 'fetchProjectBoostings',
				// 		},
				// 	});
				// });
			}
			setLoading(false);
		};

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
