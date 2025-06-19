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
import { ICause, IPowerBoosting } from '@/apollo/types/types';
import { formatWeiHelper } from '@/helpers/number';
import { backendGQLRequest } from '@/helpers/requests';
import { compareAddresses, showToastError } from '@/lib/helpers';
import {
	ECauseStatus,
	EDirection,
	EDonationStatus,
	EProjectStatus,
	ESortby,
} from '@/apollo/types/gqlEnums';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { IDonationsByProjectIdGQL } from '@/apollo/types/gqlTypes';
import { FETCH_PROJECT_DONATIONS_COUNT } from '@/apollo/gql/gqlDonations';
import { hasActiveRound } from '@/helpers/qf';
import { getGIVpowerBalanceByAddress } from '@/services/givpower';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import {
	ACTIVATE_CAUSE,
	FETCH_CAUSE_BY_ID_SINGLE_CAUSE,
} from '@/apollo/gql/gqlCauses';

interface IBoostersData {
	powerBoostings: IPowerBoostingWithUserGIVpower[];
	totalPowerBoosting: string;
	totalCount: number;
}

interface ICauseContext {
	boostersData?: IBoostersData;
	projectedRank?: number | null;
	isBoostingsLoading: boolean;
	fetchCauseBoosters: (
		projectId: number,
		status?: EProjectStatus,
	) => Promise<void>;
	fetchCauseBySlug: () => Promise<void>;
	activateCause: () => Promise<void>;
	causeData?: ICause;
	isActive: boolean;
	isDraft: boolean;
	isAdmin: boolean;
	isAdminEmailVerified: boolean;
	hasActiveQFRound: boolean;
	totalDonationsCount: number;
	isCancelled: boolean;
	isLoading: boolean;
}

const CauseContext = createContext<ICauseContext>({
	isBoostingsLoading: false,
	fetchCauseBoosters: (a, b) =>
		Promise.reject('fetchCauseBoosters not initialed yet!'),
	fetchCauseBySlug: () =>
		Promise.reject('fetchProjectBySlug not initialed yet!'),
	activateCause: () => Promise.reject('activateCause not initialed yet!'),
	causeData: undefined,
	isActive: true,
	isDraft: false,
	isAdmin: false,
	isAdminEmailVerified: false,
	hasActiveQFRound: false,
	totalDonationsCount: 0,
	isCancelled: false,
	isLoading: true,
});
CauseContext.displayName = 'CauseContext';

export const CauseProvider = ({
	children,
	cause,
}: {
	children: ReactNode;
	cause?: ICause;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [totalDonationsCount, setTotalDonationsCount] = useState(0);
	const [boostersData, setBoostersData] = useState<IBoostersData>();
	const [isBoostingsLoading, setIsBoostingsLoading] = useState(false);
	const [projectedRank, setProjectedRank] = useState<
		number | undefined | null
	>(undefined);

	const [causeData, setCauseData] = useState(cause);
	const [isCancelled, setIsCancelled] = useState(false);

	const { isSignedIn, userData: user } = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const slug = (router.query.causeIdSlug as string)
		? router.query.causeIdSlug
		: cause?.id;

	const isAdmin = compareAddresses(
		causeData?.owner?.walletAddress,
		user?.walletAddress,
	);

	const isAdminEmailVerified = !!(isAdmin && user?.isEmailVerified);

	const hasActiveQFRound = hasActiveRound(causeData?.qfRounds);

	const fetchCauseBySlug = useCallback(async () => {
		setIsLoading(true);
		client
			//TODO: Remove this after testing add by slug, remove by ID
			// .query({
			// 	query: FETCH_PROJECT_BY_SLUG_SINGLE_PROJECT,
			// 	variables: { slug, connectedWalletUserId: Number(user?.id) },
			// })
			.query({
				query: FETCH_CAUSE_BY_ID_SINGLE_CAUSE,
				variables: { id: Number(cause?.id) },
			})
			.then((res: { data: { causeBySlug: ICause } }) => {
				const _cause = res.data.causeBySlug;
				if (_cause.status !== ECauseStatus.CANCEL) {
					setCauseData(_cause);
				} else {
					setIsCancelled(true);
					setCauseData(undefined);
				}
				setIsLoading(false);
			})
			.catch((error: unknown) => {
				console.error('fetchProjectBySlug error: ', error);
				captureException(error, {
					tags: {
						section: 'fetchProject',
					},
				});
				setIsLoading(false);
			});
	}, [slug, user?.id]);

	const activateCause = async () => {
		try {
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
				return;
			}
			await client.mutate({
				mutation: ACTIVATE_CAUSE,
				variables: { causeId: Number(causeData?.id || '') },
			});
			await fetchCauseBySlug();
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
		if (!causeData?.id) return;
		client
			.query({
				query: FETCH_PROJECT_DONATIONS_COUNT,
				variables: {
					projectId: parseInt(causeData.id),
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
	}, [isAdmin, causeData?.id]);

	const fetchCauseBoosters = useCallback(
		async (projectId: number, status?: EProjectStatus) => {
			setIsBoostingsLoading(true);
			if (projectId) {
				try {
					// get users with percentage
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
								boosting.user?.walletAddress?.toLocaleLowerCase(),
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
								powerBoosting.user?.walletAddress.toLowerCase()
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
						tags: { section: 'fetchCauseBoosters' },
					});
				}
			}
			setIsBoostingsLoading(false);
		},
		[],
	);

	const isActive = causeData?.status === ECauseStatus.ACTIVE;
	const isDraft = causeData?.status === ECauseStatus.DRAFT;

	useEffect(() => {
		if (cause && cause.status === ECauseStatus.CANCEL) {
			setIsCancelled(true);
		} else {
			setIsCancelled(false);
		}

		if (user?.isSignedIn && !cause) {
			fetchCauseBySlug();
		} else {
			setCauseData(cause);
		}
	}, [fetchCauseBySlug, cause, user?.isSignedIn]);

	return (
		<CauseContext.Provider
			value={{
				boostersData,
				projectedRank,
				isBoostingsLoading,
				fetchCauseBoosters,
				fetchCauseBySlug,
				activateCause,
				causeData,
				isActive,
				isDraft,
				isAdmin,
				isAdminEmailVerified,
				hasActiveQFRound,
				totalDonationsCount,
				isCancelled,
				isLoading,
			}}
		>
			{children}
		</CauseContext.Provider>
	);
};

export function useCauseContext() {
	const context = useContext(CauseContext);

	if (!context) {
		throw new Error('Cause context not found!');
	}

	return context;
}
