import styled from 'styled-components';
import { Col, Row, mediaQueries } from '@giveth/ui-design-system';
import { useState } from 'react';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import { QfRoundSelector } from './QfRoundSelector';
import { IQFRound } from '@/apollo/types/types';
import { useProjectContext } from '@/context/project.context';
import { NoDonation } from './NoDonation';

const ProjectDonationsIndex = () => {
	const [selectedQF, setSelectedQF] = useState<IQFRound | null>(null);
	const { projectData } = useProjectContext();
	const { countUniqueDonors } = projectData || {};
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
					{countUniqueDonors !== undefined &&
					countUniqueDonors > 0 ? (
						<ProjectDonationTable selectedQF={selectedQF} />
					) : !selectedQF || selectedQF.isActive ? (
						<NoDonation />
					) : null}
				</Col>
			</StyledRow>
		</>
	);
};

const StyledRow = styled(Row)`
	margin-bottom: 100px;
	${mediaQueries.laptopL} {
		align-items: flex-start;
		flex-direction: row-reverse;
	}
`;

export default ProjectDonationsIndex;
