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
import { IPowerBoostingWithUserGIVpower } from '@/components/views/project/projectGIVPower';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_PROJECTED_RANK,
	FETCH_PROJECT_BOOSTERS,
} from '@/apollo/gql/gqlPowerBoosting';
import { IPowerBoosting, IProject } from '@/apollo/types/types';
import { formatWeiHelper } from '@/helpers/number';
import { backendGQLRequest } from '@/helpers/requests';
import { compareAddresses, showToastError } from '@/lib/helpers';
import {
	EDirection,
	EDonationStatus,
	EProjectStatus,
	ESortby,
} from '@/apollo/types/gqlEnums';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	ACTIVATE_PROJECT,
	FETCH_PROJECT_BY_SLUG_SINGLE_PROJECT,
} from '@/apollo/gql/gqlProjects';
import { IDonationsByProjectIdGQL } from '@/apollo/types/gqlTypes';
import { FETCH_PROJECT_DONATIONS_COUNT } from '@/apollo/gql/gqlDonations';
import { hasActiveRound } from '@/helpers/qf';
import { getGIVpowerBalanceByAddress } from '@/services/givpower';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';

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
	activateProject: () => Promise<void>;
	projectData?: IProject;
	isActive: boolean;
	isDraft: boolean;
	isAdmin: boolean;
	hasActiveQFRound: boolean;
	totalDonationsCount: number;
	isCancelled: boolean;
	isLoading: boolean;
}

const ProjectContext = createContext<IProjectContext>({
	isBoostingsLoading: false,
	fetchProjectBoosters: (a, b) =>
		Promise.reject('fetchProjectBoosters not initialed yet!'),
	fetchProjectBySlug: () =>
		Promise.reject('fetchProjectBySlug not initialed yet!'),
	activateProject: () => Promise.reject('activateProject not initialed yet!'),
	projectData: undefined,
	isActive: true,
	isDraft: false,
	isAdmin: false,
	hasActiveQFRound: false,
	totalDonationsCount: 0,
	isCancelled: false,
	isLoading: true,
});
ProjectContext.displayName = 'ProjectContext';

export const ProjectProvider = ({
	children,
	project,
}: {
	children: ReactNode;
	project?: IProject;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [totalDonationsCount, setTotalDonationsCount] = useState(0);
	const [boostersData, setBoostersData] = useState<IBoostersData>();
	const [isBoostingsLoading, setIsBoostingsLoading] = useState(false);
	const [projectedRank, setProjectedRank] = useState<
		number | undefined | null
	>(undefined);

	const [projectData, setProjectData] = useState(project);
	const [isCancelled, setIsCancelled] = useState(false);

	const { isSignedIn, userData: user } = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const slug = router.query.projectIdSlug as string;

	const isAdmin = compareAddresses(
		projectData?.adminUser?.walletAddress,
		user?.walletAddress,
	);

	const hasActiveQFRound = hasActiveRound(projectData?.qfRounds);

	const fetchProjectBySlug = useCallback(async () => {
		setIsLoading(true);
		client
			.query({
				query: FETCH_PROJECT_BY_SLUG_SINGLE_PROJECT,
				variables: { slug, connectedWalletUserId: Number(user?.id) },
				fetchPolicy: 'network-only',
			})
			.then((res: { data: { projectBySlug: IProject } }) => {
				const _project = res.data.projectBySlug;
				if (_project.status.name !== EProjectStatus.CANCEL) {
					setProjectData(_project);
				} else {
					setIsCancelled(true);
					setProjectData(undefined);
				}
				setIsLoading(false);
			})
			.catch((error: unknown) => {
				console.log('fetchProjectBySlug error: ', error);
				captureException(error, {
					tags: {
						section: 'fetchProject',
					},
				});
				setIsLoading(false);
			});
	}, [slug, user?.id]);

	const activateProject = async () => {
		try {
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
				return;
			}
			await client.mutate({
				mutation: ACTIVATE_PROJECT,
				variables: { projectId: Number(projectData?.id || '') },
			});
			await fetchProjectBySlug();
		} catch (e) {
			showToastError(e);
			captureException(e, {
				tags: {
					section: 'handleProjectStatus',
				},
			});
		}
	};

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
				setTotalDonationsCount(
					donationsByProjectId.totalCount +
						donationsByProjectId.recurringDonationsCount,
				);
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

					const unipoolBalancesObj =
						await getGIVpowerBalanceByAddress(_users);

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
								powerBoosting.user.walletAddress.toLowerCase()
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
		setIsCancelled(false);
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
				activateProject,
				projectData,
				isActive,
				isDraft,
				isAdmin,
				hasActiveQFRound,
				totalDonationsCount,
				isCancelled,
				isLoading,
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
