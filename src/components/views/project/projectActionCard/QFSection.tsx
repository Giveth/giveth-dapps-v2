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
	Flex,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { type FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import {
	calculateEstimatedMatchingWithDonationAmount,
	calculateTotalEstimatedMatching,
	getActiveRound,
} from '@/helpers/qf';
import links from '@/lib/constants/links';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import { formatDonation } from '@/helpers/number';
import ProjectEligibleQFChains from './ProjectEligibleQFChains';
import { IProject } from '@/apollo/types/types';
import { ProjectCardUserName } from '@/components/project-card/ProjectCardUserName';
import { CustomH5 } from '@/components/setProfilePic/SetProfilePic';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { slugToProjectView } from '@/lib/routeCreators';
import { EProjectType } from '@/apollo/types/gqlEnums';

interface IQFSectionProps {
	projectData?: IProject;
}

const QFSection: FC<IQFSectionProps> = ({ projectData }) => {
	const { formatMessage, locale } = useIntl();
	const {
		qfRounds,
		estimatedMatching,
		sumDonationValueUsdForActiveQfRound,
		totalDonations,
		adminUser,
		slug,
		organization,
		title: projectTitle,
		totalDistributed,
		activeProjectsCount,
	} = projectData || {};
	const isMobile = !useMediaQuery(device.tablet);
	const router = useRouter();
	const isOnDonatePage = router.pathname.includes('/donate');

	const { projectDonationsSqrtRootSum, matchingPool, allProjectsSum } =
		estimatedMatching ?? {};

	const { activeStartedRound } = getActiveRound(qfRounds);
	const {
		allocatedFundUSD,
		allocatedTokenSymbol,
		allocatedFundUSDPreferred,
	} = activeStartedRound || {};

	const totalEstimatedMatching = calculateTotalEstimatedMatching(
		projectDonationsSqrtRootSum,
		allProjectsSum,
		allocatedFundUSDPreferred ? allocatedFundUSD : matchingPool,
		activeStartedRound?.maximumReward,
	);

	const projectLink = slugToProjectView(slug!);

	const orgLabel = organization?.label;
	const isForeignOrg =
		orgLabel !== ORGANIZATION.trace && orgLabel !== ORGANIZATION.giveth;

	const EstimatedMatchingSection = () =>
		totalEstimatedMatching !== 0 ? (
			<Flex $flexDirection='column' gap='4px'>
				<EstimatedMatchingPrice>
					{formatDonation(
						totalEstimatedMatching,
						allocatedFundUSDPreferred ? '$' : '',
						locale,
						true,
					)}
					{allocatedFundUSDPreferred
						? ''
						: ` ${allocatedTokenSymbol}`}
				</EstimatedMatchingPrice>
				<Flex $alignItems='center' gap='4px'>
					<LightCaption>
						{formatMessage({ id: 'label.estimated_matching' })}
					</LightCaption>
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction='top'
					>
						<TooltipContent>
							{formatMessage({
								id: 'component.qf-section.tooltip_polygon',
							})}
						</TooltipContent>
					</IconWithTooltip>
				</Flex>
			</Flex>
		) : null;

	const DonationMatch = ({ amount }: { amount: number }) => (
		<FlexSameSize $justifyContent='space-between'>
			<Subline>
				{allocatedFundUSDPreferred && '$'}
				{amount} {!allocatedFundUSDPreferred && allocatedTokenSymbol}
			</Subline>
			<IconArrowRight16 color={brandColors.cyan[500]} />
			<EndAlignedSubline>
				{formatDonation(
					calculateEstimatedMatchingWithDonationAmount(
						amount,
						projectDonationsSqrtRootSum,
						allProjectsSum,
						allocatedFundUSDPreferred
							? allocatedFundUSD
							: matchingPool,
						activeStartedRound?.maximumReward,
					),
					allocatedFundUSDPreferred ? '$' : '',
					locale,
					true,
				)}
				{allocatedFundUSDPreferred ? '' : ` ${allocatedTokenSymbol}`}
			</EndAlignedSubline>
		</FlexSameSize>
	);

	return (
		<DonationSectionWrapper gap={'8px'}>
			{isOnDonatePage && (
				<>
					<Link href={projectLink}>
						<CustomH5>{projectTitle}</CustomH5>
					</Link>
					<ProjectCardUserName
						name={adminUser?.name}
						adminUser={adminUser!}
						slug={slug!}
						isForeignOrg={isForeignOrg}
						sidePadding='0'
					/>
				</>
			)}
			{sumDonationValueUsdForActiveQfRound &&
			sumDonationValueUsdForActiveQfRound !== 0 ? (
				<DonateInfo>
					{isMobile && <br />}
					{!isOnDonatePage && (
						<Title>
							{formatMessage({
								id: 'label.total_raised',
							})}
							{' ' +
								formatDonation(
									totalDonations || 0,
									'$',
									locale,
								)}
						</Title>
					)}
					<Amount weight={700}>
						{formatDonation(
							sumDonationValueUsdForActiveQfRound || 0,
							'$',
							locale,
						)}
					</Amount>
					<Description>
						{formatMessage({
							id: 'label.raised_from',
						})}
						<Caption $medium>
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
						{' ' +
							formatMessage({
								id: 'label.in',
							}) +
							' '}
						<b>
							{formatMessage({
								id: 'label.this_round',
							})}
						</b>
					</Description>
				</DonateInfo>
			) : (
				<div>
					{!isOnDonatePage && (
						<Title>
							{formatMessage({
								id: 'label.total_raised',
							})}
							{' ' +
								formatDonation(
									totalDonations || 0,
									'$',
									locale,
								)}
						</Title>
					)}
					<NoFund weight={700}>
						{formatMessage({
							id: 'label.donate_first_lead_the_way',
						})}
					</NoFund>

					<TabletEstimatedMatchingContainer>
						<EstimatedMatchingSection />
					</TabletEstimatedMatchingContainer>
				</div>
			)}
			{totalDistributed !== undefined &&
				totalDonations !== 0 &&
				projectData?.projectType === EProjectType.CAUSE && (
					<DonateInfoContributed>
						{isMobile && <br />}
						<Title>
							{formatMessage({
								id: 'label.cause.total_distributed',
							})}
						</Title>
						<Amount weight={700}>
							{formatDonation(totalDistributed || 0, '$', locale)}
						</Amount>
						<Description>
							{formatMessage(
								{
									id: 'label.cause.total_distributed_projects',
								},
								{
									count: (
										<Caption $medium>
											{activeProjectsCount || 0}
										</Caption>
									),
								},
							)}
						</Description>
					</DonateInfoContributed>
				)}
			{!isOnDonatePage && (
				<ChartContainer>
					<Flex $justifyContent='space-between'>
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
						<Flex $flexDirection='column' gap='4px'>
							<DonationMatch amount={1} />
							<DonationMatch amount={10} />
							<DonationMatch amount={100} />
							{/* <Flex $justifyContent='space-between'>
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
								<LearnLink $alignItems='center' gap='2px'>
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
					<ProjectEligibleQFChains />
				</ChartContainer>
			)}
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
	white-space: nowrap;
	& > div {
		color: ${neutralColors.gray[900]};
		display: inline;
	}
	> b {
		font-weight: 500;
		color: ${neutralColors.gray[900]};
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

const DonateInfo = styled.div``;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
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
	margin-top: 3.5em;
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

const DonateInfoContributed = styled(DonateInfo)`
	height: auto;
	margin-top: 16px;
`;
