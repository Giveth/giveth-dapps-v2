import {
	brandColors,
	GLink,
	IconArchiving,
	IconArrowDownCircle16,
	IconEdit16,
	IconEye16,
	IconUpdate16,
	IconVerifiedBadge16,
	IconWalletOutline16,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useIntl } from 'react-intl';
import router from 'next/router';
import { useAccount, useSwitchChain } from 'wagmi';
import { captureException } from '@sentry/nextjs';
import { EVerificationStatus, IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { Dropdown, IOption } from '@/components/Dropdown';
import {
	idToProjectEdit,
	slugToProjectView,
	slugToVerification,
} from '@/lib/routeCreators';
import { capitalizeAllWords, showToastError } from '@/lib/helpers';
import config from '@/configuration';
import { findAnchorContractAddress } from '@/helpers/superfluid';
import DeactivateProjectModal from '@/components/modals/deactivateProject/DeactivateProjectIndex';
import { client } from '@/apollo/apolloClient';
import { ACTIVATE_PROJECT } from '@/apollo/gql/gqlProjects';

interface IProjectActions {
	project: IProject;
	setSelectedProject: Dispatch<SetStateAction<IProject | undefined>>;
	setShowAddressModal: Dispatch<SetStateAction<boolean>>;
	setShowClaimModal?: Dispatch<SetStateAction<boolean>>;
	setProjects: Dispatch<SetStateAction<IProject[]>>;
}

const ProjectActions = (props: IProjectActions) => {
	const [deactivateModal, setDeactivateModal] = useState(false);

	const {
		project,
		setSelectedProject,
		setShowAddressModal,
		setShowClaimModal,
		setProjects,
	} = props;
	const status = project.status.name;
	const isCancelled = status === EProjectStatus.CANCEL;
	const isActive = status === EProjectStatus.ACTIVE;
	const projectId = project?.id;

	const [activeProject, setActiveProject] = useState(isActive);

	const { formatMessage } = useIntl();

	const [isHover, setIsHover] = useState(false);

	const anchorContractAddress = findAnchorContractAddress(
		project.anchorContracts,
	);

	const { chain } = useAccount();
	const { switchChain } = useSwitchChain();
	const chainId = chain?.id;

	const activateProject = async () => {
		setActiveProject(true);
		try {
			await client.mutate({
				mutation: ACTIVATE_PROJECT,
				variables: { projectId: Number(projectId || '') },
			});
		} catch (e) {
			showToastError(e);
			captureException(e, {
				tags: {
					section: 'handleProjectStatus',
				},
			});
		}

		setProjects((currentProjects: IProject[]) => {
			return currentProjects.map(project => {
				if (project.id === projectId) {
					return {
						...project,
						status: {
							id: '5',
							name: EProjectStatus.ACTIVE,
						},
					};
				}
				return project;
			});
		});
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
					id: activeProject
						? 'label.deactivate_project'
						: 'label.activate_project',
				}),
			),
			icon: <IconArchiving />,
			cb: () =>
				activeProject ? setDeactivateModal(true) : activateProject(),
		},
	];

	// Add action if project need verification or verification is partially done
	if (
		project.projectVerificationForm?.status === EVerificationStatus.DRAFT ||
		!project.verified
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

	anchorContractAddress && options.push(recurringDonationOption);

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

const ActionsOld = styled(GLink)<{ $isCancelled: boolean; $isOpen: boolean }>`
	color: ${props =>
		props.$isCancelled ? neutralColors.gray[500] : neutralColors.gray[900]};
	cursor: ${props => (props.$isCancelled ? 'default' : 'pointer')};
`;

export default ProjectActions;
