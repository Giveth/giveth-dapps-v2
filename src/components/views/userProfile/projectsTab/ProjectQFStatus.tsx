import styled from 'styled-components';
import {
	SublineBold,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { IProject } from '@/apollo/types/types';
import { getActiveRound, hasActiveRound } from '@/helpers/qf';

interface IProjectQFStatus {
	project: IProject;
}

const ProjectQFStatus = ({ project }: IProjectQFStatus) => {
	const { qfRounds } = project;
	const isRoundActive = hasActiveRound(qfRounds);
	const activeRound = getActiveRound(qfRounds);
	console.log('activeRound', activeRound);
	console.log('isRoundActive', isRoundActive);

	const handleQFTermsText = isRoundActive
		? `Eligible for QF round #${activeRound?.id}`
		: 'Not eligible';

	return (
		<StatusBadge isRoundActive={isRoundActive}>
			<SublineBold>{handleQFTermsText}</SublineBold>
		</StatusBadge>
	);
};

const getBackgroundColor = (isRoundActive: boolean) => {
	return isRoundActive ? brandColors.giv[100] : neutralColors.gray[100];
};

const getBorderColor = (isRoundActive: boolean) => {
	return isRoundActive ? brandColors.giv[400] : neutralColors.gray[400];
};

const getColor = (isRoundActive: boolean) => {
	return isRoundActive ? brandColors.giv[700] : neutralColors.gray[700];
};

const StatusBadge = styled.div<{ isRoundActive: boolean }>`
	border-radius: 50px;
	padding: 2px 8px;
	border-width: 2px;
	border-style: solid;
	background-color: ${({ isRoundActive }) =>
		getBackgroundColor(isRoundActive)};
	border-color: ${({ isRoundActive }) => getBorderColor(isRoundActive)};
	color: ${({ isRoundActive }) => getColor(isRoundActive)};
`;

export default ProjectQFStatus;
