import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { getPassports } from '@/helpers/passport';
import { connectPassport, fetchPassportScore } from '@/services/passport';

export enum EPassportState {
	LOADING,
	CONNECT,
	NOT_ELIGIBLE,
	ELIGIBLE,
	ENDED,
	INVALID_PASSPORT,
	ERROR,
	INVALID_RESPONSE,
}

export const usePassport = () => {
	const { account, library } = useWeb3React();
	const [state, setState] = useState(EPassportState.LOADING);
	const [score, setScore] = useState();

	const refreshScore = async () => {
		if (!account) return;
		const res1 = await fetchPassportScore(account);
		setScore(res1);
		console.log('res1', res1);
	};

	const handleConnect = async () => {
		if (!library || !account) return;

		const res = await connectPassport(account, library);
		if (res) {
			refreshScore();
		}
	};

	useEffect(() => {
		if (!library || !account) return;

		const fetchData = async () => {
			const passports = getPassports();
			if (passports[account]) {
				const res = await fetchPassportScore(account);
				console.log('res', res);
			} else {
				setState(EPassportState.CONNECT);
			}
		};

		fetchData();
	}, [account, library]);
	return { state, score, handleConnect, refreshScore };
};
