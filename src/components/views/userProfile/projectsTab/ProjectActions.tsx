import {
	brandColors,
	GLink,
	IconChevronUp24,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

const ProjectActions = (props: { project: IProject }) => {
	const { project } = props;
	const status = project.status.name;
	const isCancelled = status === EProjectStatus.CANCEL;
	return (
		<Actions size='Big' isCancelled={isCancelled}>
			<div>Actions</div>
			<IconChevronUp24 />
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

const Actions = styled(GLink)<{ isCancelled: boolean }>`
	display: flex;
	gap: 4px;
	color: ${props =>
		props.isCancelled ? brandColors.pinky[200] : neutralColors.gray[900]};
	cursor: ${props => (props.isCancelled ? 'default' : 'pointer')};
`;

export default ProjectActions;
