import styled from 'styled-components';
import { Col, Row, mediaQueries, Caption } from '@giveth/ui-design-system';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import { CauseQfRoundSelector } from '@/components/views/cause/causeDonations/CauseQfRoundSelector';
import { IQFRound } from '@/apollo/types/types';
import ProjectRecurringDonationTable from './ProjectRecurringDonationTable';

export interface CauseDonationSwiperState {
	selectedQF: IQFRound | null;
	isRecurringSelected: boolean;
}

const CauseDonationsIndex = () => {
	const [causeDonationSwiperState, setCauseDonationSwiperState] =
		useState<CauseDonationSwiperState>({
			selectedQF: null,
			isRecurringSelected: false,
		});
	const { formatMessage } = useIntl();
	const { selectedQF, isRecurringSelected } = causeDonationSwiperState;

	return (
		<>
			<CauseQfRoundSelector
				causeDonationSwiperState={causeDonationSwiperState}
				setCauseDonationSwiperState={setCauseDonationSwiperState}
			/>
			<StyledRow>
				<Col lg={4}>
					<ProjectTotalFundCard selectedQF={selectedQF} />
				</Col>
				<Col lg={8}>
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

export default CauseDonationsIndex;
