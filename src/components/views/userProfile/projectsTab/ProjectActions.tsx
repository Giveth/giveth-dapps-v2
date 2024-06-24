import {
	GLink,
	IconArrowDownCircle16,
	IconEdit16,
	IconEye16,
	IconTrash16,
	IconUpdate16,
	IconWalletOutline16,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Dispatch, type FC, SetStateAction, useState } from 'react';
import { useIntl } from 'react-intl';
import router from 'next/router';
import { useAccount, useSwitchChain } from 'wagmi';
import { IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { Dropdown, EOptionType, IOption } from '@/components/Dropdown';
import { idToProjectEdit, slugToProjectView } from '@/lib/routeCreators';
import { capitalizeAllWords } from '@/lib/helpers';
import config, { isDeleteProjectEnabled } from '@/configuration';
import { findAnchorContractAddress } from '@/helpers/superfluid';

interface IProjectActions {
	project: IProject;
	setSelectedProject: Dispatch<SetStateAction<IProject | undefined>>;
	setShowAddressModal: Dispatch<SetStateAction<boolean>>;
	setShowClaimModal?: Dispatch<SetStateAction<boolean>>;
	setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
	className?: string;
}

const ProjectActions: FC<IProjectActions> = ({
	project,
	setSelectedProject,
	setShowAddressModal,
	setShowClaimModal,
	setShowDeleteModal,
	className,
}) => {
	const [isHover, setIsHover] = useState(false);
	const { formatMessage } = useIntl();

	const status = project.status.name;
	const isCancelled = status === EProjectStatus.CANCEL;

	const anchorContractAddress = findAnchorContractAddress(
		project.anchorContracts,
	);

	const { chain } = useAccount();
	const { switchChain } = useSwitchChain();
	const chainId = chain?.id;

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
			cb: () => router.push(idToProjectEdit(project?.id)),
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
				<Dropdown
					style={dropdownStyle}
					label='Actions'
					options={options}
					stickToRight
				/>
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
