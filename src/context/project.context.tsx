import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { captureException } from '@sentry/nextjs';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import config from '@/configuration';
import { IPowerBoostingWithUserGIVpower } from '@/components/views/project/projectGIVPower';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_PROJECTED_RANK,
	FETCH_PROJECT_BOOSTERS,
} from '@/apollo/gql/gqlPowerBoosting';
import { FETCH_USERS_GIVPOWER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { IPowerBoosting, IProject } from '@/apollo/types/types';
import { formatWeiHelper } from '@/helpers/number';
import { backendGQLRequest, gqlRequest } from '@/helpers/requests';
import { compareAddresses, showToastError } from '@/lib/helpers';
import {
	EDirection,
	EDonationStatus,
	EProjectStatus,
	ESortby,
} from '@/apollo/types/gqlEnums';
import { useAppSelector } from '@/features/hooks';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { IDonationsByProjectIdGQL } from '@/apollo/types/gqlTypes';
import { FETCH_PROJECT_DONATIONS_COUNT } from '@/apollo/gql/gqlDonations';
import { hasActiveRound } from '@/helpers/qf';

interface IBoostersData {
	powerBoostings: IPowerBoostingWithUserGIVpower[];
	totalPowerBoosting: string;
	totalCount: number;
}

interface IProjectContext {
	boostersData?: IBoostersData;
	projectedRank?: number | null;
	isBoostingsLoading: boolean;
	fetchProjectBoosters: (
		projectId: number,
		status?: EProjectStatus,
	) => Promise<void>;
	fetchProjectBySlug: () => Promise<void>;
	projectData?: IProject;
	isActive: boolean;
	isDraft: boolean;
	isAdmin: boolean;
	hasActiveQFRound: boolean;
	totalDonationsCount: number;
}

const ProjectContext = createContext<IProjectContext>({
	isBoostingsLoading: false,
	fetchProjectBoosters: (a, b) =>
		Promise.reject('fetchProjectBoosters not initialed yet!'),
	fetchProjectBySlug: () =>
		Promise.reject('fetchProjectBySlug not initialed yet!'),
	projectData: undefined,
	isActive: true,
	isDraft: false,
	isAdmin: false,
	hasActiveQFRound: false,
	totalDonationsCount: 0,
});
ProjectContext.displayName = 'ProjectContext';

export const ProjectProvider = ({
	children,
	project,
}: {
	children: ReactNode;
	project?: IProject;
}) => {
	const [totalDonationsCount, setTotalDonationsCount] = useState(0);
	const [boostersData, setBoostersData] = useState<IBoostersData>();
	const [isBoostingsLoading, setIsBoostingsLoading] = useState(false);
	const [projectedRank, setProjectedRank] = useState<
		number | undefined | null
	>(undefined);

	const [projectData, setProjectData] = useState(project);

	const user = useAppSelector(state => state.user.userData);
	const router = useRouter();
	const slug = router.query.projectIdSlug as string;

	const isAdmin = compareAddresses(
		projectData?.adminUser?.walletAddress,
		user?.walletAddress,
	);

	const hasActiveQFRound = hasActiveRound(projectData?.qfRounds);

	const fetchProjectBySlug = useCallback(async () => {
		client
			.query({
				query: FETCH_PROJECT_BY_SLUG,
				variables: { slug, connectedWalletUserId: Number(user?.id) },
				fetchPolicy: 'network-only',
			})
			.then((res: { data: { projectBySlug: IProject } }) => {
				const _project = res.data.projectBySlug;
				if (_project.status.name !== EProjectStatus.CANCEL) {
					setProjectData(_project);
				} else {
					setProjectData(undefined);
				}
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'fetchProject',
					},
				});
			});
	}, [slug, user?.id]);

	useEffect(() => {
		if (!projectData?.id) return;
		client
			.query({
				query: FETCH_PROJECT_DONATIONS_COUNT,
				variables: {
					projectId: parseInt(projectData.id),
					skip: 0,
					take: 1,
					status: isAdmin ? null : EDonationStatus.VERIFIED,
					orderBy: {
						field: ESortby.CREATION_DATE,
						direction: EDirection.DESC,
					},
				},
			})
			.then((res: IDonationsByProjectIdGQL) => {
				const donationsByProjectId = res.data.donationsByProjectId;
				setTotalDonationsCount(donationsByProjectId.totalCount);
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'fetchProjectDonationsCount',
					},
				});
			});
	}, [isAdmin, projectData?.id]);

	const fetchProjectBoosters = useCallback(
		async (projectId: number, status?: EProjectStatus) => {
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

					for (
						let i = 0;
						i < _boostersData.powerBoostings.length;
						i++
					) {
						const powerBoosting = _boostersData.powerBoostings[i];
						powerBoosting.user.givpowerBalance =
							unipoolBalancesObj[
								powerBoosting.user.walletAddress
							];
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
					_boostersData.powerBoostings =
						_boostersData.powerBoostings.filter(pb =>
							pb.user.allocated.isZero() ? false : true,
						);
					_boostersData.totalPowerBoosting = formatWeiHelper(_total);
					if (status === EProjectStatus.ACTIVE) {
						const _projectedRank = await backendGQLRequest(
							FETCH_PROJECTED_RANK,
							{
								powerAmount: +_total
									.div(10 ** 18)
									.toFixed(2, BigNumber.ROUND_UP),
								projectId: projectId,
							},
						);
						if (_projectedRank?.data?.powerAmountRank) {
							setProjectedRank(
								_projectedRank?.data?.powerAmountRank,
							);
						} else setProjectedRank(null);
					}
					setBoostersData(_boostersData);
				} catch (err) {
					showToastError(err);
					captureException(err, {
						tags: { section: 'fetchProjectBoosters' },
					});
				}
			}
			setIsBoostingsLoading(false);
		},
		[],
	);

	const isActive = projectData?.status.name === EProjectStatus.ACTIVE;
	const isDraft = projectData?.status.name === EProjectStatus.DRAFT;

	useEffect(() => {
		if (user?.isSignedIn && !project) {
			fetchProjectBySlug();
		} else {
			setProjectData(project);
		}
	}, [fetchProjectBySlug, project, user?.isSignedIn]);

	return (
		<ProjectContext.Provider
			value={{
				boostersData,
				projectedRank,
				isBoostingsLoading,
				fetchProjectBoosters,
				fetchProjectBySlug,
				projectData,
				isActive,
				isDraft,
				isAdmin,
				hasActiveQFRound,
				totalDonationsCount,
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
