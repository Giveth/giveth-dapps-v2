import { createContext, ReactNode, useContext, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

enum EPFPMinSteps {
	MINT,
	SUCCESS,
	FAILURE,
}

interface IPFPMintContext {
	step: EPFPMinSteps;
	setStep: Dispatch<SetStateAction<number>>;
}

const PFPMintContext = createContext<IPFPMintContext>({
	step: EPFPMinSteps.MINT,
	setStep: () => {
		console.log('setStep not initialed yet!');
	},
});

PFPMintContext.displayName = 'PFPMintContext';

export const PFPMintProvider = ({ children }: { children: ReactNode }) => {
	const [step, setStep] = useState(EPFPMinSteps.MINT);

	return (
		<PFPMintContext.Provider
			value={{
				step,
				setStep,
			}}
		>
			{children}
		</PFPMintContext.Provider>
	);
};

export const usePFPMintData = () => {
	const context = useContext(PFPMintContext);
	if (context === undefined) {
		throw new Error('usePFPMintData must be used within a PFPMintProvider');
	}
	return context;
};
