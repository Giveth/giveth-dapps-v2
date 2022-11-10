import styled from 'styled-components';
import { Caption, neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { formatPrice } from '@/lib/helpers';
import { minDonationAmount } from '@/lib/constants/constants';

interface ITotalDonation {
	projectTitle?: string;
	donationToGiveth: number;
	donationToProject?: number;
	tokenSymbol?: string;
	isActive?: boolean;
}

const titleSummary = (title?: string) => {
	return title && title.length > 20 ? `${title.slice(0, 20)}...` : title;
};

const TotalDonation: FC<ITotalDonation> = props => {
	const {
		projectTitle,
		donationToGiveth = 0,
		donationToProject = 0,
		tokenSymbol,
		isActive,
	} = props;

	const { formatMessage } = useIntl();

	let donationToGivethAmount = (donationToProject * donationToGiveth) / 100;
	if (
		donationToGivethAmount < minDonationAmount &&
		donationToGivethAmount > 0
	) {
		donationToGivethAmount = minDonationAmount;
	}

	const totalDonation = formatPrice(
		donationToProject + donationToGivethAmount,
	);

	return (
		<Container isActive={isActive}>
			<TableRow>
				<Caption>
					{formatMessage({ id: 'label.donating_to' })}
					<b>{' ' + titleSummary(projectTitle)}</b>
				</Caption>
				{isActive && (
					<Caption>
						{formatPrice(donationToProject) + ' ' + tokenSymbol}
					</Caption>
				)}
			</TableRow>
			<TableRow>
				<Caption>
					{formatMessage({ id: 'label.donating_camelcase' })}
					<b>{' ' + donationToGiveth}% </b>
					{formatMessage({ id: 'label.to_lowercase' })}
					<b> Giveth</b>
				</Caption>
				{isActive && (
					<Caption>
						{formatPrice(donationToGivethAmount) +
							' ' +
							tokenSymbol}
					</Caption>
				)}
			</TableRow>
			<Total>
				<Caption medium>
					{formatMessage({ id: 'label.your_total_donation' })}
				</Caption>
				{isActive && (
					<Caption medium>
						{totalDonation + ' ' + tokenSymbol}
					</Caption>
				)}
			</Total>
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

const Total = styled(FlexStyled)`
	border-radius: 8px;
	background: ${neutralColors.gray[300]};
	padding: 8px;
	margin-top: 8px;
`;

const TableRow = styled(FlexStyled)`
	margin-top: 12px;
	padding: 0 8px;
`;

const Container = styled.div<{ isActive?: boolean }>`
	margin-bottom: 16px;
	opacity: ${props => (props.isActive ? 1 : 0.5)};
	b {
		font-weight: 500;
	}
`;

export default TotalDonation;
