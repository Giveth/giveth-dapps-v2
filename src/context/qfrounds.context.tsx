import { createContext, ReactNode, useContext } from 'react';
import { IQFRound } from '@/apollo/types/types';
import { useFetchQFRounds } from '@/lib/helpers/qfroundHelpers';

interface IQFRoundsContext {
	qfRounds: IQFRound[];
	loading: boolean;
	error: any;
	activeQFRounds: IQFRound[];
	refetch: () => void;
}

const QFRoundsContext = createContext<IQFRoundsContext>({
	qfRounds: [],
	loading: false,
	error: null,
	activeQFRounds: [],
	refetch: () => console.log('refetch not initialized yet!'),
});

QFRoundsContext.displayName = 'QFRoundsContext';

export const QFRoundsProvider = ({ children }: { children: ReactNode }) => {
	const {
		data: qfRounds = [],
		isLoading: loading,
		error,
		refetch,
	} = useFetchQFRounds(false);

	// Filter active QF rounds
	const activeQFRounds = qfRounds.filter(round => round.isActive);

	const contextValue: IQFRoundsContext = {
		qfRounds,
		loading,
		error,
		activeQFRounds,
		refetch,
	};

	return (
		<QFRoundsContext.Provider value={contextValue}>
			{children}
		</QFRoundsContext.Provider>
	);
};

export function useQFRoundsContext() {
	const context = useContext(QFRoundsContext);

	if (!context) {
		throw new Error(
			'QFRounds context not found! Make sure to wrap your component with QFRoundsProvider.',
		);
	}

	return context;
}
