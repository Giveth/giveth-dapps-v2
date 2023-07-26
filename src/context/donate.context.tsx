import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { IDonationProject } from '@/apollo/types/types';
import { hasActiveRound } from '@/helpers/qf';

interface ISuccessDonation {
	txHash: string[];
	givBackEligible?: boolean;
}

interface IDonateContext {
	hasActiveQFRound?: boolean;
	project: IDonationProject;
	isSuccessDonation?: ISuccessDonation;
	setSuccessDonation: (successDonation?: ISuccessDonation) => void;
}

interface IProviderProps {
	children: ReactNode;
	project: IDonationProject;
}

const DonateContext = createContext<IDonateContext>({
	setSuccessDonation: () => {},
	project: {} as IDonationProject,
});

DonateContext.displayName = 'DonateContext';

export const DonateProvider: FC<IProviderProps> = ({ children, project }) => {
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
