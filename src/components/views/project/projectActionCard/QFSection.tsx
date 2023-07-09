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
	IconHelpFilled16,
	deviceSize,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import {
	calculateEstimatedMatchingWithDonationAmount,
	calculateTotalEstimatedMatching,
} from '@/helpers/qf';
import links from '@/lib/constants/links';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import { formatDonations } from '@/helpers/number';

const QFSection = () => {
	const { formatMessage, locale } = useIntl();
	const { projectData } = useProjectContext();
	const { estimatedMatching, sumDonationValueUsdForActiveQfRound } =
		projectData || {};
	const isMobile = !useMediaQuery(device.tablet);
	const { projectDonationsSqrtRootSum, matchingPool, allProjectsSum } =
		estimatedMatching ?? {};

	const EstimatedMatchingSection = () => (
		<Flex flexDirection='column' gap='4px'>
			<EstimatedMatchingPrice>
				{formatDonations(
					calculateTotalEstimatedMatching(
						projectDonationsSqrtRootSum,
						allProjectsSum,
						matchingPool,
					),
					'$',
				)}
			</EstimatedMatchingPrice>
			<Flex alignItems='center' gap='4px'>
				<LightCaption>
					{formatMessage({ id: 'label.estimated_matching' })}
				</LightCaption>
				<IconWithTooltip icon={<IconHelpFilled16 />} direction='top'>
					<TooltipContent>
						{formatMessage({
							id: 'tooltip.donation.matching',
						})}
					</TooltipContent>
				</IconWithTooltip>
			</Flex>
		</Flex>
	);

	return (
		<DonationSectionWrapper gap='24px'>
			{sumDonationValueUsdForActiveQfRound &&
			sumDonationValueUsdForActiveQfRound !== 0 ? (
				<DonateInfo>
					{isMobile && <br />}
					<Title>
						{formatMessage({
							id: 'label.amount_raised_in_this_round',
						})}
					</Title>
					<Amount weight={700}>
						$
						{(
							sumDonationValueUsdForActiveQfRound || 0
						).toLocaleString(locale)}
					</Amount>
					<Description>
						{formatMessage({
							id: 'label.raised_from',
						})}
						<Caption medium>
							{projectData?.countUniqueDonorsForActiveQfRound}
						</Caption>
						{formatMessage(
							{
								id: 'label.contributors',
							},
							{
								count: projectData?.countUniqueDonorsForActiveQfRound,
							},
						)}
					</Description>
					<TabletEstimatedMatchingContainer>
						<EstimatedMatchingSection />
					</TabletEstimatedMatchingContainer>
				</DonateInfo>
			) : (
				<DonateInfo>
					<NoFund weight={700}>
						{formatMessage({
							id: 'label.donate_first_lead_the_way',
						})}
					</NoFund>

					<TabletEstimatedMatchingContainer>
						<EstimatedMatchingSection />
					</TabletEstimatedMatchingContainer>
				</DonateInfo>
			)}
			<DefaultEstimatedMatchingContainer>
				<EstimatedMatchingSection />
			</DefaultEstimatedMatchingContainer>

			<ChartContainer>
				<Flex justifyContent='space-between'>
					<LightSubline>
						{formatMessage({
							id: 'label.contribution',
						})}
					</LightSubline>
					<GreenSubline>
						{formatMessage({
							id: 'label.matching',
						})}
					</GreenSubline>
				</Flex>
				<ContributionsContainer>
					<Flex flexDirection='column' gap='4px'>
						<FlexSameSize justifyContent='space-between'>
							<Subline>1 DAI</Subline>
							<IconArrowRight16 color={brandColors.cyan[500]} />
							<EndAlignedSubline>
								+{' '}
								{formatDonations(
									calculateEstimatedMatchingWithDonationAmount(
										1,
										projectDonationsSqrtRootSum,
										allProjectsSum,
										matchingPool,
									),
								)}
								&nbsp; DAI
							</EndAlignedSubline>
						</FlexSameSize>
						<FlexSameSize justifyContent='space-between'>
							<Subline>10 DAI</Subline>
							<IconArrowRight16 color={brandColors.cyan[500]} />
							<EndAlignedSubline>
								+{' '}
								{formatDonations(
									calculateEstimatedMatchingWithDonationAmount(
										10,
										projectDonationsSqrtRootSum,
										allProjectsSum,
										matchingPool,
									),
								)}
								&nbsp; DAI
							</EndAlignedSubline>
						</FlexSameSize>
						<FlexSameSize justifyContent='space-between'>
							<Subline>100 DAI</Subline>
							<IconArrowRight16 color={brandColors.cyan[500]} />
							<EndAlignedSubline>
								+{' '}
								{formatDonations(
									calculateEstimatedMatchingWithDonationAmount(
										100,
										projectDonationsSqrtRootSum,
										allProjectsSum,
										matchingPool,
									),
								)}
								&nbsp; DAI
							</EndAlignedSubline>
						</FlexSameSize>
						{/* <Flex justifyContent='space-between'>
							<LightSubline>Last updated: 3h ago</LightSubline>
							<LightSubline>|</LightSubline>
							<LightSubline>Next update in: 3 min</LightSubline>
						</Flex> */}
						<a
							href={links.QF_DOC}
							target='_blank'
							referrerPolicy='no-referrer'
							rel='noreferrer'
						>
							<LearnLink alignItems='center' gap='2px'>
								<Subline>
									{formatMessage({
										id: 'label.how_it_works?',
									})}
								</Subline>
								<IconChevronRight16 />
							</LearnLink>
						</a>
					</Flex>
				</ContributionsContainer>
			</ChartContainer>
		</DonationSectionWrapper>
	);
};

export default QFSection;

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

const GreenSubline = styled(Subline)`
	color: ${semanticColors.jade[500]};
`;

const EndAlignedSubline = styled(Subline)`
	text-align: end;
	color: ${semanticColors.jade[500]};
`;

const ContributionsContainer = styled.div`
	padding: 4px 0;
	border-top: 1px solid ${neutralColors.gray[300]};
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const ChartContainer = styled.div`
	@media (min-width: ${deviceSize.tablet}px) and (max-width: ${deviceSize.laptopS}px) {
		flex-grow: 0.5;
		min-height: 240px;
	}
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

const TabletEstimatedMatchingContainer = styled.div`
	display: none;
	@media (min-width: ${deviceSize.tablet}px) and (max-width: ${deviceSize.laptopS}px) {
		display: inline-block;
	}
`;

const DefaultEstimatedMatchingContainer = styled.div`
	display: inline-block;
	@media (min-width: ${deviceSize.tablet}px) and (max-width: ${deviceSize.laptopS}px) {
		display: none;
	}
`;
