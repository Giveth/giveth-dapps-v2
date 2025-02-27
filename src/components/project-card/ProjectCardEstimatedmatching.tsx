// Removed this component as it is not used in the project card

import styled from 'styled-components';
import {
	IconHelpFilled16,
	Flex,
	neutralColors,
	Subline,
	H5,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { IconWithTooltip } from '../IconWithToolTip';
import { TooltipContent } from '../modals/HarvestAll.sc';
import { formatDonation } from '@/helpers/number';
import { calculateTotalEstimatedMatching } from '@/helpers/qf';
import { IQFRound } from '@/apollo/types/types';

export const ProjectCardEstimatedmatching = ({
	projectDonationsSqrtRootSum,
	allProjectsSum,
	allocatedFundUSDPreferred,
	allocatedFundUSD,
	matchingPool,
	activeStartedRound,
	allocatedTokenSymbol,
}: {
	projectDonationsSqrtRootSum: number;
	allProjectsSum: number;
	allocatedFundUSDPreferred: boolean;
	allocatedFundUSD: number;
	matchingPool: number;
	activeStartedRound: IQFRound;
	allocatedTokenSymbol: string;
}) => {
	const { formatMessage, locale } = useIntl();

	return (
		<Flex $flexDirection='column' gap='6px'>
			<EstimatedMatchingPrice>
				{formatDonation(
					calculateTotalEstimatedMatching(
						projectDonationsSqrtRootSum,
						allProjectsSum,
						allocatedFundUSDPreferred
							? allocatedFundUSD
							: matchingPool,
						activeStartedRound?.maximumReward,
					),
					allocatedFundUSDPreferred ? '$' : '',
					locale,
					true,
				)}
				{allocatedFundUSDPreferred ? '' : ` ${allocatedTokenSymbol}`}
			</EstimatedMatchingPrice>
			<EstimatedMatching>
				<span>
					{formatMessage({
						id: 'label.estimated_matching',
					})}
				</span>
				<IconWithTooltip icon={<IconHelpFilled16 />} direction='top'>
					<TooltipContent>
						{formatMessage({
							id: 'component.qf-section.tooltip_polygon',
						})}
					</TooltipContent>
				</IconWithTooltip>
			</EstimatedMatching>
		</Flex>
	);
};

const EstimatedMatchingPrice = styled(H5)`
	color: ${semanticColors.jade[500]};
`;

const EstimatedMatching = styled(Subline)`
	display: flex;
	gap: 5px;
	color: ${neutralColors.gray[700]};
	> *:last-child {
		margin-top: 2px;
	}
`;
