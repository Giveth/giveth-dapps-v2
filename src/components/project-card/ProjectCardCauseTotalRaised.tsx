import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { neutralColors, Subline, H5, Flex } from '@giveth/ui-design-system';
import { formatDonation, limitFraction } from '@/helpers/number';

export const ProjectCardCauseTotalRaised = ({
	amountReceived,
	amountReceivedUsdValue,
}: {
	amountReceived: number;
	amountReceivedUsdValue: number;
}) => {
	const { formatMessage, locale } = useIntl();
	return (
		<FlexWrap
			$flexDirection='row'
			gap='4px'
			$justifyContent='space-between'
		>
			<div>
				<PriceText>
					{limitFraction(amountReceived.toString(), 2)} GIV
					<span>
						~ {formatDonation(amountReceivedUsdValue, '$', locale)}{' '}
						USD
					</span>
				</PriceText>
				<AmountRaisedText>
					{formatMessage({
						id: 'label.cause.amount_raised_from_this_cause',
					})}
				</AmountRaisedText>
			</div>
		</FlexWrap>
	);
};

const FlexWrap = styled(Flex)`
	width: 100%;
`;

const PriceText = styled(H5)`
	display: inline;
	color: ${neutralColors.gray[900]};
	font-weight: 700;
	span {
		display: inline-block;
		padding-left: 10px;
		font-weight: 500;
		font-size: 14px;
		color: ${neutralColors.gray[700]};
	}
`;

const AmountRaisedText = styled(Subline)`
	color: ${neutralColors.gray[700]};
	background-color: ${neutralColors.gray[300]};
	padding: 2px 8px;
	border-radius: 4px;
	width: fit-content;
	> span {
		font-weight: 500;
	}
`;
