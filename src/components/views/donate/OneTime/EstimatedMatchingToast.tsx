import styled from 'styled-components';
import {
	B,
	Caption,
	FlexCenter,
	IconHelpFilled16,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { formatUnits } from 'viem';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { IProject } from '@/apollo/types/types';
import { calculateEstimatedMatchingWithDonationAmount } from '@/helpers/qf';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { formatDonation } from '@/helpers/number';
import { truncateToDecimalPlaces } from '@/lib/helpers';
import { useCauseDonateData } from '@/context/donate.cause.context';
import { useDonateData } from '@/context/donate.context';
import { EProjectType } from '../../../../apollo/types/gqlEnums';

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
	const { estimatedMatching } = projectData || {};

	const causeDonateData = useCauseDonateData();
	const donateData = useDonateData();

	const { selectedQFRound } =
		projectData.projectType === EProjectType.CAUSE
			? causeDonateData
			: donateData;

	const {
		allocatedFundUSDPreferred,
		allocatedFundUSD,
		allocatedTokenSymbol,
		maximumReward,
	} = selectedQFRound || {};

	// Find round that matches the selectedQFRound
	const [matchingData, setMatchingData] = useState({
		allProjectsSum: 0,
		matchingPool: 0,
		projectDonationsSqrtRootSum: 0,
	});

	useEffect(() => {
		if (estimatedMatching) {
			const estimatedMatched = estimatedMatching.find(
				estimatedMatching =>
					String(estimatedMatching.qfRoundId) ===
					(selectedQFRound?.id ?? ''),
			);
			if (estimatedMatched) {
				setMatchingData({
					allProjectsSum: estimatedMatched.allProjectsSum,
					matchingPool: estimatedMatched.matchingPool,
					projectDonationsSqrtRootSum:
						estimatedMatched.projectDonationsSqrtRootSum,
				});
			}
		}
	}, [estimatedMatching, selectedQFRound]);

	const { allProjectsSum, matchingPool, projectDonationsSqrtRootSum } =
		matchingData;

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

export default EstimatedMatchingToast;
