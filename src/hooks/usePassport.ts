import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getPassports } from '@/helpers/passport';
import { connectPassport, fetchPassportScore } from '@/services/passport';
import { FETCH_QF_ROUNDS } from '@/apollo/gql/gqlQF';
import { client } from '@/apollo/apolloClient';
import { IPassportInfo, IQFRound } from '@/apollo/types/types';
import { getNowUnixMS } from '@/helpers/time';
import { useAppSelector } from '@/features/hooks';

export enum EPassportState {
	LOADING,
	NOT_CONNECTED,
	NOT_SIGNED,
	NOT_CREATED,
	NOT_ELIGIBLE,
	NOT_STARTED,
	NOT_ACTIVE_ROUND,
	ELIGIBLE,
	ENDED,
	INVALID,
	ERROR,
}

export interface IPassportAndStateInfo {
	passportState: EPassportState;
	passportScore: number | null;
	currentRound: IQFRound | null;
}

const initialInfo = {
	passportState: EPassportState.LOADING,
	passportScore: null,
	currentRound: null,
};

export const usePassport = () => {
	const { address } = useAccount();
	const [info, setInfo] = useState<IPassportAndStateInfo>(initialInfo);
	const { userData: user, isUserFullFilled } = useAppSelector(
		state => state.user,
	);

	const updateState = useCallback(
		async (refreshUserScores: IPassportInfo) => {
			setInfo({
				passportState: EPassportState.LOADING,
				passportScore: null,
				currentRound: null,
			});
			try {
				const {
					data: { qfRounds },
				} = await client.query({
					query: FETCH_QF_ROUNDS,
					fetchPolicy: 'network-only',
				});

				// setScore(refreshUserScores);
				if (!qfRounds && !refreshUserScores) {
					return setInfo({
						passportState: EPassportState.INVALID,
						passportScore: null,
						currentRound: null,
					});
				}
				const currentRound = (qfRounds as IQFRound[]).find(
					round => round.isActive,
				);
				if (!currentRound) {
					return setInfo({
						passportState: EPassportState.NOT_ACTIVE_ROUND,
						passportScore: refreshUserScores.passportScore,
						currentRound: null,
					});
				} else if (
					getNowUnixMS() < new Date(currentRound.beginDate).getTime()
				) {
					return setInfo({
						passportState: EPassportState.NOT_STARTED,
						passportScore: refreshUserScores.passportScore,
						currentRound: currentRound,
					});
				} else if (
					getNowUnixMS() > new Date(currentRound.endDate).getTime()
				) {
					return setInfo({
						passportState: EPassportState.ENDED,
						passportScore: refreshUserScores.passportScore,
						currentRound: currentRound,
					});
				}
				if (refreshUserScores.passportScore === null) {
					return setInfo({
						passportState: EPassportState.NOT_CREATED,
						passportScore: null,
						currentRound: currentRound,
					});
				}
				if (
					refreshUserScores.passportScore <
					currentRound.minimumPassportScore
				) {
					return setInfo({
						passportState: EPassportState.NOT_ELIGIBLE,
						passportScore: refreshUserScores.passportScore,
						currentRound: currentRound,
					});
				} else {
					return setInfo({
						passportState: EPassportState.ELIGIBLE,
						passportScore: refreshUserScores.passportScore,
						currentRound: currentRound,
					});
				}
			} catch (error) {
				return setInfo({
					passportState: EPassportState.ERROR,
					passportScore: null,
					currentRound: null,
				});
			}
		},
		[],
	);

	const refreshScore = useCallback(async () => {
		if (!address) return;
		setInfo({
			passportState: EPassportState.LOADING,
			passportScore: null,
			currentRound: null,
		});
		try {
			const { refreshUserScores } = await fetchPassportScore(address);
			await updateState(refreshUserScores);
		} catch (error) {
			console.log(error);
			setInfo({
				passportState: EPassportState.ERROR,
				passportScore: null,
				currentRound: null,
			});
		}
	}, [address, updateState]);

	const handleSign = async () => {
		if (!address) return;
		setInfo({
			passportState: EPassportState.LOADING,
			passportScore: null,
			currentRound: null,
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
					passportState: EPassportState.NOT_SIGNED,
					passportScore: null,
					currentRound: null,
				});
			}
		}
	};

	useEffect(() => {
		console.log('******0', address, isUserFullFilled, user);
		if (!address) {
			console.log('******1', address, isUserFullFilled, user);
			return setInfo({
				passportState: EPassportState.NOT_CONNECTED,
				passportScore: null,
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
				if (passports[address.toLowerCase()] && user) {
					console.log('******5', address, isUserFullFilled, user);
					await updateState(user);
				} else {
					console.log('******6', address, isUserFullFilled, user);
					setInfo({
						passportState: EPassportState.NOT_SIGNED,
						passportScore: null,
						currentRound: null,
					});
				}
			} else {
				console.log('******7', address, isUserFullFilled, user);
				await updateState(user);
			}
		};
		fetchData();
	}, [address, isUserFullFilled, updateState, user]);

	return { info, handleSign, refreshScore };
};
