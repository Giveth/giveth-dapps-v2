import styled from 'styled-components';
import {
	Caption,
	neutralColors,
	Flex,
	IconHelpFilled16,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { formatPrice } from '@/lib/helpers';
import {
	calcDonationShare,
	calcDonationShareFor8Decimals,
} from '@/components/views/donate/common/helpers';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import {
	GIVGARDEN_FEE_PERCENTAGE,
	CAUSE_OWNER_FEE_PERCENTAGE,
	DISTRIBUTION_PROJECTS_PERCENTAGE,
} from '@/components/views/causes/constants';
import { IconWithTooltip } from '@/components/IconWithToolTip';

interface ITotalDonation {
	projectTitle?: string;
	totalDonation?: bigint;
	token?: IProjectAcceptedToken;
	isActive?: boolean;
}

const titleSummary = (title?: string) => {
	return title && title.length > 20 ? `${title.slice(0, 20)}...` : title;
};

const CauseTotalDonation: FC<ITotalDonation> = props => {
	const { projectTitle, totalDonation = 0n, token, isActive } = props;

	const { decimals, symbol } = token || {};

	const { formatMessage } = useIntl();

	const { givethDonation, projectDonation } =
		token?.decimals === 8
			? calcDonationShareFor8Decimals(totalDonation, 0)
			: calcDonationShare(totalDonation, 0, decimals);

	const givgardenFee = projectDonation * GIVGARDEN_FEE_PERCENTAGE;
	const causeOwnerFee = projectDonation * CAUSE_OWNER_FEE_PERCENTAGE;
	const distributionProjectsFee =
		projectDonation * DISTRIBUTION_PROJECTS_PERCENTAGE;

	return (
		<Container $isActive={isActive}>
			<TableRow>
				<Caption>
					{formatMessage({ id: 'label.donating_to' })}
					<b>{' ' + titleSummary(projectTitle)}</b>
				</Caption>
				<Caption>
					{isActive
						? formatPrice(projectDonation) + ' ' + symbol
						: '---'}
				</Caption>
			</TableRow>
			<DistributionSummary>
				<TableRow>
					<DistributionHeader>
						{formatMessage({ id: 'label.distribution_breakdown' })}{' '}
						<IconWithTooltipStyled
							direction='right'
							icon={<IconHelpFilled16 />}
						>
							{formatMessage({
								id: 'label.distribution_breakdown_tooltip',
							})}
						</IconWithTooltipStyled>
					</DistributionHeader>
				</TableRow>
				<TableRow>
					<Caption>
						{formatMessage({
							id: 'label.givgarden_community_pool',
						})}
					</Caption>
					<Caption>
						{isActive ? formatPrice(givgardenFee) : '---'} {symbol}
					</Caption>
				</TableRow>
				<TableRow>
					<Caption>
						{formatMessage({ id: 'label.cause_owner' })}
					</Caption>
					<Caption>
						{isActive ? formatPrice(causeOwnerFee) : '---'} {symbol}
					</Caption>
				</TableRow>
				<TableRow>
					<Caption>
						{formatMessage({ id: 'label.distributed_to_projects' })}
					</Caption>
					<Caption>
						{isActive
							? formatPrice(distributionProjectsFee)
							: '---'}{' '}
						{symbol}
					</Caption>
				</TableRow>
			</DistributionSummary>
		</Container>
	);
};

const FlexStyled = styled(Flex)`
	justify-content: space-between;
	gap: 0 10px;
	> div:nth-child(2) {
		flex-shrink: 0;
	}
`;

const DistributionSummary = styled.div`
	border-radius: 8px;
	background: ${neutralColors.gray[300]};
	padding: 8px;
	margin-top: 8px;
`;

const TableRow = styled(FlexStyled)`
	margin-top: 12px;
	padding: 0 8px;
`;

const Container = styled.div<{ $isActive?: boolean }>`
	margin-bottom: 16px;
	opacity: ${props => (props.$isActive ? 1 : 0.5)};
	b {
		font-weight: 500;
	}
`;

const DistributionHeader = styled.h4`
	margin-top: 0px;
	margin-bottom: 4px;
	color: ${neutralColors.gray[800]};
`;

const IconWithTooltipStyled = styled(IconWithTooltip)`
	justify-self: center;
	align-self: center;
	margin-left: 4px;
`;

export default CauseTotalDonation;
