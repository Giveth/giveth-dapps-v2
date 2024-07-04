import styled from 'styled-components';
import {
	B,
	Caption,
	IconHelpFilled16,
	IconAlertTriangleFilled,
	neutralColors,
	semanticColors,
	Subline,
	FlexCenter,
} from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { formatUnits } from 'viem';
import Divider from '@/components/Divider';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { IProject } from '@/apollo/types/types';
import {
	calculateEstimatedMatchingWithDonationAmount,
	getActiveRound,
} from '@/helpers/qf';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { formatDonation } from '@/helpers/number';
import { formatBalance, truncateToDecimalPlaces } from '@/lib/helpers';

interface IEstimatedMatchingToast {
	projectData: IProject;
	amount: bigint;
	token?: IProjectAcceptedToken;
}

const EstimatedMatchingToast: React.FC<IEstimatedMatchingToast> = ({
	projectData,
	token,
	amount,
}) => {
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

	const borderColor = isAboveMinValidUsdValue
		? semanticColors.jade['500']
		: semanticColors.golden['500'];

	const textColor = isAboveMinValidUsdValue
		? semanticColors.jade['700']
		: semanticColors.golden['500'];

	const tooltipIcon = isAboveMinValidUsdValue ? (
		<IconHelpFilled16 color={textColor} />
	) : (
		<IconAlertTriangleFilled color={textColor} />
	);

	const formattedDonation = isAboveMinValidUsdValue
		? `${formatDonation(
				esMatching,
				allocatedFundUSDPreferred ? '$' : '',
				locale,
				true,
			)} ${allocatedFundUSDPreferred ? '' : ` ${allocatedTokenSymbol}`}`
		: '---';

	const bottomText = isAboveMinValidUsdValue
		? formatMessage({ id: 'page.donate.matching_toast.bottom_valid' })
		: formatMessage({
				id: 'page.donate.matching_toast.bottom_invalid_p1',
			}) +
			' $' +
			formatBalance(minimumValidUsdValue) +
			' ' +
			formatMessage({
				id: 'page.donate.matching_toast.bottom_invalid_p2',
			});

	return (
		<Wrapper style={{ borderColor }}>
			<Upper style={{ color: textColor }}>
				<EstimatedMatching>
					<Caption $medium>
						{formatMessage({
							id: isAboveMinValidUsdValue
								? 'page.donate.matching_toast.upper_valid'
								: 'page.donate.matching_toast.upper_invalid',
						})}
					</Caption>
					<IconWithTooltip icon={tooltipIcon} direction='top'>
						{isAboveMinValidUsdValue && (
							<TooltipContent>
								{formatMessage({
									id: 'component.qf-section.tooltip_polygon',
								})}
							</TooltipContent>
						)}
					</IconWithTooltip>
				</EstimatedMatching>
				<B>{formattedDonation}</B>
			</Upper>
			<Divider />
			<Bottom>{bottomText}</Bottom>
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
	display: flex;
	justify-content: space-between;
`;

const Wrapper = styled.div`
	border: 1px solid;
	border-radius: 8px;
	padding: 16px;
	margin-top: 8px;
`;

export default EstimatedMatchingToast;
