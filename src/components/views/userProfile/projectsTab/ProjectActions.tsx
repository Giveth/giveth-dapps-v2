import {
	IconArchiving,
	IconArrowDownCircle16,
	IconEdit16,
	IconEye16,
	IconTrash16,
	IconUpdate16,
	IconVerifiedBadge16,
	IconWalletOutline16,
	brandColors,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Dispatch, type FC, SetStateAction, useState } from 'react';
import { useIntl } from 'react-intl';
import router from 'next/router';
import { useAccount, useSwitchChain } from 'wagmi';
import { captureException } from '@sentry/nextjs';
import { EVerificationStatus, IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { Dropdown, IOption, EOptionType } from '@/components/Dropdown';
import {
	idToProjectEdit,
	slugToProjectView,
	slugToVerification,
} from '@/lib/routeCreators';
import { capitalizeAllWords, showToastError } from '@/lib/helpers';
import config, { isDeleteProjectEnabled } from '@/configuration';
import { findAnchorContractAddress } from '@/helpers/superfluid';
import DeactivateProjectModal from '@/components/modals/deactivateProject/DeactivateProjectIndex';
import { client } from '@/apollo/apolloClient';
import { ACTIVATE_PROJECT } from '@/apollo/gql/gqlProjects';

interface IProjectActions {
	project: IProject;
	setSelectedProject: Dispatch<SetStateAction<IProject | undefined>>;
	setShowAddressModal: Dispatch<SetStateAction<boolean>>;
	setShowClaimModal?: Dispatch<SetStateAction<boolean>>;
	setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
	setProject: Dispatch<SetStateAction<IProject>>;
	className?: string;
}

const ProjectActions: FC<IProjectActions> = ({
	project,
	setSelectedProject,
	setShowAddressModal,
	setShowClaimModal,
	setShowDeleteModal,
	setProject,
	className,
}) => {
	const [isHover, setIsHover] = useState(false);
	const [deactivateModal, setDeactivateModal] = useState(false);
	const { formatMessage } = useIntl();
	const { chain } = useAccount();
	const { switchChain } = useSwitchChain();

	const status = project.status.name;
	const isCancelled = status === EProjectStatus.CANCEL;

	const anchorContractAddress = findAnchorContractAddress(
		project.anchorContracts,
	);

	const chainId = chain?.id;
	const projectId = project?.id;
	const isActive = project?.status.name === EProjectStatus.ACTIVE;

	// Handle activate project action
	const handleActivateProject = async () => {
		try {
			await client.mutate({
				mutation: ACTIVATE_PROJECT,
				variables: { projectId: Number(projectId || '') },
			});
			const _project = structuredClone(project);
			_project.listed = null;
			_project.status.name = EProjectStatus.ACTIVE;
			setProject(_project);
		} catch (e) {
			showToastError(e);
			captureException(e, {
				tags: {
					section: 'handleProjectStatus',
				},
			});
		}
	};

	// Handle deactivate project action
	const handleDeactivateProject = async () => {
		setDeactivateModal(true);
	};

	const onDeactivateProject = async () => {
		const _project = structuredClone(project);
		_project.status.name = EProjectStatus.DEACTIVE;
		_project.listed = null;
		setProject(_project);
	};

	const options: IOption[] = [
		{
			label: formatMessage({ id: 'label.view_project' }),
			icon: <IconEye16 />,
			cb: () => router.push(slugToProjectView(project.slug)),
		},
		{
			label: formatMessage({ id: 'label.add_update' }),
			icon: <IconUpdate16 />,
			cb: () =>
				router.push(slugToProjectView(project.slug) + '?tab=updates'),
		},
		{
			label: formatMessage({ id: 'label.edit_project' }),
			icon: <IconEdit16 />,
			cb: () => router.push(idToProjectEdit(projectId)),
		},
		{
			label: capitalizeAllWords(
				formatMessage({ id: 'label.manage_addresses' }),
			),
			icon: <IconWalletOutline16 />,
			cb: () => {
				setSelectedProject(project);
				setShowAddressModal(true);
			},
		},
		{
			label: capitalizeAllWords(
				formatMessage({
					id: isActive
						? 'label.deactivate_project'
						: 'label.activate_project',
				}),
			),
			icon: <IconArchiving />,
			cb: () =>
				isActive ? handleDeactivateProject() : handleActivateProject(),
		},
	];

	if (anchorContractAddress) {
		const recurringDonationOption: IOption = {
			label: formatMessage({
				id: 'label.claim_recurring_donation',
			}),
			icon: <IconArrowDownCircle16 />,
			cb: () => {
				if (chainId !== config.OPTIMISM_NETWORK_NUMBER) {
					switchChain({
						chainId: config.OPTIMISM_NETWORK_NUMBER,
					});
				} else {
					setSelectedProject(project);
					setShowClaimModal && setShowClaimModal(true);
				}
			},
		};
		options.push(recurringDonationOption);
	}

	// Add action if project need verification or verification is partially done
	if (
		project.projectVerificationForm?.status === EVerificationStatus.DRAFT ||
		(!project.verified && project.projectVerificationForm === null)
	) {
		options.push({
			label: formatMessage({
				id:
					!project.verified &&
					project.projectVerificationForm?.status !==
						EVerificationStatus.DRAFT
						? 'label.project_verify'
						: 'label.project_verify_resume',
			}),
			icon: <IconVerifiedBadge16 />,
			cb: () =>
				router.push(slugToVerification(project.slug) + '?tab=verify'),
			color: brandColors.giv[500],
		});
	}

	if (
		isDeleteProjectEnabled &&
		project.status.name === EProjectStatus.DRAFT
	) {
		const deleteProjectOption: IOption = {
			label: formatMessage({
				id: 'label.delete_project',
			}),
			icon: <IconTrash16 />,
			color: semanticColors.punch[500],
			cb: () => {
				setSelectedProject(project);
				setShowDeleteModal(true);
			},
		};
		options.push({ type: EOptionType.SEPARATOR });
		options.push(deleteProjectOption);
	}

	const dropdownStyle = {
		padding: '4px 16px',
		borderRadius: '8px',
		background: '',
	};

	return (
		<Actions
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			$isOpen={isHover}
			$isCancelled={isCancelled}
			className={className}
		>
			{isCancelled ? (
				<CancelledWrapper>CANCELLED</CancelledWrapper>
			) : (
				<>
					<Dropdown
						style={dropdownStyle}
						label='Actions'
						options={options}
						stickToRight
					/>
					{deactivateModal && (
						<DeactivateProjectModal
							setShowModal={setDeactivateModal}
							projectId={projectId}
							onSuccess={onDeactivateProject}
						/>
					)}
				</>
			)}
		</Actions>
	);
};

const CancelledWrapper = styled.div`
	padding: 4px 16px;
`;

const Actions = styled.div<{ $isCancelled: boolean; $isOpen: boolean }>`
	cursor: ${props => (props.$isCancelled ? 'default' : 'pointer')};
	background-color: ${neutralColors.gray[200]};
	border-radius: 8px;
	padding: 8px 10px;
`;

export default ProjectActions;
