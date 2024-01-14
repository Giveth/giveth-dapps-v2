import {
	IconArrowDownCircle16,
	IconEdit16,
	IconEye16,
	IconUpdate16,
	IconWalletOutline16,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useIntl } from 'react-intl';
import router from 'next/router';
import { IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { Dropdown, IOption } from '@/components/Dropdown';
import { idToProjectEdit, slugToProjectView } from '@/lib/routeCreators';
import { capitalizeAllWords } from '@/lib/helpers';
import { isRecurringActive } from '../../donate/DonationCard';

interface IProjectActions {
	project: IProject;
	setSelectedProject: Dispatch<SetStateAction<IProject | undefined>>;
	setShowAddressModal: Dispatch<SetStateAction<boolean>>;
	setShowClaimModal: Dispatch<SetStateAction<boolean>>;
}

const ProjectActions = (props: IProjectActions) => {
	const {
		project,
		setSelectedProject,
		setShowAddressModal,
		setShowClaimModal,
	} = props;
	const status = project.status.name;
	const isCancelled = status === EProjectStatus.CANCEL;

	const { formatMessage } = useIntl();

	const [isHover, setIsHover] = useState(false);

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

	const recurringDonationOption: IOption = {
		label: 'Claim Recurring donation',
		icon: <IconArrowDownCircle16 />,
		cb: () => {
			setSelectedProject(project);
			setShowClaimModal(true);
		},
	};

	isRecurringActive && options.push(recurringDonationOption);

	const dropdownStyle = {
		padding: '4px 16px',
		borderRadius: '8px',
	};

	return (
		<Actions
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			isOpen={isHover}
			isCancelled={isCancelled}
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

const Actions = styled.div<{ isCancelled: boolean; isOpen: boolean }>`
	cursor: ${props => (props.isCancelled ? 'default' : 'pointer')};
	background-color: ${neutralColors.gray[200]};
	border-radius: 8px;
	padding: 8px 10px;
`;

export default ProjectActions;
