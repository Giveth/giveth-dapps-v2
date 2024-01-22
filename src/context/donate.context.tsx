import {
	createContext,
	FC,
	ReactNode,
	type SetStateAction,
	useContext,
	useState,
	type Dispatch,
	useEffect,
} from 'react';
import { useAccount } from 'wagmi';
import { IDonationProject } from '@/apollo/types/types';
import { hasActiveRound } from '@/helpers/qf';
import { ISuperfluidStream, IToken } from '@/types/superFluid';
import { ChainType } from '@/types/config';
import { fetchUserStreams } from '@/services/donation';

export interface TxHashWithChainType {
	txHash: string;
	chainType: ChainType;
}
interface ISuccessDonation {
	txHash: TxHashWithChainType[];
	givBackEligible?: boolean;
}

interface IDonateContext {
	hasActiveQFRound?: boolean;
	project: IDonationProject;
	isSuccessDonation?: ISuccessDonation;
	tokenStreams: ITokenStreams;
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
	tokenStreams: {},
});

DonateContext.displayName = 'DonateContext';

export interface ISelectTokenWithBalance {
	token: IToken;
	// stream: ISuperfluidStream;
	balance?: bigint;
	// isStream: boolean;
}

export interface ITokenStreams {
	[key: string]: ISuperfluidStream[];
}

export const DonateProvider: FC<IProviderProps> = ({ children, project }) => {
	const [tokenStreams, setTokenStreams] = useState<ITokenStreams>({});
	const [selectedToken, setSelectedToken] = useState<
		ISelectTokenWithBalance | undefined
	>();
	const [isSuccessDonation, setSuccessDonation] =
		useState<ISuccessDonation>();

	const { address } = useAccount();

	const hasActiveQFRound = hasActiveRound(project?.qfRounds);

	useEffect(() => {
		if (!address) return;

		// fetch user's streams
		const fetchData = async () => {
			const _tokenStreams = await fetchUserStreams(address);
			setTokenStreams(_tokenStreams);
		};
		fetchData();
	}, [address]);

	return (
		<DonateContext.Provider
			value={{
				hasActiveQFRound,
				project,
				isSuccessDonation,
				setSuccessDonation,
				selectedToken,
				setSelectedToken,
				tokenStreams,
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
