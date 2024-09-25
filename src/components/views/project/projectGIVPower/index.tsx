import { FC, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Col, Row, Flex } from '@giveth/ui-design-system';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { IPowerBoosting } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { useProjectContext } from '@/context/project.context';
import { GIVpowerCard } from './GIVpowerCard';
import { WrappedSpinner } from '@/components/Spinner';

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
	const hasGivPower = boostersData ? boostersData.totalCount > 0 : false;
	const isVerified = projectData?.verified;
	const isGivbackEligible = projectData?.isGivbackEligible;
	const isVerifiedNotGivbacksEligible = isVerified && !isGivbackEligible;
	if (isBoostingsLoading) return <WrappedSpinner size={250} />;

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
					<Flex $justifyContent='flex-end'>
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
				{!isVerifiedNotGivbacksEligible && (
					<Col lg={4}>
						<GIVpowerCard />
					</Col>
				)}
			</Row>
		</>
	) : (
		<NoBoost />
	);
};

export default ProjectGIVPowerIndex;
