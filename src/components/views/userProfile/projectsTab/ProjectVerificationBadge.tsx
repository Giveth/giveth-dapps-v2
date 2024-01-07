import { SublineBold, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IProject } from '@/apollo/types/types';

interface IProjectVerificationBadge {
	project: IProject;
}

const ProjectVerificationBadge = ({ project }: IProjectVerificationBadge) => {
	const isVerified = project.verified ?? false;

	const handleVerifiedStatusText = isVerified ? 'Verified' : 'Not Verified';

	return (
		<StatusBadge isVerified={isVerified}>
			<SublineBold>{handleVerifiedStatusText}</SublineBold>
		</StatusBadge>
	);
};

const getBackgroundColor = (isVerified: boolean) => {
	return isVerified ? semanticColors.jade[100] : semanticColors.punch[100];
};

const getBorderColor = (isVerified: boolean) => {
	return isVerified ? semanticColors.jade[400] : semanticColors.punch[400];
};

const getColor = (isVerified: boolean) => {
	return isVerified ? semanticColors.jade[700] : semanticColors.punch[700];
};

const StatusBadge = styled.div<{ isVerified: boolean }>`
	border-radius: 50px;
	padding: 2px 8px;
	border-width: 2px;
	border-style: solid;
	background-color: ${({ isVerified }) => getBackgroundColor(isVerified)};
	border-color: ${({ isVerified }) => getBorderColor(isVerified)};
	color: ${({ isVerified }) => getColor(isVerified)};
`;

export default ProjectVerificationBadge;
