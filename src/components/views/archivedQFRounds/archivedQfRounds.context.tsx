import {
	type FC,
	useState,
	ReactNode,
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
} from 'react';
import { EQFRoundsSortBy } from '@/apollo/types/gqlEnums';

export enum EQfArchivedRoundsSort {
	allocatedFund = 'allocatedFund',
	totalDonations = 'totalDonations',
	uniqueDonors = 'uniqueDonors',
	beginDate = 'beginDate',
}

export enum EOrderDirection {
	ASC = 'ASC',
	DESC = 'DESC',
}

interface IProviderProps {
	children: ReactNode;
}

interface IAQFRoundsContext {
	orderBy: EQFRoundsSortBy;
	setOrderBy: Dispatch<SetStateAction<EQFRoundsSortBy>>;
}

const ArchivedQFRoundsContext = createContext<IAQFRoundsContext>({
	orderBy: EQFRoundsSortBy.NEWEST,
	setOrderBy: () => {},
});

ArchivedQFRoundsContext.displayName = 'ArchivedQFRoundsContext';

export const ArchivedQFRoundsProvider: FC<IProviderProps> = ({ children }) => {
	const [orderBy, setOrderBy] = useState(EQFRoundsSortBy.NEWEST);

	return (
		<ArchivedQFRoundsContext.Provider value={{ orderBy, setOrderBy }}>
			{children}
		</ArchivedQFRoundsContext.Provider>
	);
};

export const useArchivedQFRounds = () => {
	const context = useContext(ArchivedQFRoundsContext);
	if (context === undefined) {
		throw new Error('useArchivedQFRounds must be used within a Provider');
	}
	return context;
};
