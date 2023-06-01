import {
	Subline,
	H3,
	H4,
	neutralColors,
	Caption,
	brandColors,
	mediaQueries,
	semanticColors,
	IconArrowRight16,
	IconChevronRight16,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';

const QFSection = () => {
	const { formatMessage, locale } = useIntl();
	const { projectData, totalDonationsCount } = useProjectContext();
	const { totalDonations } = projectData || {};
	const isMobile = !useMediaQuery(device.tablet);

	return (
		<DonationSectionWrapper gap='24px'>
			{totalDonations && totalDonations !== 0 ? (
				<DonateInfo>
					{isMobile && <br />}
					<Title>
						{formatMessage({
							id: 'label.amount_raised',
						})}
					</Title>
					<Amount weight={700}>
						${totalDonations.toLocaleString(locale)}
					</Amount>
					<Description>
						{formatMessage({
							id: 'label.raised_from',
						})}
						<Caption medium>{totalDonationsCount}</Caption>
						{formatMessage(
							{
								id: 'label.contributors',
							},
							{
								count: totalDonationsCount,
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
			<Flex flexDirection='column' gap='4px'>
				<EstimatedMatchingPrice>+ $7,200</EstimatedMatchingPrice>
				<LightCaption> Estimated matching</LightCaption>
			</Flex>
			<div>
				<Flex justifyContent='space-between'>
					<LightSubline>Contribution</LightSubline>
					<LightSubline>Matching</LightSubline>
				</Flex>
				<ContributionsContainer>
					<Flex flexDirection='column' gap='4px'>
						<FlexSameSize justifyContent='space-between'>
							<Subline>1 DAI</Subline>
							<IconArrowRight16 color={brandColors.cyan[500]} />
							<EndAlignedSubline>1 DAI</EndAlignedSubline>
						</FlexSameSize>
						<FlexSameSize justifyContent='space-between'>
							<Subline>12312 DAI</Subline>
							<IconArrowRight16 color={brandColors.cyan[500]} />
							<EndAlignedSubline>1 DAI </EndAlignedSubline>
						</FlexSameSize>
						<FlexSameSize justifyContent='space-between'>
							<Subline>1 DAI</Subline>
							<IconArrowRight16 color={brandColors.cyan[500]} />
							<EndAlignedSubline>1 DAI </EndAlignedSubline>
						</FlexSameSize>
						<Flex justifyContent='space-between'>
							<LightSubline>Last updated: 3h ago</LightSubline>
							<LightSubline>|</LightSubline>
							<LightSubline>Next update in: 3 min</LightSubline>
						</Flex>
						<a
							href='/'
							target='_blank'
							referrerPolicy='no-referrer'
						>
							<LearnLink alignItems='center' gap='2px'>
								<Subline>How it works?</Subline>
								<IconChevronRight16 />
							</LearnLink>
						</a>
					</Flex>
				</ContributionsContainer>
			</div>
		</DonationSectionWrapper>
	);
};

export default QFSection;

const Title = styled(Subline)`
	margin-bottom: 8px;
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
	height: 90px;
`;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
	margin-top: 16px;
`;

const EstimatedMatchingPrice = styled(H4)`
	color: ${semanticColors.jade[500]};
`;

const LightCaption = styled(Caption)`
	display: inline;
	color: ${neutralColors.gray[700]};
`;

const LightSubline = styled(Subline)`
	color: ${neutralColors.gray[700]};
`;

const EndAlignedSubline = styled(Subline)`
	text-align: end;
`;

const ContributionsContainer = styled.div`
	padding: 16px 0;
	border-top: 1px solid ${neutralColors.gray[300]};
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const FlexSameSize = styled(Flex)`
	> * {
		flex: 1 1 0px;
	}
`;

const LearnLink = styled(Flex)`
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;
