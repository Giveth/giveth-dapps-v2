import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { getPassports } from '@/helpers/passport';
import { connectPassport, fetchPassportScore } from '@/services/passport';
import { FETCH_QF_ROUNDS } from '@/apollo/gql/gqlQF';
import { client } from '@/apollo/apolloClient';
import { IPassportInfo, IQFRound } from '@/apollo/types/types';

export enum EPassportState {
	LOADING,
	NOT_CONNECTED,
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

	const refreshScore = useCallback(async () => {
		if (!account) return;
		try {
			const {
				data: { qfRounds },
			} = await client.query({
				query: FETCH_QF_ROUNDS,
				fetchPolicy: 'network-only',
			});
			const { refreshUserScores } = await fetchPassportScore(account);

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
			}
			setCurrentRound(currentRound);
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
	}, [account]);

	const handleConnect = async () => {
		if (!library || !account) return;
		setState(EPassportState.LOADING);
		const res = await connectPassport(account, library);
		if (res) {
			refreshScore();
		} else {
			setState(EPassportState.NOT_CONNECTED);
		}
	};

	useEffect(() => {
		if (!library || !account) {
			return setState(EPassportState.NOT_CONNECTED);
		}

		const fetchData = async () => {
			const passports = getPassports();
			if (passports[account.toLowerCase()]) {
				await refreshScore();
			} else {
				setState(EPassportState.NOT_CONNECTED);
			}
		};

		fetchData();
	}, [account, library, refreshScore]);
	return { state, score, currentRound, handleConnect, refreshScore };
};
