import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
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
	const { account, library } = useWeb3React();
	const [info, setInfo] = useState<IPassportAndStateInfo>(initialInfo);
	const user = useAppSelector(state => state.user.userData);

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
		if (!account) return;
		setInfo({
			passportState: EPassportState.LOADING,
			passportScore: null,
			currentRound: null,
		});
		try {
			const { refreshUserScores } = await fetchPassportScore(account);
			await updateState(refreshUserScores);
		} catch (error) {
			console.log(error);
			setInfo({
				passportState: EPassportState.ERROR,
				passportScore: null,
				currentRound: null,
			});
		}
	}, [account, updateState]);

	const handleSign = async () => {
		if (!library || !account) return;
		setInfo({
			passportState: EPassportState.LOADING,
			passportScore: null,
			currentRound: null,
		});
		const passports = getPassports();
		if (passports[account.toLowerCase()]) {
			await refreshScore();
		} else {
			const res = await connectPassport(account, library, !user);
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
		if (!account) {
			return setInfo({
				passportState: EPassportState.NOT_CONNECTED,
				passportScore: null,
				currentRound: null,
			});
		}

		const fetchData = async () => {
			if (!user || user.passportScore === null) {
				console.log('Passport score is null in our database');
				const passports = getPassports();
				//user has not passport account
				if (passports[account.toLowerCase()] && user) {
					await updateState(user);
				} else {
					setInfo({
						passportState: EPassportState.NOT_SIGNED,
						passportScore: null,
						currentRound: null,
					});
				}
			} else {
				await updateState(user);
			}
		};
		fetchData();
	}, [account, updateState, user]);

	return { info, handleSign, refreshScore };
};
