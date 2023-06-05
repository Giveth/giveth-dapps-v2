import { IQFRound } from '@/apollo/types/types';

export const hasActiveRound = (qfRounds: IQFRound[] | undefined) => {
	if (!qfRounds) return false;
	return qfRounds.some(round => round.isActive);
};
