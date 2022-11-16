import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import GIVPowerHeader from './GIVPowerHeader';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { IProjectPower, IUserProjectPowers } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { Flex } from '@/components/styled-components/Flex';
import { client } from '@/apollo/apolloClient';
import { showToastError } from '@/lib/helpers';
import LoadingAnimation from '@/animations/loading_giv.json';
import LottieControl from '@/components/animations/lottieControl';
import { FETCH_PROJECT_BOOSTERS } from '@/apollo/gql/gqlPowerBoosting';

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
		const fetchProjectBoosters = async () => {
			setLoading(true);
			if (projectId) {
				try {
					const { data } = await client.query({
						query: FETCH_PROJECT_BOOSTERS,
						variables: {
							take: itemPerPage,
							skip: page * itemPerPage,
							projectId: +projectId,
						},
					});
					const { userProjectPowers } = data;
					setBoostingsData(
						(userProjectPowers as IUserProjectPowers) ?? [],
					);
				} catch (err) {
					showToastError(err);
					captureException(err, {
						tags: { section: 'fetchProjectBoostings' },
					});
				}
			}
			setLoading(false);
		};

		fetchProjectBoosters();
	}, [page]);

	if (loading)
		return <LottieControl animationData={LoadingAnimation} size={150} />;

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
