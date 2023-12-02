import {
	createContext,
	FC,
	ReactNode,
	type SetStateAction,
	useContext,
	useState,
	type Dispatch,
} from 'react';
import { IDonationProject } from '@/apollo/types/types';
import { hasActiveRound } from '@/helpers/qf';
import { IToken } from '@/types/superFluid';

interface ISuccessDonation {
	txHash: string[];
	givBackEligible?: boolean;
}

interface IDonateContext {
	hasActiveQFRound?: boolean;
	project: IDonationProject;
	isSuccessDonation?: ISuccessDonation;
	setSuccessDonation: (successDonation?: ISuccessDonation) => void;
	selectedToken?: ISelectTokenWithBalance;
	setSelectedToken: Dispatch<
		SetStateAction<ISelectTokenWithBalance | undefined>
	>;
}

interface IProviderProps {
	children: ReactNode;
	project: IDonationProject;
}

const DonateContext = createContext<IDonateContext>({
	setSuccessDonation: () => {},
	setSelectedToken: () => {},
	project: {} as IDonationProject,
});

DonateContext.displayName = 'DonateContext';

export interface ISelectTokenWithBalance {
	token: IToken;
	// stream: ISuperfluidStream;
	balance?: bigint;
	// isStream: boolean;
}

export const DonateProvider: FC<IProviderProps> = ({ children, project }) => {
	const [selectedToken, setSelectedToken] = useState<
		ISelectTokenWithBalance | undefined
	>();
	const [isSuccessDonation, setSuccessDonation] =
		useState<ISuccessDonation>();

	const hasActiveQFRound = hasActiveRound(project?.qfRounds);

	return (
		<DonateContext.Provider
			value={{
				hasActiveQFRound,
				project,
				isSuccessDonation,
				setSuccessDonation,
				selectedToken,
				setSelectedToken,
			}}
		>
			{children}
		</DonateContext.Provider>
	);
};

export const useDonateData = () => {
	const context = useContext(DonateContext);
	if (context === undefined) {
		throw new Error('useDonateData must be used within a Provider');
	}
	return context;
};
