import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { IDonationProject } from '@/apollo/types/types';

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

export const DonateProvider: FC<IProviderProps> = props => {
	const { children, project } = props;

	const { qfRounds } = project;
	const activeQFRound = qfRounds?.find(r => r.isActive);
	const qfBeginDate = activeQFRound?.beginDate;
	const now = new Date().toISOString();
	const hasRoundBegun = qfBeginDate ? qfBeginDate < now : false;
	// It's impossible that a round is active and end date is passed, bc backend has a cron job. So, we only check the beginDate
	const hasActiveQFRound = activeQFRound && hasRoundBegun;

	const [isSuccessDonation, setSuccessDonation] =
		useState<ISuccessDonation>();

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
