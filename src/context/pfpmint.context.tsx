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
	tx: string;
	setTx: Dispatch<SetStateAction<string>>;
	isEligible: boolean;
	setIsEligible: Dispatch<SetStateAction<boolean>>;
}

const PFPMintContext = createContext<IPFPMintContext>({
	step: EPFPMinSteps.MINT,
	setStep: () => {
		console.log('setStep not initialed yet!');
	},
	qty: 1,
	setQty: () => {
		console.log('setQty not initialed yet!');
	},
	tx: '',
	setTx: () => {
		console.log('setTx not initialed yet!');
	},
	isEligible: false,
	setIsEligible: () => {
		console.log('setIsEligible not initialed yet!');
	},
});

PFPMintContext.displayName = 'PFPMintContext';

export const PFPMintProvider = ({ children }: { children: ReactNode }) => {
	const [step, setStep] = useState(EPFPMinSteps.MINT);
	const [qty, setQty] = useState(1);
	const [tx, setTx] = useState<string>('');
	const [isEligible, setIsEligible] = useState(false);

	return (
		<PFPMintContext.Provider
			value={{
				step,
				setStep,
				qty,
				setQty,
				tx,
				setTx,
				isEligible,
				setIsEligible,
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
