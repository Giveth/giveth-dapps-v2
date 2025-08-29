import styled from 'styled-components';
import { Caption, neutralColors, Flex } from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { formatPrice } from '@/lib/helpers';
import {
	calcDonationShare,
	calcDonationShareFor8Decimals,
} from '@/components/views/donate/common/helpers';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';

interface ITotalDonation {
	projectTitle?: string;
	totalDonation?: bigint;
	token?: IProjectAcceptedToken;
	isActive?: boolean;
}

const titleSummary = (title?: string) => {
	return title && title.length > 20 ? `${title.slice(0, 20)}...` : title;
};

const CardanoTotalDonation: FC<ITotalDonation> = props => {
	const { projectTitle, totalDonation = 0n, token, isActive } = props;

	const { decimals, symbol } = token || {};

	const { formatMessage } = useIntl();

	const { givethDonation, projectDonation } =
		token?.decimals === 8
			? calcDonationShareFor8Decimals(totalDonation, 0)
			: calcDonationShare(totalDonation, 0, decimals);

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
			<Total>
				<Caption $medium>
					{formatMessage({ id: 'label.your_total_donation' })}
				</Caption>
				<Caption $medium>
					{isActive
						? formatPrice(projectDonation + givethDonation) +
							' ' +
							symbol
						: '---'}
				</Caption>
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

const Container = styled.div<{ $isActive?: boolean }>`
	margin-bottom: 16px;
	opacity: ${props => (props.$isActive ? 1 : 0.5)};
	b {
		font-weight: 500;
	}
`;

export default CardanoTotalDonation;
