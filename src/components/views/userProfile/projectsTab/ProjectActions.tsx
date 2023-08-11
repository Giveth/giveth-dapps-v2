import {
	brandColors,
	GLink,
	IconArchiving,
	IconEdit16,
	IconEye16,
	IconVerifiedBadge16,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { Dropdown, IOption } from '@/components/Dropdown';

const ProjectActions = (props: { project: IProject }) => {
	const { project } = props;
	const status = project.status.name;
	const isCancelled = status === EProjectStatus.CANCEL;

	const { formatMessage } = useIntl();

	const [isOpen, setIsOpen] = useState(false);

	const options: IOption[] = [
		{
			label: formatMessage({ id: 'label.view_project' }),
			icon: <IconEye16 />,
			// cb: () => setShowShareModal(true),
		},
		{
			label: formatMessage({
				id: 'label.edit',
			}),
			icon: <IconEdit16 />,
			// cb: () => router.push(idToProjectEdit(projectData?.id || '')),
		},
		{
			label: formatMessage({
				id: 'label.verify_your_project',
			}),
			icon: <IconVerifiedBadge16 />,
			// cb: () => setShowVerificationModal(true),
		},
		{
			label: formatMessage({ id: 'label.share_and_get_rewarded' }),
			icon: <IconArchiving size={16} />,
			// cb: () => {
			// 	console.log('verify');
			// 	isActive ? setDeactivateModal(true) : activeProject();
			// },
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
			{/*<div>Actions</div>*/}
			{/*{isOpen ? <IconChevronUp24 /> : <IconChevronDown24 />}*/}
			<Dropdown label='Actions' options={options} />
			{/*<InternalLink*/}
			{/*	href={idToProjectEdit(project.id)}*/}
			{/*	title={formatMessage({*/}
			{/*		id: 'label.edit',*/}
			{/*	})}*/}
			{/*	disabled={isCancelled}*/}
			{/*/>*/}
			{/*<InternalLink*/}
			{/*	href={slugToProjectView(project.slug)}*/}
			{/*	title={formatMessage({*/}
			{/*		id: 'label.view',*/}
			{/*	})}*/}
			{/*	disabled={isCancelled}*/}
			{/*/>*/}
			{/*<CustomGlink*/}
			{/*	onClick={() => {*/}
			{/*		setSelectedProject(project);*/}
			{/*		setShowAddressModal(true);*/}
			{/*	}}*/}
			{/*>*/}
			{/*	{formatMessage({*/}
			{/*		id: 'label.manage_addresses',*/}
			{/*	})}*/}
			{/*</CustomGlink>*/}
		</Actions>
	);
};

const CustomGlink = styled(GLink)`
	padding-top: 2px;
`;

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
