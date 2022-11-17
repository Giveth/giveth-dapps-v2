import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import GIVPowerHeader from './GIVPowerHeader';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { IPowerBoosting, IProjectPower } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { Flex } from '@/components/styled-components/Flex';
import { client } from '@/apollo/apolloClient';
import { showToastError } from '@/lib/helpers';
import LoadingAnimation from '@/animations/loading_giv.json';
import LottieControl from '@/components/animations/lottieControl';
import { FETCH_PROJECT_BOOSTERS } from '@/apollo/gql/gqlPowerBoosting';
import { gqlRequest } from '@/helpers/requests';
import config from '@/configuration';
import { FETCH_USERS_GIVPOWER_BY_ADDRESS } from '@/apollo/gql/gqlUser';

interface IPowerBoostingWithUserGIVpower extends Omit<IPowerBoosting, 'user'> {
	user: {
		name: string;
		walletAddress: string;
		totalGIVpowerBalance: string;
	};
}
interface IBoostersData {
	powerBoostings: IPowerBoostingWithUserGIVpower[];
	totalPowerBoosting: string;
	totalCount: number;
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
	const [boostersData, setBoostersData] = useState<IBoostersData>();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const hasGivPower = boostersData ? boostersData.totalCount > 0 : false;
	const totalCount = boostersData?.totalCount ?? 0;

	useEffect(() => {
		const fetchProjectBoosters = async () => {
			setLoading(true);
			if (projectId) {
				try {
					//get users with percentage
					const boostingResp = await client.query({
						query: FETCH_PROJECT_BOOSTERS,
						variables: {
							take: itemPerPage,
							skip: page * itemPerPage,
							projectId: +projectId,
						},
					});

					if (!boostingResp) {
						setLoading(false);
						return;
					}

					const _users =
						boostingResp.data.getPowerBoosting.powerBoostings.map(
							(boosting: IPowerBoosting) =>
								boosting.user.walletAddress?.toLocaleLowerCase(),
						);

					if (!_users || _users.length === 0) {
						setLoading(false);
						return;
					}

					//get users balance
					const balancesResp = await gqlRequest(
						config.XDAI_CONFIG.subgraphAddress,
						false,
						FETCH_USERS_GIVPOWER_BY_ADDRESS,
						{
							addresses: _users,
							contract:
								config.XDAI_CONFIG.GIV.LM_ADDRESS.toLowerCase(),
							length: _users.length,
						},
					);

					const unipoolBalances = balancesResp.data.unipoolBalances;

					const unipoolBalancesObj: { [key: string]: string } = {};

					for (let i = 0; i < unipoolBalances.length; i++) {
						const unipoolBalance = unipoolBalances[i];
						unipoolBalancesObj[unipoolBalance.user.id] =
							unipoolBalance.balance;
					}

					const _boostersData: IBoostersData = structuredClone(
						boostingResp.data.getPowerBoosting,
					);

					for (
						let i = 0;
						i < _boostersData.powerBoostings.length;
						i++
					) {
						const powerBoosting = _boostersData.powerBoostings[i];
						powerBoosting.user.totalGIVpowerBalance =
							unipoolBalancesObj[
								powerBoosting.user.walletAddress
							];
					}
					setBoostersData(_boostersData);
				} catch (err) {
					showToastError(err);
					captureException(err, {
						tags: { section: 'fetchProjectBoosters' },
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
						boostingsData={[]}
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
