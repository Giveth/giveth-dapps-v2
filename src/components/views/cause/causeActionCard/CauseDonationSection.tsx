import {
	Subline,
	H3,
	H4,
	neutralColors,
	Caption,
	mediaQueries,
	Flex,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { type FC } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { formatDonation } from '@/helpers/number';
import { ICause } from '@/apollo/types/types';

interface IDonateSectionProps {
	causeData?: ICause;
}

export const CauseDonateSection: FC<IDonateSectionProps> = ({ causeData }) => {
	const { formatMessage, locale } = useIntl();
	const { totalDonated } = causeData || {};
	const isMobile = !useMediaQuery(device.tablet);

	return (
		<DonationSectionWrapper gap='24px'>
			{totalDonated && totalDonated !== 0 ? (
				<DonateInfo>
					{isMobile && <br />}
					<Title>
						{formatMessage({ id: 'label.total_amount_raised' })}
					</Title>
					<Amount weight={700}>
						{formatDonation(totalDonated || 0, '$', locale)}
					</Amount>
					<Description>
						{formatMessage({
							id: 'label.raised_from',
						})}
						<Caption $medium>
							{causeData?.countUniqueDonors}
						</Caption>
						{formatMessage(
							{
								id: 'label.contributors',
							},
							{
								count: causeData?.countUniqueDonors,
							},
						)}
					</Description>
				</DonateInfo>
			) : (
				<DonateInfo>
					<NoFund weight={700}>
						{formatMessage({
							id: 'label.donate_first_lead_the_way',
						})}
					</NoFund>
				</DonateInfo>
			)}
		</DonationSectionWrapper>
	);
};

const Title = styled(Subline)`
	display: inline-block;
	margin-bottom: 8px;
	color: ${neutralColors.gray[700]};
	background-color: ${neutralColors.gray[200]};
	border-radius: 4px;
	padding: 2px 4px;
`;

const Amount = styled(H3)`
	margin-bottom: 4px;
`;

const Description = styled(Caption)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 24px;
	& > div {
		color: ${neutralColors.gray[900]};
		display: inline;
	}
`;

const DonationSectionWrapper = styled(Flex)`
	justify-content: space-between;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
	${mediaQueries.laptopS} {
		flex-direction: column;
	}
`;

const DonateInfo = styled.div`
	height: 130px;
`;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
	margin-top: 16px;
`;
