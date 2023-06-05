import { QFRound } from '@/apollo/types/types';

export const hasActiveRound = (qfRounds: QFRound[] | undefined) => {
	if (!qfRounds) return false;
	return qfRounds.some(round => round.isActive);
};
