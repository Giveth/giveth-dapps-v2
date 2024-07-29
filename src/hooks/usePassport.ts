import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getPassports } from '@/helpers/passport';
import {
	connectPassport,
	fetchPassportScore,
	scoreUserAddress,
	connectWallet,
} from '@/services/passport';
import { IPassportInfo, IQFRound } from '@/apollo/types/types';
import { getNowUnixMS } from '@/helpers/time';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { useAppSelector, useAppDispatch } from '@/features/hooks';
import { useProjectsContext } from '@/context/projects.context';
import { setUserMBDScore, setUserPassport } from '@/features/user/user.slice';
import { fetchUserByAddress } from '@/features/user/user.thunks';

export enum EPassportState {
	NOT_CONNECTED,
	NOT_SIGNED,
	NOT_CREATED,
	INVALID,
	LOADING_SCORE, // when fetching passport score or refreshing it
	CONNECTING, // connecting to gitcoin passport
	ERROR,
	SIGNED,
}

export enum EQFElegibilityState {
	NOT_SIGNED,
	LOADING,
	PROCESSING,
	NOT_CONNECTED,
	NOT_STARTED,
	NOT_ACTIVE_ROUND,
	ELIGIBLE,
	ENDED,
	ERROR,
	NOT_AVAILABLE_FOR_GSAFE,
	CHECK_ELIGIBILITY,
	MORE_INFO_NEEDED,
	RECHECK_ELIGIBILITY,
}

export interface IPassportAndStateInfo {
	qfEligibilityState: EQFElegibilityState;
	passportState: EPassportState | null;
	passportScore: number | null;
	activeQFMBDScore: number | null;
	currentRound: IQFRound | null;
}

const initialInfo: IPassportAndStateInfo = {
	qfEligibilityState: EQFElegibilityState.LOADING,
	passportState: null,
	activeQFMBDScore: null,
	passportScore: null,
	currentRound: null,
};

export const usePassport = () => {
	const dispatch = useAppDispatch();

	const { address } = useAccount();
	const { isArchivedQF } = useProjectsContext();
	const [info, setInfo] = useState<IPassportAndStateInfo>(initialInfo);
	const { userData: user, isUserFullFilled } = useAppSelector(
		state => state.user,
	);
	const { activeQFRound } = useAppSelector(state => state.general);
	const isSafeEnv = useIsSafeEnvironment();

	const setNotAvailableForGSafe = useCallback(() => {
		setInfo({
			qfEligibilityState: EQFElegibilityState.NOT_AVAILABLE_FOR_GSAFE,
			passportState: null,
			passportScore: null,
			activeQFMBDScore: null,
			currentRound: null,
		});
	}, []);

	const setEndedState = useCallback(() => {
		setInfo({
			qfEligibilityState: EQFElegibilityState.ENDED,
			passportState: null,
			passportScore: null,
			activeQFMBDScore: null,
			currentRound: null,
		});
	}, []);

	const updateState = useCallback(
		async (refreshUserScores: IPassportInfo) => {
			if (isSafeEnv) return setNotAvailableForGSafe();
			if (isArchivedQF) return setEndedState();

			setInfo({
				qfEligibilityState: EQFElegibilityState.LOADING,
				passportState: null,
				activeQFMBDScore: null,
				passportScore: null,
				currentRound: null,
			});

			try {
				if (!refreshUserScores) {
					return setInfo({
						qfEligibilityState: EQFElegibilityState.ERROR,
						passportState: EPassportState.INVALID,
						activeQFMBDScore: null,
						passportScore: null,
						currentRound: null,
					});
				}
				if (!activeQFRound) {
					return setInfo({
						qfEligibilityState:
							EQFElegibilityState.NOT_ACTIVE_ROUND,
						passportState: null,
						activeQFMBDScore: null,
						passportScore: refreshUserScores.passportScore,
						currentRound: null,
					});
				}

				const now = getNowUnixMS();
				if (now < new Date(activeQFRound.beginDate).getTime()) {
					return setInfo({
						qfEligibilityState: EQFElegibilityState.NOT_STARTED,
						passportState: null,
						activeQFMBDScore: null,
						passportScore: refreshUserScores.passportScore,
						currentRound: activeQFRound,
					});
				}

				if (now > new Date(activeQFRound.endDate).getTime()) {
					return setInfo({
						qfEligibilityState: EQFElegibilityState.ENDED,
						passportState: null,
						activeQFMBDScore: null,
						passportScore: refreshUserScores.passportScore,
						currentRound: activeQFRound,
					});
				}

				if (refreshUserScores.activeQFMBDScore == null) {
					return setInfo({
						qfEligibilityState:
							EQFElegibilityState.CHECK_ELIGIBILITY,
						passportState: null,
						activeQFMBDScore: null,
						passportScore: null,
						currentRound: activeQFRound,
					});
				}

				if (
					activeQFRound.minMBDScore != null &&
					refreshUserScores.activeQFMBDScore >=
						activeQFRound.minMBDScore
				) {
					return setInfo({
						qfEligibilityState: EQFElegibilityState.ELIGIBLE,
						passportState: null,
						activeQFMBDScore: refreshUserScores.activeQFMBDScore,
						passportScore: null,
						currentRound: activeQFRound,
					});
				}

				if (refreshUserScores.passportScore === null) {
					return setInfo({
						qfEligibilityState:
							EQFElegibilityState.MORE_INFO_NEEDED,
						passportState: EPassportState.NOT_CREATED,
						passportScore: null,
						activeQFMBDScore: refreshUserScores.activeQFMBDScore,
						currentRound: activeQFRound,
					});
				}

				if (
					refreshUserScores.passportScore <
					activeQFRound.minimumPassportScore
				) {
					return setInfo({
						qfEligibilityState:
							EQFElegibilityState.RECHECK_ELIGIBILITY,
						passportState: EPassportState.SIGNED,
						passportScore: refreshUserScores.passportScore,
						activeQFMBDScore: refreshUserScores.activeQFMBDScore,
						currentRound: activeQFRound,
					});
				} else {
					return setInfo({
						qfEligibilityState: EQFElegibilityState.ELIGIBLE,
						passportState: EPassportState.SIGNED,
						activeQFMBDScore: refreshUserScores.activeQFMBDScore,
						passportScore: refreshUserScores.passportScore,
						currentRound: activeQFRound,
					});
				}
			} catch (error) {
				return setInfo({
					qfEligibilityState: EQFElegibilityState.ERROR,
					passportState: EPassportState.ERROR,
					activeQFMBDScore: null,
					passportScore: null,
					currentRound: null,
				});
			}
		},
		[
			activeQFRound,
			isArchivedQF,
			isSafeEnv,
			setEndedState,
			setNotAvailableForGSafe,
		],
	);

	const fetchUserMBDScore = useCallback(async () => {
		if (!address) return;
		if (isSafeEnv) return setNotAvailableForGSafe();

		setInfo({
			qfEligibilityState: EQFElegibilityState.PROCESSING,
			passportState: null,
			passportScore: null,
			activeQFMBDScore: null,
			currentRound: null,
		});

		try {
			const userAddressScore = await scoreUserAddress(address);
			await updateState(userAddressScore);
			dispatch(setUserMBDScore(userAddressScore?.activeQFMBDScore));
		} catch (error) {
			console.error('Failed to fetch user address score:', error);
			updateState(user!);
		}
	}, [address, updateState, user, isSafeEnv, setNotAvailableForGSafe]);

	const refreshScore = useCallback(async () => {
		if (!address) return;
		if (isSafeEnv) return setNotAvailableForGSafe();

		setInfo(prevInfo => ({
			...prevInfo,
			passportState: EPassportState.LOADING_SCORE,
		}));

		try {
			const { refreshUserScores } = await fetchPassportScore(address);
			await updateState(refreshUserScores);
			dispatch(
				setUserPassport({
					passportScore: refreshUserScores?.passportScore,
					passportStamps: refreshUserScores?.passportStamps,
					activeQFMBDScore: refreshUserScores?.activeQFMBDScore,
				}),
			);
		} catch (error) {
			console.error(error);
			setInfo({
				...info,
				passportState: EPassportState.ERROR,
				passportScore: null,
			});
		}
	}, [address, updateState, isSafeEnv, setNotAvailableForGSafe, info]);

	const handleSign = useCallback(async () => {
		if (!address) return;
		if (isSafeEnv) return setNotAvailableForGSafe();

		setInfo({
			qfEligibilityState: EQFElegibilityState.MORE_INFO_NEEDED,
			passportState: EPassportState.CONNECTING,
			passportScore: null,
			activeQFMBDScore: null,
			currentRound: activeQFRound,
		});

		const passports = getPassports();
		if (passports[address.toLowerCase()]) {
			await refreshScore();
		} else {
			const res = await connectPassport(address, !user);
			if (res) {
				await refreshScore();
			} else {
				setInfo({
					qfEligibilityState: EQFElegibilityState.MORE_INFO_NEEDED,
					passportState: EPassportState.NOT_SIGNED,
					passportScore: null,
					activeQFMBDScore: null,
					currentRound: activeQFRound,
				});
			}
		}
	}, [address, isSafeEnv, refreshScore, setNotAvailableForGSafe, user]);

	const handleSignWallet = useCallback(async () => {
		if (!address) return;
		if (isSafeEnv) return setNotAvailableForGSafe();

		setInfo({
			qfEligibilityState: EQFElegibilityState.LOADING,
			passportState: null,
			passportScore: null,
			activeQFMBDScore: null,
			currentRound: activeQFRound,
		});

		const res = await connectWallet(address, !user);
		if (!res) {
			setInfo({
				qfEligibilityState: EQFElegibilityState.NOT_SIGNED,
				passportState: EPassportState.NOT_SIGNED,
				passportScore: null,
				activeQFMBDScore: null,
				currentRound: activeQFRound,
			});
		} else {
			address && dispatch(fetchUserByAddress(address));
		}
	}, [address, isSafeEnv, setNotAvailableForGSafe, user]);

	useEffect(() => {
		console.log('******0', address, isUserFullFilled, user);
		if (isSafeEnv) return setNotAvailableForGSafe();
		if (!address) {
			console.log('******1', address, isUserFullFilled, user);
			return setInfo({
				qfEligibilityState: EQFElegibilityState.NOT_CONNECTED,
				passportState: EPassportState.NOT_CONNECTED,
				passportScore: null,
				activeQFMBDScore: null,
				currentRound: null,
			});
		}
		console.log('******2', address, isUserFullFilled, user);
		if (!isUserFullFilled) return;
		console.log('******3', address, isUserFullFilled, user);
		const fetchData = async () => {
			if (!user || user.passportScore === null) {
				console.log('******4', address, isUserFullFilled, user);
				console.log('Passport score is null in our database');
				const passports = getPassports();
				//user has not passport address
				if (
					user &&
					(passports[address.toLowerCase()] ||
						user.activeQFMBDScore == null ||
						(user.activeQFMBDScore != null &&
							activeQFRound &&
							user.activeQFMBDScore >= activeQFRound.minMBDScore))
				) {
					console.log('******5', address, isUserFullFilled, user);
					await updateState(user);
				} else {
					console.log('******6', address, isUserFullFilled, user);
					if (
						!passports[address.toLowerCase()] &&
						user &&
						user.activeQFMBDScore != null &&
						activeQFRound &&
						user.activeQFMBDScore < activeQFRound.minMBDScore
					) {
						return setInfo({
							qfEligibilityState:
								EQFElegibilityState.MORE_INFO_NEEDED,
							passportState: EPassportState.NOT_SIGNED,
							passportScore: null,
							activeQFMBDScore: null,
							currentRound: activeQFRound,
						});
					}
					setInfo({
						qfEligibilityState: EQFElegibilityState.NOT_SIGNED,
						passportState: EPassportState.NOT_SIGNED,
						passportScore: null,
						activeQFMBDScore: null,
						currentRound: activeQFRound,
					});
				}
			} else {
				console.log('******7', address, isUserFullFilled, user);
				await updateState(user);
			}
		};
		fetchData();
	}, [
		user,
		address,
		isSafeEnv,
		activeQFRound,
		isUserFullFilled,
		updateState,
		setNotAvailableForGSafe,
	]);

	return {
		info,
		updateState,
		handleSign,
		handleSignWallet,
		refreshScore,
		fetchUserMBDScore,
	};
};
