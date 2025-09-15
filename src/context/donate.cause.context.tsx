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
import { IToken } from '@/types/superFluid';
import { ChainType } from '@/types/config';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG_DONATION } from '@/apollo/gql/gqlProjects';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';

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
	setSuccessDonation: (successDonation?: ISuccessDonation) => void;
	selectedOneTimeToken?: IProjectAcceptedToken;
	selectedQFRound?: IQFRound;
	choosedModalRound?: IQFRound;
	setChoosedModalRound: (round: IQFRound | undefined) => void;
	setSelectedOneTimeToken: Dispatch<
		SetStateAction<IProjectAcceptedToken | undefined>
	>;
	setSelectedQFRound: Dispatch<SetStateAction<IQFRound | undefined>>;
	setDonateModalByPriority: (
		changeCurrentModal: DonateModalPriorityValues,
	) => void;
	setIsModalPriorityChecked: (modal: DonateModalPriorityValues) => void;
	shouldRenderModal: (modalRender: DonateModalPriorityValues) => boolean;
	fetchProject: () => Promise<void>;
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

const DonateCauseContext = createContext<IDonateContext>({
	setSuccessDonation: () => {},
	setSelectedOneTimeToken: () => {},
	setSelectedQFRound: () => {},
	setChoosedModalRound: () => {},
	project: {} as IProject,
	fetchProject: async () => {},
	setDonateModalByPriority: (changeModal: DonateModalPriorityValues) => {},
	shouldRenderModal: (modalRender: DonateModalPriorityValues) => false,
	setIsModalPriorityChecked: (modal: DonateModalPriorityValues) => {},
});

DonateCauseContext.displayName = 'DonateCauseContext';

export interface ISelectTokenWithBalance {
	token: IToken;
	balance?: bigint;
}

export const CauseProvider: FC<IProviderProps> = ({ children, project }) => {
	const [selectedOneTimeToken, setSelectedOneTimeToken] = useState<
		IProjectAcceptedToken | undefined
	>();
	const [selectedQFRound, setSelectedQFRound] = useState<
		IQFRound | undefined
	>();
	const [choosedModalRound, setChoosedModalRound] = useState<
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
		setSelectedQFRound(undefined);
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
		[currentDonateModal, setIsModalPriorityChecked],
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

	const hasActiveQFRound = hasActiveRound(project?.qfRounds);
	const activeStartedRound = getActiveRound(
		project?.qfRounds,
	).activeStartedRound;

	return (
		<DonateCauseContext.Provider
			value={{
				hasActiveQFRound,
				activeStartedRound,
				project: projectData,
				successDonation,
				setSuccessDonation,
				selectedOneTimeToken,
				selectedQFRound,
				setDonateModalByPriority,
				setSelectedOneTimeToken,
				setSelectedQFRound,
				shouldRenderModal,
				setIsModalPriorityChecked,
				fetchProject,
				choosedModalRound,
				setChoosedModalRound,
			}}
		>
			{children}
		</DonateCauseContext.Provider>
	);
};

export const useCauseDonateData = () => {
	const context = useContext(DonateCauseContext);
	if (context === undefined) {
		throw new Error('useDonateData must be used within a Provider');
	}
	return context;
};
