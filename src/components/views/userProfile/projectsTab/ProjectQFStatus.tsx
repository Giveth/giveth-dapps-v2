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
	showRoundName?: boolean;
}

const ProjectQFStatus = ({
	project,
	showRoundName = false,
}: IProjectQFStatus) => {
	const { qfRounds } = project;
	const isRoundActive = hasActiveRound(qfRounds);
	const { activeStartedRound } = getActiveRound(qfRounds);

	const handleQFTermsText = isRoundActive
		? `Eligible for QF round #${activeStartedRound?.id}`
		: 'Not eligible';

	const roundNameText = isRoundActive ? activeStartedRound?.name : 'None';

	return (
		<StatusBadge $isRoundActive={isRoundActive}>
			<SublineBold>
				{showRoundName ? roundNameText : handleQFTermsText}
			</SublineBold>
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

const StatusBadge = styled.div<{ $isRoundActive: boolean }>`
	border-radius: 50px;
	padding: 2px 8px;
	border-width: 2px;
	border-style: solid;
	background-color: ${({ $isRoundActive }) =>
		getBackgroundColor($isRoundActive)};
	border-color: ${({ $isRoundActive }) => getBorderColor($isRoundActive)};
	color: ${({ $isRoundActive }) => getColor($isRoundActive)};
`;

export default ProjectQFStatus;
