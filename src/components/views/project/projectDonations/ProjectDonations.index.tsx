import styled from 'styled-components';
import { Col, Row, mediaQueries } from '@giveth/ui-design-system';
import { useState } from 'react';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import { QfRoundSelector } from './QfRoundSelector';
import { IQFRound } from '@/apollo/types/types';
import ProjectRecurringDonationTable from './ProjectRecurringDonationTable';

const ProjectDonationsIndex = () => {
	const [selectedQF, setSelectedQF] = useState<IQFRound | null>(null);
	const [isRecurringSelected, setIsRecurringSelected] = useState(false);
	return (
		<>
			<QfRoundSelector
				selectedQF={selectedQF}
				setSelectedQF={setSelectedQF}
				isRecurringSelected={isRecurringSelected}
				setIsRecurringSelected={setIsRecurringSelected}
			/>
			<StyledRow>
				<Col lg={4}>
					<ProjectTotalFundCard selectedQF={selectedQF} />
				</Col>
				<Col lg={8}>
					{!isRecurringSelected ? (
						<ProjectDonationTable selectedQF={selectedQF} />
					) : (
						<ProjectRecurringDonationTable />
					)}
				</Col>
			</StyledRow>
		</>
	);
};

const StyledRow = styled(Row)`
	margin-bottom: 100px;
	${mediaQueries.laptopL} {
		flex-direction: row-reverse;
		align-items: stretch !important;
	}
`;

export default ProjectDonationsIndex;
