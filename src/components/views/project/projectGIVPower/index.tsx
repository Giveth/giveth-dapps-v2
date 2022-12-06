import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import GIVPowerHeader from './GIVPowerHeader';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { IPowerBoosting, IProjectPower } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { Flex } from '@/components/styled-components/Flex';
import LoadingAnimation from '@/animations/loading_giv.json';
import LottieControl from '@/components/animations/lottieControl';
import { useProjectContext } from '@/context/project.context';

export interface IPowerBoostingWithUserGIVpower
	extends Omit<IPowerBoosting, 'user'> {
	user: {
		name: string;
		walletAddress: string;
		allocated: BigNumber;
		givpowerBalance: string;
	};
}
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
	const [page, setPage] = useState(0);

	const { fetchProjectBoosters, isBoostingsLoading, boostersData } =
		useProjectContext();

	const hasGivPower = boostersData ? boostersData.totalCount > 0 : false;
	const totalCount = boostersData?.totalCount ?? 0;

	useEffect(() => {
		fetchProjectBoosters(+projectId);
	}, [projectId]);

	if (isBoostingsLoading)
		return <LottieControl animationData={LoadingAnimation} size={150} />;

	return (
		<>
			{hasGivPower ? (
				<>
					<GIVPowerHeader
						projectPower={projectPower}
						projectFuturePower={projectFuturePower}
					/>
					<GIVPowerTable
						powerBoostings={
							boostersData?.powerBoostings.slice(
								page * itemPerPage,
								(page + 1) * itemPerPage,
							) || []
						}
						totalPowerBoosting={
							boostersData?.totalPowerBoosting || '0'
						}
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
