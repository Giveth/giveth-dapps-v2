import styled from 'styled-components';
import { SublineBold, semanticColors } from '@giveth/ui-design-system';
import { IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

interface IProjectStatusBadge {
	project: IProject;
}

const ProjectStatusBadge = ({ project }: IProjectStatusBadge) => {
	const projectStatus = project.status.name!;

	const handleStatusText = () => {
		switch (projectStatus) {
			case EProjectStatus.ACTIVE:
				return 'Active';
			case EProjectStatus.DEACTIVE:
				return 'Deactivated';
			case EProjectStatus.DRAFT:
				return 'Draft';
		}
	};

	return (
		<StatusBadge status={projectStatus}>
			<SublineBold>{handleStatusText()}</SublineBold>
		</StatusBadge>
	);
};

const getBackgroundColor = (status: EProjectStatus) => {
	switch (status) {
		case EProjectStatus.ACTIVE:
			return semanticColors.jade[100];
		case EProjectStatus.DEACTIVE:
			return semanticColors.golden[100];
		default:
			return semanticColors.blueSky[100];
	}
};

const getBorderColor = (status: EProjectStatus) => {
	switch (status) {
		case EProjectStatus.ACTIVE:
			return semanticColors.jade[400];
		case EProjectStatus.DEACTIVE:
			return semanticColors.golden[400];
		default:
			return semanticColors.blueSky[400];
	}
};

const getColor = (status: EProjectStatus) => {
	switch (status) {
		case EProjectStatus.ACTIVE:
			return semanticColors.jade[700];
		case EProjectStatus.DEACTIVE:
			return semanticColors.golden[700];
		default:
			return semanticColors.blueSky[700];
	}
};

const StatusBadge = styled.div<{ status: EProjectStatus }>`
	border-radius: 50px;
	padding: 2px 8px;
	border-width: 2px;
	border-style: solid;
	background-color: ${({ status }) => getBackgroundColor(status)};
	border-color: ${({ status }) => getBorderColor(status)};
	color: ${({ status }) => getColor(status)};
`;

export default ProjectStatusBadge;
