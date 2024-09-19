import styled from 'styled-components';
import {
	B,
	Caption,
	FlexCenter,
	IconHelpFilled16,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { formatUnits } from 'viem';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { IProject } from '@/apollo/types/types';
import {
	calculateEstimatedMatchingWithDonationAmount,
	getActiveRound,
} from '@/helpers/qf';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { formatDonation } from '@/helpers/number';
import { truncateToDecimalPlaces } from '@/lib/helpers';

interface IEstimatedMatchingToast {
	projectData: IProject;
	amount: bigint;
	token?: IProjectAcceptedToken;
	tokenPrice?: number;
}

const EstimatedMatchingToast: React.FC<IEstimatedMatchingToast> = ({
	projectData,
	token,
	amount,
	tokenPrice,
}) => {
	const { formatMessage, locale } = useIntl();
	const { estimatedMatching, qfRounds } = projectData || {};
	const { allProjectsSum, matchingPool, projectDonationsSqrtRootSum } =
		estimatedMatching || {};

	const { activeStartedRound } = getActiveRound(qfRounds);
	const {
		allocatedFundUSDPreferred,
		allocatedFundUSD,
		allocatedTokenSymbol,
		minimumValidUsdValue,
		maximumReward,
	} = activeStartedRound || {};

	const decimals = token?.decimals || 18;

	const amountInUsd =
		(tokenPrice || 0) *
		(truncateToDecimalPlaces(formatUnits(amount, decimals), decimals) || 0);

	const esMatching = calculateEstimatedMatchingWithDonationAmount(
		amountInUsd,
		projectDonationsSqrtRootSum,
		allProjectsSum,
		allocatedFundUSDPreferred ? allocatedFundUSD : matchingPool,
		maximumReward,
	);

	const isAboveMinValidUsdValue =
		minimumValidUsdValue != null
			? amountInUsd >= minimumValidUsdValue
			: true;

	const formattedDonation = `${formatDonation(
		esMatching,
		allocatedFundUSDPreferred ? '$' : '',
		locale,
		true,
	)} ${allocatedFundUSDPreferred ? '' : ` ${allocatedTokenSymbol}`}`;

	if (!isAboveMinValidUsdValue) return null;

	return (
		<Wrapper>
			<FlexCenter gap='5px'>
				<Caption $medium>
					{formatMessage({
						id: isAboveMinValidUsdValue
							? 'page.donate.matching_toast.upper_valid'
							: 'page.donate.matching_toast.upper_invalid',
					})}
				</Caption>
				<IconWithTooltip
					style={{ marginBottom: '-5px' }}
					icon={<IconHelpFilled16 />}
					direction='top'
				>
					{isAboveMinValidUsdValue && (
						<TooltipContent>
							{formatMessage({
								id: 'component.qf-section.tooltip_polygon',
							})}
						</TooltipContent>
					)}
				</IconWithTooltip>
			</FlexCenter>
			<B>{formattedDonation}</B>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	padding: 4px 16px 8px 16px;
	justify-content: space-between;
	align-items: center;
	border-radius: 8px 8px 0 0;
	background: ${neutralColors.gray[200]};
	color: ${semanticColors.jade[700]};
	margin-bottom: -5px;
`;

export default EstimatedMatchingToast;
