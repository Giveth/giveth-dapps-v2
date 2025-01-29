import styled from 'styled-components';
import Image from 'next/image';
import {
	B,
	Caption,
	FlexCenter,
	IconHelpFilled16,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
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
import { calculateQFTimeDifferences } from '@/helpers/time';

interface IEstimatedMatchingToast {
	projectData: IProject;
	amount: bigint;
	token?: IProjectAcceptedToken;
	tokenPrice?: number;
	isStellar?: boolean;
	show?: boolean;
}

const EstimatedMatchingToast: FC<IEstimatedMatchingToast> = ({
	projectData,
	token,
	amount,
	tokenPrice,
	isStellar,
	show,
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
		maximumReward,
		clusterMatchingSyncAt,
	} = activeStartedRound || {};

	const clusterMatchingSyncAtDiff = calculateQFTimeDifferences(
		clusterMatchingSyncAt || '',
	);

	const decimals = isStellar ? 18 : token?.decimals || 18;
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

	const formattedDonation = `${formatDonation(
		esMatching,
		allocatedFundUSDPreferred ? '$' : '',
		locale,
		true,
	)} ${allocatedFundUSDPreferred ? '' : ` ${allocatedTokenSymbol}`}`;

	return (
		<Wrapper show={show}>
			<FlexCenter gap='5px'>
				<Caption $medium>
					{formatMessage({ id: 'label.estimated_matching' })}
				</Caption>
				<IconWithTooltip
					style={{ marginBottom: '-5px' }}
					icon={<IconHelpFilled16 />}
					direction='top'
				>
					<TooltipContent>
						{formatMessage({
							id: 'component.qf-section.tooltip_polygon',
						})}
						<ToolTipBellow>
							<Image
								src={'/images/icons/clock.svg'}
								alt='score'
								width={16}
								height={16}
							/>
							{formatMessage(
								{
									id: 'component.qf-section.estimated_time',
								},
								{
									time: clusterMatchingSyncAtDiff,
								},
							)}
						</ToolTipBellow>
					</TooltipContent>
				</IconWithTooltip>
			</FlexCenter>
			<B>{formattedDonation}</B>
		</Wrapper>
	);
};

const Wrapper = styled.div<{ show?: boolean }>`
	display: flex;
	padding: 4px 16px 8px 16px;
	justify-content: space-between;
	align-items: center;
	border-radius: 8px 8px 0 0;
	background: ${neutralColors.gray[200]};
	color: ${semanticColors.jade[700]};
	margin-bottom: -5px;
	opacity: ${({ show }) => (show ? 1 : 0)};
`;

const ToolTipBellow = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	border-top: 1px solid #121848;
	margin: 7px 0;
	padding: 7px 0 0 0;
	line-height: 16px;
	& img {
		margin: 0 6px 0 0;
	}
`;

export default EstimatedMatchingToast;
