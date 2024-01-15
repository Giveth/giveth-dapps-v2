import styled from 'styled-components';
import { SublineBold, semanticColors } from '@giveth/ui-design-system';
import { IProject } from '@/apollo/types/types';

interface IProjectListedStatus {
	project: IProject;
}

const ProjectListedStatus = ({ project }: IProjectListedStatus) => {
	const listed = project.listed ?? false;

	const handleListedText = listed ? 'Listed' : 'Not Listed';

	return (
		<StatusBadge isListed={listed}>
			<SublineBold>{handleListedText}</SublineBold>
		</StatusBadge>
	);
};

const getBackgroundColor = (isListed: boolean) => {
	return isListed ? semanticColors.jade[100] : semanticColors.punch[100];
};

const getBorderColor = (isListed: boolean) => {
	return isListed ? semanticColors.jade[400] : semanticColors.punch[400];
};

const getColor = (isListed: boolean) => {
	return isListed ? semanticColors.jade[700] : semanticColors.punch[700];
};

const StatusBadge = styled.div<{ isListed: boolean }>`
	border-radius: 50px;
	padding: 2px 8px;
	border-width: 2px;
	border-style: solid;
	background-color: ${({ isListed }) => getBackgroundColor(isListed)};
	border-color: ${({ isListed }) => getBorderColor(isListed)};
	color: ${({ isListed }) => getColor(isListed)};
`;

export default ProjectListedStatus;
