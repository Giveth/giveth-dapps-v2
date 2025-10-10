import styled from 'styled-components';
import { Col, Row, mediaQueries, Caption } from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import { IQFRound } from '@/apollo/types/types';
import ProjectRecurringDonationTable from './ProjectRecurringDonationTable';
import ProjectDonationsDropdown from '@/components/views/project/projectDonations/ProjectDonationsDropdown';
import { fetchProjectQfRounds } from '@/helpers/projects';
import { useProjectContext } from '@/context/project.context';

export interface ProjectDonationSwiperState {
	selectedQF: IQFRound | null;
	isRecurringSelected: boolean;
}

const ProjectDonationsIndex = () => {
	const [projectDonationSwiperState, setProjectDonationSwiperState] =
		useState<ProjectDonationSwiperState>({
			selectedQF: null,
			isRecurringSelected: false,
		});
	const { formatMessage } = useIntl();
	const { selectedQF, isRecurringSelected } = projectDonationSwiperState;
	const { projectData } = useProjectContext();

	// Fetch project QF rounds
	const [qfRounds, setQfRounds] = useState<IQFRound[]>([]);

	useEffect(() => {
		const fetchQfRounds = async () => {
			const rounds = await fetchProjectQfRounds(
				projectData?.id ?? '',
				false,
			);
			setQfRounds(rounds);
		};
		if (projectData?.id) {
			fetchQfRounds();
		}
	}, [projectData?.id]);

	return (
		<>
			<StyledRow>
				<Col lg={4}>
					<ProjectTotalFundCard
						qfRounds={qfRounds}
						selectedQF={selectedQF}
					/>
				</Col>
				<Col lg={8}>
					<ProjectDonationsDropdown
						qfRounds={qfRounds}
						projectDonationSwiperState={projectDonationSwiperState}
						setProjectDonationSwiperState={
							setProjectDonationSwiperState
						}
					/>
					{!isRecurringSelected ? (
						<ProjectDonationTable selectedQF={selectedQF} />
					) : (
						<>
							<InfoCaption>
								{formatMessage({
									id: 'label.recurring_donation_updated_hours',
								})}
							</InfoCaption>
							<ProjectRecurringDonationTable />
						</>
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

const InfoCaption = styled(Caption)`
	margin: 5px 0 5px 0;
	font-style: italic;
`;

export default ProjectDonationsIndex;
