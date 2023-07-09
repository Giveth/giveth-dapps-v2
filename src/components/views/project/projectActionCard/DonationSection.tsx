import {
	Subline,
	H3,
	H4,
	neutralColors,
	Caption,
	B,
	P,
	IconChevronRight16,
	brandColors,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { formatDonations } from '@/helpers/number';

export const DonateSection = () => {
	const { formatMessage, locale } = useIntl();
	const { projectData } = useProjectContext();
	const { sumDonationValueUsd } = projectData || {};
	const isMobile = !useMediaQuery(device.tablet);

	return (
		<DonationSectionWrapper gap='24px'>
			{sumDonationValueUsd && sumDonationValueUsd !== 0 ? (
				<DonateInfo>
					{isMobile && <br />}
					<Title>Total amount raised</Title>
					<Amount weight={700}>
						{formatDonations(sumDonationValueUsd || 0, '$')}
					</Amount>
					<Description>
						{formatMessage({
							id: 'label.raised_from',
						})}
						<Caption medium>
							{projectData?.countUniqueDonors}
						</Caption>
						{formatMessage(
							{
								id: 'label.contributors',
							},
							{
								count: projectData?.countUniqueDonors,
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
			<DonateDescription flexDirection='column' gap='8px'>
				<B>
					{formatMessage({
						id: 'component.donation_section.100_to_the_project',
					})}
				</B>
				<B>
					{formatMessage({
						id: 'label.always',
					})}
					.
				</B>
				<P>
					{formatMessage({
						id: 'component.donation_section.desc',
					})}
				</P>
				<a href='/' target='_blank' referrerPolicy='no-referrer'>
					<LearnLink alignItems='center' gap='2px'>
						<Subline>
							{formatMessage({
								id: 'component.donation_section.learn_zero_fee',
							})}
						</Subline>
						<IconChevronRight16 />
					</LearnLink>
				</a>
			</DonateDescription>
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

const DonateDescription = styled(Flex)`
	padding: 8px 16px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 16px;
	margin-bottom: 24px;
`;

const LearnLink = styled(Flex)`
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;
