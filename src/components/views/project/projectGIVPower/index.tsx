import { FC, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Col, Row } from '@giveth/ui-design-system';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { IPowerBoosting } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { Flex } from '@/components/styled-components/Flex';
import LoadingAnimation from '@/animations/loading_giv.json';
import LottieControl from '@/components/LottieControl';
import { useProjectContext } from '@/context/project.context';
import { GIVpowerCard } from './GIVpowerCard';

export interface IPowerBoostingWithUserGIVpower
	extends Omit<IPowerBoosting, 'user'> {
	user: {
		name: string;
		walletAddress: string;
		allocated: BigNumber;
		givpowerBalance: string;
	};
}
interface IProjectGIVPowerIndexProps {}

const itemPerPage = 10;

const ProjectGIVPowerIndex: FC<IProjectGIVPowerIndexProps> = () => {
	const [page, setPage] = useState(0);

	const { isBoostingsLoading, boostersData, projectData } =
		useProjectContext();
	const { verified } = projectData || {};
	const hasGivPower = boostersData ? boostersData.totalCount > 0 : false;
	const totalCount = boostersData?.totalCount ?? 0;

	if (isBoostingsLoading)
		return <LottieControl animationData={LoadingAnimation} size={250} />;

	return hasGivPower ? (
		<>
			<Row>
				<Col lg={8}>
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
							totalCount={
								boostersData?.powerBoostings.length || 0
							}
							currentPage={page}
							setPage={setPage}
							itemPerPage={itemPerPage}
						/>
					</Flex>
				</Col>
				<Col lg={4}>
					<GIVpowerCard />
				</Col>
			</Row>
		</>
	) : (
		<NoBoost />
	);
};

export default ProjectGIVPowerIndex;
