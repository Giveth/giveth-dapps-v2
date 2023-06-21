import styled from 'styled-components';
import { Col, Row, mediaQueries } from '@giveth/ui-design-system';
import { useState } from 'react';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import { QfRoundSelector } from './QfRoundSelector';
import { IQFRound } from '@/apollo/types/types';

const ProjectDonationsIndex = () => {
	const [selectedQF, setSelectedQF] = useState<IQFRound | null>(null);

	return (
		<>
			<QfRoundSelector
				selectedQF={selectedQF}
				setSelectedQF={setSelectedQF}
			/>
			<StyledRow>
				<Col lg={4}>
					<ProjectTotalFundCard selectedQF={selectedQF} />
				</Col>
				<Col lg={8}>
					<ProjectDonationTable selectedQF={selectedQF} />
				</Col>
			</StyledRow>
		</>
	);
};

const StyledRow = styled(Row)`
	margin-bottom: 100px;
	${mediaQueries.desktop} {
		align-items: flex-start;
		flex-direction: row-reverse;
	}
`;

export default ProjectDonationsIndex;
