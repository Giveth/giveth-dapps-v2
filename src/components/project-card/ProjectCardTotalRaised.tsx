import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { neutralColors, Subline, H5, Flex } from '@giveth/ui-design-system';
import { formatDonation } from '@/helpers/number';

export const ProjectCardTotalRaised = ({
	activeStartedRound,
	totalDonations,
	sumDonationValueUsdForActiveQfRound,
	countUniqueDonors,
}: {
	activeStartedRound: boolean;
	totalDonations: number;
	sumDonationValueUsdForActiveQfRound: number;
	countUniqueDonors: number;
}) => {
	const { formatMessage, locale } = useIntl();
	return (
		<FlexWrap
			$flexDirection='row'
			gap='4px'
			$justifyContent='space-between'
		>
			<div>
				<AmountRaisedText>
					{formatMessage({
						id: 'label.total_amount_raised',
					})}
				</AmountRaisedText>
				<div>
					<LightSubline>
						{formatMessage({
							id: 'label.raised_from',
						})}{' '}
					</LightSubline>
					<Subline style={{ display: 'inline-block' }}>
						&nbsp;
						{countUniqueDonors}
						&nbsp;
					</Subline>
					<LightSubline>
						{formatMessage(
							{
								id: 'label.contributors',
							},
							{
								count: countUniqueDonors,
							},
						)}
					</LightSubline>
				</div>
			</div>
			<PriceText>
				{formatDonation(
					(activeStartedRound
						? sumDonationValueUsdForActiveQfRound // TODO: add recurring donation amount
						: totalDonations) || 0,
					'$',
					locale,
				)}
			</PriceText>
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

const LightSubline = styled(Subline)`
	display: inline-block;
	color: ${neutralColors.gray[700]};
`;
