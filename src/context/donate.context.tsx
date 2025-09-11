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
	useRef,
} from 'react';
import { useAccount } from 'wagmi';
import { IProject, IQFRound } from '@/apollo/types/types';
import { getActiveRound, hasActiveRound } from '@/helpers/qf';
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
	activeStartedRound?: IQFRound;
	project: IProject;
	successDonation?: ISuccessDonation;
	tokenStreams: ITokenStreams;
	setSuccessDonation: (successDonation?: ISuccessDonation) => void;
	selectedOneTimeToken?: IProjectAcceptedToken;
	selectedRecurringToken?: ISelectTokenWithBalance;
	selectedQFRound?: IQFRound;
	setSelectedOneTimeToken: Dispatch<
		SetStateAction<IProjectAcceptedToken | undefined>
	>;
	setDonateModalByPriority: (
		changeCurrentModal: DonateModalPriorityValues,
	) => void;
	setSelectedRecurringToken: Dispatch<
		SetStateAction<ISelectTokenWithBalance | undefined>
	>;
	setSelectedQFRound: Dispatch<SetStateAction<IQFRound | undefined>>;
	setIsModalPriorityChecked: (modal: DonateModalPriorityValues) => void;
	shouldRenderModal: (modalRender: DonateModalPriorityValues) => boolean;
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

export enum DonateModalPriorityValues {
	None,
	ShowNetworkModal,
	DonationByProjectOwner,
	OFACSanctionListModal,
}

const DonateContext = createContext<IDonateContext>({
	setSuccessDonation: () => {},
	setSelectedOneTimeToken: () => {},
	setSelectedRecurringToken: () => {},
	setSelectedQFRound: () => {},
	project: {} as IProject,
	tokenStreams: {},
	fetchProject: async () => {},
	setDonateModalByPriority: (changeModal: DonateModalPriorityValues) => {},
	shouldRenderModal: (modalRender: DonateModalPriorityValues) => false,
	setIsModalPriorityChecked: (modal: DonateModalPriorityValues) => {},
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
	const [selectedQFRound, setSelectedQFRound] = useState<
		IQFRound | undefined
	>();
	const isModalStatusChecked = useRef<
		Map<DonateModalPriorityValues, boolean>
	>(new Map());
	const highestModalPriorityUnchecked = useRef<
		DonateModalPriorityValues | 'All Checked'
	>(DonateModalPriorityValues.None);

	const [successDonation, setSuccessDonation] = useState<ISuccessDonation>();
	const [projectData, setProjectData] = useState<IProject>(project);
	const [currentDonateModal, setCurrentDonateModal] =
		useState<DonateModalPriorityValues>(DonateModalPriorityValues.None);

	const { chain } = useAccount();

	useEffect(() => {
		setSelectedOneTimeToken(undefined);
		setSelectedRecurringToken(undefined);
	}, [chain]);

	const setIsModalPriorityChecked = useCallback(
		(modalChecked: DonateModalPriorityValues): void => {
			if (
				highestModalPriorityUnchecked.current != 'All Checked' &&
				(modalChecked <= highestModalPriorityUnchecked.current ||
					highestModalPriorityUnchecked.current ===
						DonateModalPriorityValues.None)
			) {
				isModalStatusChecked.current.set(modalChecked, true);
				let highestModalStatusUnchecked =
					DonateModalPriorityValues.None;
				let isAllChecked = true;
				const modals: DonateModalPriorityValues[] = Object.values(
					DonateModalPriorityValues,
				).filter(
					modal => typeof modal !== 'string',
				) as DonateModalPriorityValues[];
				for (const modalStatus of modals) {
					if (!isModalStatusChecked.current.get(modalStatus)) {
						highestModalStatusUnchecked = modalStatus;
					}
					isAllChecked =
						(isAllChecked &&
							!!isModalStatusChecked.current.get(modalStatus)) ||
						modalStatus === DonateModalPriorityValues.None;
				}
				highestModalPriorityUnchecked.current = isAllChecked
					? 'All Checked'
					: highestModalStatusUnchecked;
			}
		},
		[],
	);

	const setDonateModalByPriority = useCallback(
		(changeModal: DonateModalPriorityValues) => {
			if (!isModalStatusChecked.current.get(changeModal)) {
				setIsModalPriorityChecked(changeModal);
			}
			if (changeModal === DonateModalPriorityValues.None) {
				setCurrentDonateModal(DonateModalPriorityValues.None);
			} else if (changeModal > currentDonateModal) {
				setCurrentDonateModal(changeModal);
			}
		},
		[currentDonateModal],
	);

	const shouldRenderModal = useCallback(
		(modalRender: DonateModalPriorityValues) => {
			return (
				(highestModalPriorityUnchecked.current == 'All Checked' ||
					currentDonateModal >=
						highestModalPriorityUnchecked.current) &&
				currentDonateModal === modalRender
			);
		},
		[currentDonateModal],
	);

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
	const activeStartedRound = getActiveRound(
		project?.qfRounds,
	).activeStartedRound;

	return (
		<DonateContext.Provider
			value={{
				hasActiveQFRound,
				activeStartedRound,
				project: projectData,
				successDonation,
				setSuccessDonation,
				selectedOneTimeToken,
				pendingDonationExists,
				selectedRecurringToken,
				selectedQFRound,
				setDonateModalByPriority,
				setSelectedOneTimeToken,
				shouldRenderModal,
				setSelectedRecurringToken,
				setSelectedQFRound,
				setIsModalPriorityChecked,
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
