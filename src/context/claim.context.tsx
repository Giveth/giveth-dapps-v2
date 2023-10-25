import {
	createContext,
	FC,
	ReactNode,
	useState,
	useEffect,
	useContext,
	SetStateAction,
} from 'react';
import { Dispatch } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import config from '@/configuration';
import { fetchAirDropClaimData, hasClaimedAirDrop } from '@/lib/claim';
import SwitchNetwork from '@/components/modals/SwitchNetwork';

export enum GiveDropStateType {
	notConnected,
	Success,
	Missed,
	Claimed,
}
export interface IClaimContext {
	isloading: boolean;
	totalAmount: bigint;
	giveDropState: GiveDropStateType;
	step: number;
	setStep: Dispatch<SetStateAction<number>>;
	goNextStep: () => void;
	goPreviousStep: () => void;
	getClaimData: () => Promise<void>;
	resetWallet: () => void;
}
const initialValue = {
	isloading: false,
	totalAmount: 0n,
	giveDropState: GiveDropStateType.notConnected,
	step: 0,
	setStep: () => {},
	goNextStep: () => {},
	goPreviousStep: () => {},
	getClaimData: async () => {},
	resetWallet: () => {},
};
export const ClaimContext = createContext<IClaimContext>(initialValue);

ClaimContext.displayName = 'ClaimContext';

type Props = {
	children?: ReactNode;
};
export const ClaimProvider: FC<Props> = ({ children }) => {
	const [step, setStep] = useState(0);
	const [isloading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [totalAmount, setTotalAmount] = useState<bigint>(
		initialValue.totalAmount,
	);

	const [giveDropState, setGiveDropState] = useState<GiveDropStateType>(
		GiveDropStateType.notConnected,
	);

	const { chain } = useNetwork();
	const chainId = chain?.id;
	const { address, isConnected } = useAccount();

	useEffect(() => {
		setShowModal(isConnected && chainId !== config.GNOSIS_NETWORK_NUMBER);
	}, [chainId, step, isConnected]);

	const getClaimData = async () => {
		if (!address || chainId !== config.GNOSIS_NETWORK_NUMBER) {
			return;
		}
		setTotalAmount(0n);
		setStep(0);
		setIsLoading(true);
		const claimData = await fetchAirDropClaimData(address);
		if (claimData) {
			const _hasClaimed = await hasClaimedAirDrop(address);
			// const _hasClaimed = false;
			console.log(`_hasClaimed`, _hasClaimed);
			setTotalAmount(BigInt(claimData.amount));
			setIsLoading(false);
			if (!_hasClaimed) {
				setGiveDropState(GiveDropStateType.Success);
			} else {
				setGiveDropState(GiveDropStateType.Claimed);
			}
			return;
		}
		setGiveDropState(GiveDropStateType.Missed);
		setTotalAmount(0n);
		setIsLoading(false);
	};

	const resetWallet = () => {
		setGiveDropState(GiveDropStateType.notConnected);
		setTotalAmount(0n);
		setStep(0);
	};

	useEffect(() => {
		resetWallet();
	}, [address]);

	return (
		<ClaimContext.Provider
			value={{
				isloading,
				totalAmount,
				giveDropState,
				step,
				setStep,
				goNextStep: () => {
					setStep(step + 1);
				},
				goPreviousStep: () => {
					setStep(step - 1);
				},
				getClaimData,
				resetWallet,
			}}
		>
			{children}
			{showModal && (
				<SwitchNetwork
					setShowModal={setShowModal}
					desc="You're connected to the wrong network! please switch to Gnosis Chain."
					customNetworks={[config.GNOSIS_NETWORK_NUMBER]}
				/>
			)}
		</ClaimContext.Provider>
	);
};

export default function useClaim() {
	const context = useContext(ClaimContext);

	if (!context) {
		throw new Error('Claim context not found!');
	}

	return context;
}
