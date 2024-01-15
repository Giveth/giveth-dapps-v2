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
import { FETCH_USER_STREAMS } from '@/apollo/gql/gqlUser';
import { gqlRequest } from '@/helpers/requests';
import config from '@/configuration';
import { ChainType } from '@/types/config';

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
			const { data } = await gqlRequest(
				config.OPTIMISM_CONFIG.superFluidSubgraph,
				undefined,
				FETCH_USER_STREAMS,
				{ address: address.toLowerCase() },
			);
			const streams: ISuperfluidStream[] = data?.streams;
			console.log('streams', streams);

			//categorize streams by token
			const _tokenStreams: ITokenStreams = {};
			streams.forEach(stream => {
				if (!_tokenStreams[stream.token.id]) {
					_tokenStreams[stream.token.id] = [];
				}
				_tokenStreams[stream.token.id].push(stream);
			});
			setTokenStreams(_tokenStreams);
			console.log('tokenStreams', _tokenStreams);
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
