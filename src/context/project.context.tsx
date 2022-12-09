import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react';
import { captureException } from '@sentry/nextjs';
import BigNumber from 'bignumber.js';
import config from '@/configuration';
import { IPowerBoostingWithUserGIVpower } from '@/components/views/project/projectGIVPower';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_PROJECTED_RANK,
	FETCH_PROJECT_BOOSTERS,
} from '@/apollo/gql/gqlPowerBoosting';
import { FETCH_USERS_GIVPOWER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { IPowerBoosting } from '@/apollo/types/types';
import { formatWeiHelper } from '@/helpers/number';
import { backendGQLRequest, gqlRequest } from '@/helpers/requests';
import { showToastError } from '@/lib/helpers';

interface IBoostersData {
	powerBoostings: IPowerBoostingWithUserGIVpower[];
	totalPowerBoosting: string;
	totalCount: number;
}

interface IProjectContext {
	boostersData?: IBoostersData;
	projectedRank?: number | null;
	isBoostingsLoading: boolean;
	fetchProjectBoosters: (projectId: number) => Promise<void>;
}

const ProjectContext = createContext<IProjectContext>({
	isBoostingsLoading: false,
	fetchProjectBoosters: () =>
		Promise.reject('fetchProjectBoosters not initialed yet!'),
});
ProjectContext.displayName = 'ProjectContext';

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
	const [boostersData, setBoostersData] = useState<IBoostersData>();
	const [isBoostingsLoading, setIsBoostingsLoading] = useState(false);
	const [projectedRank, setProjectedRank] = useState<
		number | undefined | null
	>(undefined);

	const fetchProjectBoosters = useCallback(async (projectId: number) => {
		setIsBoostingsLoading(true);
		if (projectId) {
			try {
				//get users with percentage
				// we have to handle pagination in the frontend because we need to calculate sum in here and we need all data together.
				const boostingResp = await client.query({
					query: FETCH_PROJECT_BOOSTERS,
					variables: {
						projectId: +projectId,
					},
				});

				if (!boostingResp) {
					setIsBoostingsLoading(false);
					return;
				}

				const _users =
					boostingResp.data.getPowerBoosting.powerBoostings.map(
						(boosting: IPowerBoosting) =>
							boosting.user.walletAddress?.toLocaleLowerCase(),
					);

				if (!_users || _users.length === 0) {
					setIsBoostingsLoading(false);
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

				let _total = new BigNumber(0);

				for (let i = 0; i < _boostersData.powerBoostings.length; i++) {
					const powerBoosting = _boostersData.powerBoostings[i];
					powerBoosting.user.givpowerBalance =
						unipoolBalancesObj[powerBoosting.user.walletAddress];
					const _allocated = new BigNumber(
						powerBoosting.user.givpowerBalance,
					)
						.multipliedBy(powerBoosting.percentage)
						.div(100);
					powerBoosting.user.allocated = _allocated;
					_total = _total.plus(_allocated);
				}
				_boostersData.powerBoostings.sort((pb1, pb2) =>
					pb1.user.allocated.gt(pb2.user.allocated) ? -1 : 1,
				);
				_boostersData.totalPowerBoosting = formatWeiHelper(_total);
				const _projectedRank = await backendGQLRequest(
					FETCH_PROJECTED_RANK,
					{
						powerAmount: +_total
							.div(10 ** 18)
							.toFixed(2, BigNumber.ROUND_UP),
					},
				);
				if (_projectedRank?.data?.powerAmountRank) {
					setProjectedRank(_projectedRank?.data?.powerAmountRank);
				} else setProjectedRank(null);
				setBoostersData(_boostersData);
			} catch (err) {
				showToastError(err);
				captureException(err, {
					tags: { section: 'fetchProjectBoosters' },
				});
			}
		}
		setIsBoostingsLoading(false);
	}, []);

	return (
		<ProjectContext.Provider
			value={{
				boostersData,
				projectedRank,
				isBoostingsLoading,
				fetchProjectBoosters,
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
};

export function useProjectContext() {
	const context = useContext(ProjectContext);

	if (!context) {
		throw new Error('Project context not found!');
	}

	return context;
}
