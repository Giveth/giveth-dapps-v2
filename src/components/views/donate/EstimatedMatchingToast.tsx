import styled from 'styled-components';
import {
	B,
	Caption,
	IconHelpFilled16,
	neutralColors,
	semanticColors,
	Subline,
} from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import Divider from '@/components/Divider';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { FlexCenter } from '@/components/styled-components/Flex';
import { IDonationProject } from '@/apollo/types/types';
import { calculateEstimatedMatchingWithDonationAmount } from '@/helpers/qf';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { formatDonation } from '@/helpers/number';
import { useTokenPrice } from '@/hooks/useTokenPrice';

interface IEstimatedMatchingToast {
	projectData: IDonationProject;
	token?: IProjectAcceptedToken;
	amountTyped?: number;
}

const EstimatedMatchingToast = ({
	projectData,
	token,
	amountTyped,
}: IEstimatedMatchingToast) => {
	const { formatMessage, locale } = useIntl();
	const { estimatedMatching } = projectData || {};
	const { allProjectsSum, matchingPool, projectDonationsSqrtRootSum } =
		estimatedMatching || {};

	const tokenPrice = useTokenPrice(token);

	const esMatching = calculateEstimatedMatchingWithDonationAmount(
		(tokenPrice || 0) * (amountTyped || 0),
		projectDonationsSqrtRootSum,
		allProjectsSum,
		matchingPool,
	);

	return (
		<Wrapper>
			<Upper>
				<FlexCenter gap='4px'>
					<Caption medium>
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
								id: 'tooltip.donation.matching_polygon',
							})}
						</TooltipContent>
					</IconWithTooltip>
				</FlexCenter>
				<B>{formatDonation(esMatching, '', locale, true)}</B>
			</Upper>
			<Divider />
			<Bottom>
				{formatMessage({ id: 'page.donate.matching_toast.bottom' })}
			</Bottom>
		</Wrapper>
	);
};

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
