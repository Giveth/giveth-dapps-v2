import { createContext, ReactNode, useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { IQFRound } from '@/apollo/types/types';
import { FETCH_QF_ROUNDS_QUERY } from '@/apollo/gql/gqlQF';

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
	const [qfRounds, setQfRounds] = useState<IQFRound[]>([]);

	const { data, loading, error, refetch } = useQuery(FETCH_QF_ROUNDS_QUERY, {
		variables: {
			activeOnly: false, // Fetch all QF rounds
		},
		onCompleted: data => {
			if (data?.qfRounds) {
				setQfRounds(data.qfRounds);
			}
		},
		onError: error => {
			console.error('Error fetching QF rounds:', error);
		},
	});

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
