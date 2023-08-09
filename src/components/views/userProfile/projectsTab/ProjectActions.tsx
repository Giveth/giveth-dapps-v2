import {
	brandColors,
	GLink,
	IconChevronDown24,
	IconChevronUp24,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useState } from 'react';
import { IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

const ProjectActions = (props: { project: IProject }) => {
	const { project } = props;
	const status = project.status.name;
	const isCancelled = status === EProjectStatus.CANCEL;

	const [isOpen, setIsOpen] = useState(false);

	return (
		<Actions
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
			isOpen={isOpen}
			size='Big'
			isCancelled={isCancelled}
		>
			<div>Actions</div>
			{isOpen ? <IconChevronUp24 /> : <IconChevronDown24 />}
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
