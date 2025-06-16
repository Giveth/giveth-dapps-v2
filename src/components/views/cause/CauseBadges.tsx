import React from 'react';
import {
	IconVerifiedBadge16,
	brandColors,
	neutralColors,
	semanticColors,
	Flex,
	IconGIVBack16,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import CauseBadge from '@/components/views/cause/CauseBadge';
import { hasActiveRound } from '@/helpers/qf';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { useCauseContext } from '@/context/cause.context';

const CauseBadges = () => {
	const { causeData } = useCauseContext();

	const {
		verified: causeVerified,
		isGivbackEligible,
		qfRounds,
		campaigns,
	} = causeData || {};
	const { formatMessage } = useIntl();
	const isQF = hasActiveRound(qfRounds);
	const verified = causeVerified || isGivbackEligible;

	if (
		!verified &&
		!isGivbackEligible &&
		!isQF &&
		(!campaigns || campaigns.length === 0)
	) {
		return null;
	}

	return (
		<CustomFlex gap='16px'>
			{verified && (
				<IconWithTooltip
					delay
					icon={
						<CauseBadge
							badgeText={formatMessage({
								id: 'label.verified',
							})}
							wrapperColor={semanticColors.jade[700]}
							BadgeIcon={<IconVerifiedBadge16 />}
						/>
					}
					direction='top'
				>
					<TooltipContent>
						{formatMessage({ id: 'tooltip.vouched' })}
					</TooltipContent>
				</IconWithTooltip>
			)}
			{isGivbackEligible && (
				<IconWithTooltip
					delay
					icon={
						<CauseBadge
							badgeText={formatMessage({
								id: 'label.isGivbackEligible',
							})}
							textColor={brandColors.giv[500]}
							wrapperColor={'white'}
							BadgeIcon={
								<IconGIVBack16 color={brandColors.giv[500]} />
							}
						/>
					}
					direction='top'
				>
					<TooltipContent>
						{formatMessage({ id: 'tooltip.givback_eligible' })}
					</TooltipContent>
				</IconWithTooltip>
			)}

			{isQF && (
				<CauseBadge
					badgeText={formatMessage({
						id: 'label.eligible_for_matching',
					})}
					wrapperColor={brandColors.cyan[600]}
				/>
			)}
			{campaigns &&
				campaigns?.length > 0 &&
				campaigns.map(campaign => (
					<CauseBadge
						key={campaign.id}
						badgeText={campaign.title}
						wrapperColor={neutralColors.gray[900]}
					/>
				))}
		</CustomFlex>
	);
};

const CustomFlex = styled(Flex)`
	overflow-y: hidden;
	white-space: nowrap;
	margin-bottom: 24px;
`;

export const TooltipContent = styled.div`
	color: ${neutralColors.gray[100]};
	cursor: default;
	text-align: center;
	width: 150px;
	font-size: 0.8em;
`;

export default CauseBadges;
