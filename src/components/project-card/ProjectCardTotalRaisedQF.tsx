import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { neutralColors, Subline, H5, Flex } from '@giveth/ui-design-system';
import { formatDonation } from '@/helpers/number';

export const ProjectCardTotalRaisedQF = ({
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
				<PriceText>
					{formatDonation(
						(activeStartedRound
							? sumDonationValueUsdForActiveQfRound // TODO: add recurring donation amount
							: totalDonations) || 0,
						'$',
						locale,
					)}
				</PriceText>
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
			<div>
				<AmountRaisedText>
					<span>
						{formatDonation(totalDonations || 0, '$', locale)}
					</span>
					{formatMessage({
						id: 'label.total_raised',
					}) + ' '}
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
`;

const AmountRaisedText = styled(Subline)`
	color: ${neutralColors.gray[700]};
	background-color: ${neutralColors.gray[300]};
	padding: 7px 12px;
	border-radius: 4px;
	width: fit-content;
	> span {
		display: block;
		margin-bottom: 6px;
		font-size: 18px;
		font-weight: 700;
	}
`;

const LightSubline = styled(Subline)`
	display: inline-block;
	color: ${neutralColors.gray[700]};
`;
