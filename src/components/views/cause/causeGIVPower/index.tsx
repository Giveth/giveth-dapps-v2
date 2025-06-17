import { FC, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Col, Row, Flex } from '@giveth/ui-design-system';
import CauseGIVPowerTable from '@/components/views/cause/causeGIVPower/CauseGIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { IPowerBoosting } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { CauseGIVpowerCard } from '@/components/views/cause/causeGIVPower/CauseGIVpowerCard';
import { WrappedSpinner } from '@/components/Spinner';
import { useCauseContext } from '@/context/cause.context';

export interface IPowerBoostingWithUserGIVpower
	extends Omit<IPowerBoosting, 'user'> {
	user: {
		name: string;
		walletAddress: string;
		allocated: BigNumber;
		givpowerBalance: string;
	};
}
const itemPerPage = 10;

const CauseGIVPowerIndex: FC = () => {
	const [page, setPage] = useState(0);

	const { isBoostingsLoading, boostersData, causeData } = useCauseContext();
	const hasGivPower = boostersData ? boostersData.totalCount > 0 : false;
	if (isBoostingsLoading) return <WrappedSpinner size={250} />;

	return hasGivPower ? (
		<>
			<Row>
				<Col lg={8}>
					<CauseGIVPowerTable
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
				{causeData?.isGivbackEligible && (
					<Col lg={4}>
						<CauseGIVpowerCard />
					</Col>
				)}
			</Row>
		</>
	) : (
		<NoBoost />
	);
};

export default CauseGIVPowerIndex;
