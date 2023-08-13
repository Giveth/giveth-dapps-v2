import {
	brandColors,
	GLink,
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

interface IProjectActions {
	project: IProject;
	setSelectedProject: Dispatch<SetStateAction<IProject | undefined>>;
	setShowAddressModal: Dispatch<SetStateAction<boolean>>;
}

const ProjectActions = (props: IProjectActions) => {
	const { project, setSelectedProject, setShowAddressModal } = props;
	const status = project.status.name;
	const isCancelled = status === EProjectStatus.CANCEL;

	const { formatMessage } = useIntl();

	const [isOpen, setIsOpen] = useState(false);

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
			label: formatMessage({ id: 'label.manage_addresses' }),
			icon: <IconWalletOutline16 />,
			cb: () => {
				setSelectedProject(project);
				setShowAddressModal(true);
			},
		},
	];

	return (
		<Actions
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
			isOpen={isOpen}
			size='Big'
			isCancelled={isCancelled}
		>
			<Dropdown label='Actions' options={options} />
		</Actions>
	);
};

const Actions = styled(GLink)<{ isCancelled: boolean; isOpen: boolean }>`
	padding: 4px 16px;
	border-radius: 8px;
	display: flex;
	gap: 4px;
	color: ${props =>
		props.isCancelled ? brandColors.pinky[200] : neutralColors.gray[900]};
	cursor: ${props => (props.isCancelled ? 'default' : 'pointer')};
	${props => props.isOpen && 'background: white;'}
`;

export default ProjectActions;
