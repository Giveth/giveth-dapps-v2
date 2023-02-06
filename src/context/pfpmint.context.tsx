import { createContext, ReactNode, useContext, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export enum EPFPMinSteps {
	MINT,
	SUCCESS,
	FAILURE,
}

interface IPFPMintContext {
	step: EPFPMinSteps;
	setStep: Dispatch<SetStateAction<number>>;
	qty: number;
	setQty: Dispatch<SetStateAction<number>>;
}

const PFPMintContext = createContext<IPFPMintContext>({
	step: EPFPMinSteps.FAILURE,
	setStep: () => {
		console.log('setStep not initialed yet!');
	},
	qty: 1,
	setQty: () => {
		console.log('setQty not initialed yet!');
	},
});

PFPMintContext.displayName = 'PFPMintContext';

export const PFPMintProvider = ({ children }: { children: ReactNode }) => {
	const [step, setStep] = useState(EPFPMinSteps.FAILURE);
	const [qty, setQty] = useState(1);

	return (
		<PFPMintContext.Provider
			value={{
				step,
				setStep,
				qty,
				setQty,
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
