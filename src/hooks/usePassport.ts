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
	ELIGIBLE,
	ENDED,
	INVALID,
	ERROR,
}

export const usePassport = () => {
	const { account, library } = useWeb3React();
	const [state, setState] = useState(EPassportState.LOADING);
	const [score, setScore] = useState<IPassportInfo>();
	const [currentRound, setCurrentRound] = useState<IQFRound | null>(null);
	const user = useAppSelector(state => state.user.userData);

	const updateState = useCallback(
		async (refreshUserScores: IPassportInfo) => {
			setState(EPassportState.LOADING);
			try {
				const {
					data: { qfRounds },
				} = await client.query({
					query: FETCH_QF_ROUNDS,
					fetchPolicy: 'network-only',
				});

				setScore(refreshUserScores);
				if (!qfRounds && !refreshUserScores) {
					setState(EPassportState.INVALID);
					return;
				}
				const currentRound = (qfRounds as IQFRound[]).find(
					round => round.isActive,
				);
				if (!currentRound) {
					setState(EPassportState.ENDED);
					return;
				} else if (
					getNowUnixMS() > new Date(currentRound.endDate).getTime()
				) {
					setState(EPassportState.ENDED);
					return;
				}
				setCurrentRound(currentRound);
				if (
					refreshUserScores === null ||
					refreshUserScores.passportScore === null
				) {
					setState(EPassportState.NOT_CREATED);
					return;
				}
				if (
					refreshUserScores.passportScore <
					currentRound.minimumPassportScore
				) {
					setState(EPassportState.NOT_ELIGIBLE);
					return;
				} else {
					setState(EPassportState.ELIGIBLE);
				}
			} catch (error) {
				setState(EPassportState.ERROR);
			}
		},
		[],
	);

	const refreshScore = useCallback(async () => {
		if (!account) return;
		const { refreshUserScores } = await fetchPassportScore(account);
		await updateState(refreshUserScores);
	}, [account, updateState]);

	const handleSign = async () => {
		if (!library || !account) return;
		setState(EPassportState.LOADING);
		const passports = getPassports();
		if (passports[account.toLowerCase()]) {
			await refreshScore();
		} else {
			const res = await connectPassport(account, library);
			if (res) {
				await refreshScore();
			} else {
				return setState(EPassportState.NOT_SIGNED);
			}
		}
	};

	useEffect(() => {
		if (!user || !account) {
			return setState(EPassportState.NOT_CONNECTED);
		}
		console.log('user', user);
		if (user.passportScore === null) {
			setScore(user);
			console.log('Passport score is null in our database');
			const passports = getPassports();
			if (passports[account.toLowerCase()]) {
				setState(EPassportState.NOT_CREATED);
			} else {
				setState(EPassportState.NOT_SIGNED);
			}
		} else {
			updateState(user);
		}
	}, [account, updateState, user]);

	return { state, score, currentRound, handleSign, refreshScore };
};
