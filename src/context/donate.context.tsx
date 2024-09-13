import {
	createContext,
	FC,
	ReactNode,
	type SetStateAction,
	useContext,
	useState,
	useCallback,
	type Dispatch,
	useEffect,
} from 'react';
import { useAccount } from 'wagmi';
import { IProject } from '@/apollo/types/types';
import { hasActiveRound } from '@/helpers/qf';
import { ISuperfluidStream, IToken } from '@/types/superFluid';
import { ChainType } from '@/types/config';
import { useUserStreams } from '@/hooks/useUserStreams';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG_DONATION } from '@/apollo/gql/gqlProjects';
import { IProjectAcceptedToken, IDraftDonation } from '@/apollo/types/gqlTypes';
import { useQRCodeDonation, TQRStatus } from '@/hooks/useQRCodeDonation';
export interface TxHashWithChainType {
	txHash: string;
	chainType: ChainType;
}
interface ISuccessDonation {
	txHash: TxHashWithChainType[];
	chainId: number;
	givBackEligible?: boolean;
	excludeFromQF?: boolean;
	isRecurring?: boolean;
}

interface IDonateContext {
	hasActiveQFRound?: boolean;
	project: IProject;
	successDonation?: ISuccessDonation;
	tokenStreams: ITokenStreams;
	setSuccessDonation: (successDonation?: ISuccessDonation) => void;
	selectedOneTimeToken?: IProjectAcceptedToken;
	selectedRecurringToken?: ISelectTokenWithBalance;
	setSelectedOneTimeToken: Dispatch<
		SetStateAction<IProjectAcceptedToken | undefined>
	>;
	setSelectedRecurringToken: Dispatch<
		SetStateAction<ISelectTokenWithBalance | undefined>
	>;
	fetchProject: () => Promise<void>;
	draftDonationData?: IDraftDonation;
	fetchDraftDonation?: (
		draftDonationId: number,
	) => Promise<void | IDraftDonation>;
	qrDonationStatus: TQRStatus;
	pendingDonationExists: boolean;
	startTimer?: (startTime: Date) => void;
	setQRDonationStatus: Dispatch<SetStateAction<TQRStatus>>;
	draftDonationLoading?: boolean;
	setDraftDonationData: Dispatch<SetStateAction<IDraftDonation | null>>;
	setPendingDonationExists?: Dispatch<SetStateAction<boolean>>;
}

interface IProviderProps {
	children: ReactNode;
	project: IProject;
}

const DonateContext = createContext<IDonateContext>({
	setSuccessDonation: () => {},
	setSelectedOneTimeToken: () => {},
	setSelectedRecurringToken: () => {},
	project: {} as IProject,
	tokenStreams: {},
	fetchProject: async () => {},
	draftDonationData: {} as IDraftDonation,
	fetchDraftDonation: async () => {},
	qrDonationStatus: 'waiting',
	pendingDonationExists: false,
	startTimer: () => {},
	setQRDonationStatus: () => {},
	draftDonationLoading: false,
	setDraftDonationData: () => {},
	setPendingDonationExists: () => {},
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
	const [selectedOneTimeToken, setSelectedOneTimeToken] = useState<
		IProjectAcceptedToken | undefined
	>();
	const [selectedRecurringToken, setSelectedRecurringToken] = useState<
		ISelectTokenWithBalance | undefined
	>();

	const [successDonation, setSuccessDonation] = useState<ISuccessDonation>();
	const [projectData, setProjectData] = useState<IProject>(project);

	const { chain } = useAccount();

	useEffect(() => {
		setSelectedOneTimeToken(undefined);
		setSelectedRecurringToken(undefined);
	}, [chain]);

	const fetchProject = useCallback(async () => {
		const { data } = (await client.query({
			query: FETCH_PROJECT_BY_SLUG_DONATION,
			variables: { slug: project.slug },
			fetchPolicy: 'no-cache',
		})) as { data: { projectBySlug: IProject } };

		setProjectData(data.projectBySlug);
	}, [project.slug]);

	const { tokenStreams } = useUserStreams();

	const {
		draftDonation,
		status,
		retrieveDraftDonation,
		pendingDonationExists,
		setPendingDonationExists,
		startTimer,
		setStatus,
		loading,
		setDraftDonation,
	} = useQRCodeDonation(project);

	const hasActiveQFRound = hasActiveRound(project?.qfRounds);

	return (
		<DonateContext.Provider
			value={{
				hasActiveQFRound,
				project: projectData,
				successDonation,
				setSuccessDonation,
				selectedOneTimeToken,
				pendingDonationExists,
				selectedRecurringToken,
				setSelectedOneTimeToken,
				setSelectedRecurringToken,
				tokenStreams,
				fetchProject,
				draftDonationData: draftDonation as IDraftDonation,
				setDraftDonationData: setDraftDonation,
				fetchDraftDonation: retrieveDraftDonation,
				qrDonationStatus: status,
				startTimer,
				setQRDonationStatus: setStatus,
				setPendingDonationExists,
				draftDonationLoading: loading,
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
