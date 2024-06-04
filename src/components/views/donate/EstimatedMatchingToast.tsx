import styled from 'styled-components';
import {
	B,
	Caption,
	IconHelpFilled16,
	neutralColors,
	semanticColors,
	Subline,
	FlexCenter,
} from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import Divider from '@/components/Divider';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { IProject } from '@/apollo/types/types';
import {
	calculateEstimatedMatchingWithDonationAmount,
	getActiveRound,
} from '@/helpers/qf';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { formatDonation } from '@/helpers/number';
import { useTokenPrice } from '@/hooks/useTokenPrice';

interface IEstimatedMatchingToast {
	projectData: IProject;
	token?: IProjectAcceptedToken;
	amountTyped?: number;
}

const EstimatedMatchingToast = ({
	projectData,
	token,
	amountTyped,
}: IEstimatedMatchingToast) => {
	const { formatMessage, locale } = useIntl();
	const { estimatedMatching, qfRounds } = projectData || {};
	const { allProjectsSum, matchingPool, projectDonationsSqrtRootSum } =
		estimatedMatching || {};

	const tokenPrice = useTokenPrice(token);

	const { activeStartedRound } = getActiveRound(qfRounds);
	const {
		allocatedFundUSDPreferred,
		allocatedFundUSD,
		allocatedTokenSymbol,
	} = activeStartedRound || {};

	const esMatching = calculateEstimatedMatchingWithDonationAmount(
		(tokenPrice || 0) * (amountTyped || 0),
		projectDonationsSqrtRootSum,
		allProjectsSum,
		allocatedFundUSDPreferred ? allocatedFundUSD : matchingPool,
		activeStartedRound?.maximumReward,
	);

	return (
		<Wrapper>
			<Upper>
				<EstimatedMatching>
					<Caption $medium>
						{formatMessage({
							id: 'page.donate.matching_toast.upper',
						})}
					</Caption>
					<IconWithTooltip
						icon={
							<IconHelpFilled16
								color={semanticColors.jade['700']}
							/>
						}
						direction='top'
					>
						<TooltipContent>
							{formatMessage({
								id: 'component.qf-section.tooltip_polygon',
							})}
						</TooltipContent>
					</IconWithTooltip>
				</EstimatedMatching>
				<B>
					{formatDonation(
						esMatching,
						allocatedFundUSDPreferred ? '$' : '',
						locale,
						true,
					)}{' '}
					{allocatedFundUSDPreferred ? '' : allocatedTokenSymbol}
				</B>
			</Upper>
			<Divider />
			<Bottom>
				{formatMessage({ id: 'page.donate.matching_toast.bottom' })}
			</Bottom>
		</Wrapper>
	);
};

const EstimatedMatching = styled(FlexCenter)`
	gap: 4px;
	> *:last-child {
		margin-top: 3px;
	}
`;

const Bottom = styled(Subline)`
	color: ${neutralColors.gray['800']};
	margin-top: 4px;
`;

const Upper = styled.div`
	margin-bottom: 4px;
	color: ${semanticColors.jade['700']};
	display: flex;
	justify-content: space-between;
`;

const Wrapper = styled.div`
	border: 1px solid ${semanticColors.jade['500']};
	border-radius: 8px;
	padding: 16px;
	margin-top: 8px;
`;

export default EstimatedMatchingToast;
