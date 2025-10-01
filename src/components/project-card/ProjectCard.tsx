import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	P,
	H6,
	brandColors,
	neutralColors,
	ButtonLink,
	Subline,
	semanticColors,
	IconVerifiedBadge16,
	Flex,
	IconGIVBack16,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Shadow } from '@/components/styled-components/Shadow';
import ProjectCardBadges from './ProjectCardBadgeButtons';
import ProjectCardOrgBadge from './ProjectCardOrgBadge';
import { IAdminUser, IProject } from '@/apollo/types/types';
import { timeFromNow } from '@/lib/helpers';
import ProjectCardImage from './ProjectCardImage';
import {
	slugToCauseDonate,
	slugToCauseView,
	slugToProjectDonate,
	slugToProjectDonateStellar,
	slugToProjectView,
} from '@/lib/routeCreators';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { mediaQueries } from '@/lib/constants/constants';
import { ProjectCardUserName } from './ProjectCardUserName';
import { getActiveRound } from '@/helpers/qf';
import { RoundNotStartedModal } from './RoundNotStartedModal';
import { FETCH_RECURRING_DONATIONS_BY_DATE } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { ProjectCardTotalRaised } from './ProjectCardTotalRaised';
import { ProjectCardTotalRaisedQF } from './ProjectCardTotalRaisedQF';
import config from '@/configuration';
import { EProjectType } from '@/apollo/types/gqlEnums';
import { ProjectCardCauseTotalRaised } from './ProjectCardCauseTotalRaised';

const cardRadius = '12px';
const imgHeight = '226px';
const SIDE_PADDING = '26px';

interface IProjectCard {
	project: IProject;
	className?: string;
	order?: number;
	amountReceived?: number;
	amountReceivedUsdValue?: number;
}
interface IRecurringDonation {
	id: string;
	txHash: string;
	networkId: number;
	currency: string;
	anonymous: boolean;
	status: string;
	amountStreamed: number;
	totalUsdStreamed: number;
	flowRate: string;
	donor: IAdminUser;
	createdAt: string;
	finished: boolean;
}
const ProjectCard = (props: IProjectCard) => {
	const { project, className, amountReceived, amountReceivedUsdValue } =
		props;

	const {
		id,
		title,
		descriptionSummary,
		image,
		slug,
		adminUser,
		totalDonations,
		sumDonationValueUsdForActiveQfRound,
		organization,
		verified,
		isGivbackEligible,
		latestUpdateCreationDate,
		countUniqueDonors,
		qfRounds,
		countUniqueDonorsForActiveQfRound,
		projectType,
		addresses,
	} = project;
	const [recurringDonationSumInQF, setRecurringDonationSumInQF] = useState(0);
	const [isHover, setIsHover] = useState(false);
	const [showHintModal, setShowHintModal] = useState(false);
	const [destination, setDestination] = useState('');
	const orgLabel = organization?.label;
	const isForeignOrg =
		orgLabel !== ORGANIZATION.trace && orgLabel !== ORGANIZATION.giveth;
	const name = adminUser?.name;
	const { formatMessage, formatRelativeTime } = useIntl();
	const router = useRouter();

	// Check if the project is listing inside the cause project tabs
	// This will be used to show the amount received and amount received usd value only for cause projects
	const isListingInsideCauseProjectTabs =
		router.pathname === '/cause/[causeIdSlug]' &&
		router.query?.tab === 'projects';

	const { activeStartedRound, activeQFRound } = getActiveRound(qfRounds);
	const hasFooter = activeStartedRound || verified || isGivbackEligible;
	const showVerifiedBadge = verified || isGivbackEligible;

	// Check if the project has only one address and it is a Stellar address
	const isOnlyStellar =
		addresses?.length === 1 && addresses[0]?.chainType === 'STELLAR';

	const isStellarOnlyRound =
		activeStartedRound?.eligibleNetworks?.length === 1 &&
		activeStartedRound?.eligibleNetworks[0] ===
			config.STELLAR_NETWORK_NUMBER;

	const projectLink =
		projectType === EProjectType.CAUSE
			? slugToCauseView(slug)
			: slugToProjectView(slug);

	const donateLink = isStellarOnlyRound
		? slugToProjectDonateStellar(slug)
		: projectType === EProjectType.CAUSE
			? slugToCauseDonate(slug)
			: isOnlyStellar
				? slugToProjectDonateStellar(slug)
				: slugToProjectDonate(slug);

	// Show hint modal if the user clicks on the card and the round is not started
	const handleClick = (e: any) => {
		if (router.route === '/qf/[slug]') {
			if (activeStartedRound) return;
			e.preventDefault();
			e.stopPropagation();
			setShowHintModal(true);
		}
	};

	const fetchProjectRecurringDonationsByDate = async () => {
		const startDate = activeStartedRound?.beginDate;
		const endDate = activeStartedRound?.endDate;
		if (startDate && endDate) {
			const { data: projectRecurringDonations } = await client.query({
				query: FETCH_RECURRING_DONATIONS_BY_DATE,
				variables: {
					projectId: parseInt(id),
					startDate,
					endDate,
				},
			});
			const { recurringDonationsByDate } = projectRecurringDonations;
			return recurringDonationsByDate;
		}
	};
	useEffect(() => {
		const calculateTotalAmountStreamed = async () => {
			if (activeStartedRound?.isActive) {
				const donations = await fetchProjectRecurringDonationsByDate();
				let totalAmountStreamed;
				if (donations.totalCount != 0) {
					totalAmountStreamed = donations.recurringDonations.reduce(
						(sum: number, donation: IRecurringDonation) => {
							return sum + donation.totalUsdStreamed;
						},
						0,
					);
					setRecurringDonationSumInQF(totalAmountStreamed);
				}
			}
		};

		calculateTotalAmountStreamed();
	}, [props]);

	return (
		// </Link>
		<Wrapper
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			className={className}
			$order={props.order}
			$activeStartedRound={!!activeStartedRound}
			$projectType={projectType}
			$isListingInsideCauseProjectTabs={isListingInsideCauseProjectTabs}
		>
			<ImagePlaceholder>
				<ProjectCardBadges project={project} />
				<ProjectCardOrgBadge
					organization={orgLabel}
					isHover={isHover}
				/>
				<Link
					href={projectLink}
					onClick={e => {
						setDestination(projectLink);
						handleClick(e);
					}}
				>
					<ProjectCardImage image={image} />
				</Link>
			</ImagePlaceholder>
			<CardBody
				id={`project-card-body-${slug}`}
				$isHover={
					isHover && !isListingInsideCauseProjectTabs
						? hasFooter
							? ECardBodyHover.FULL
							: ECardBodyHover.HALF
						: ECardBodyHover.NONE
				}
				$isOtherOrganization={
					orgLabel && orgLabel !== ORGANIZATION.giveth
				}
				$isCause={projectType === EProjectType.CAUSE}
			>
				<TitleWrapper>
					<LastUpdatedContainer $isHover={isHover}>
						{formatMessage({ id: 'label.last_updated' })}:
						{timeFromNow(
							latestUpdateCreationDate || '',
							formatRelativeTime,
							formatMessage({ id: 'label.just_now' }),
						)}
					</LastUpdatedContainer>
					<Link
						href={projectLink}
						onClick={e => {
							setDestination(projectLink);
							handleClick(e);
						}}
					>
						<Title weight={700}>{title}</Title>
					</Link>
				</TitleWrapper>
				<ProjectCardUserName
					name={name}
					adminUser={adminUser}
					slug={slug}
					isForeignOrg={isForeignOrg}
				/>
				<Link
					href={projectLink}
					onClick={e => {
						setDestination(projectLink);
						handleClick(e);
					}}
				>
					<Description>{descriptionSummary}</Description>
					<PaddedRow $justifyContent='space-between'>
						{isListingInsideCauseProjectTabs && (
							<ProjectCardCauseTotalRaised
								amountReceived={amountReceived ?? 0}
								amountReceivedUsdValue={
									amountReceivedUsdValue ?? 0
								}
							/>
						)}
						{!activeStartedRound &&
							!isListingInsideCauseProjectTabs && (
								<ProjectCardTotalRaised
									activeStartedRound={!!activeStartedRound}
									totalDonations={totalDonations || 0}
									sumDonationValueUsdForActiveQfRound={
										sumDonationValueUsdForActiveQfRound || 0
									}
									countUniqueDonors={countUniqueDonors || 0}
									projectsCount={
										project.activeProjectsCount || 0
									}
									isCause={projectType === EProjectType.CAUSE}
								/>
							)}
						{activeStartedRound &&
							!isListingInsideCauseProjectTabs && (
								<ProjectCardTotalRaisedQF
									activeStartedRound={!!activeStartedRound}
									totalDonations={totalDonations || 0}
									sumDonationValueUsdForActiveQfRound={
										sumDonationValueUsdForActiveQfRound || 0
									}
									countUniqueDonors={
										countUniqueDonorsForActiveQfRound || 0
									}
									isCause={projectType === EProjectType.CAUSE}
									projectsCount={
										project.activeProjectsCount || 0
									}
								/>
							)}
					</PaddedRow>
				</Link>
				{hasFooter && (
					<Link
						href={projectLink}
						onClick={e => {
							setDestination(projectLink);
							handleClick(e);
						}}
					>
						<Hr />
						<PaddedRow $justifyContent='space-between'>
							<Flex gap='16px' $flexWrap={true}>
								{showVerifiedBadge && (
									<Flex $alignItems='center' gap='4px'>
										<IconVerifiedBadge16
											color={semanticColors.jade[500]}
										/>
										<VerifiedText>
											{formatMessage({
												id: 'label.verified',
											})}
										</VerifiedText>
									</Flex>
								)}
								{isGivbackEligible && (
									<Flex $alignItems='center' gap='4px'>
										<IconGIVBack16
											color={brandColors.giv[500]}
										/>
										<GivbackEligibleText>
											GIVbacks
										</GivbackEligibleText>
									</Flex>
								)}
								{activeStartedRound && (
									<QFBadge>
										{activeStartedRound?.name}
									</QFBadge>
								)}
								{projectType === EProjectType.CAUSE && (
									<CauseBadge>
										{formatMessage({
											id: 'label.cause',
										})}
									</CauseBadge>
								)}
							</Flex>
						</PaddedRow>
					</Link>
				)}
				{!isListingInsideCauseProjectTabs && (
					<ActionButtons>
						<Link
							id='Donate_Card'
							href={donateLink}
							onClick={e => {
								setDestination(donateLink);
								handleClick(e);
							}}
						>
							<CustomizedDonateButton
								linkType='primary'
								size='small'
								label={formatMessage({ id: 'label.donate' })}
								$isHover={isHover}
							/>
						</Link>
					</ActionButtons>
				)}
			</CardBody>
			{showHintModal && activeQFRound && (
				<RoundNotStartedModal
					setShowModal={setShowHintModal}
					destination={destination}
					qfRound={activeQFRound}
				/>
			)}
		</Wrapper>
	);
};

const DonateButton = styled(ButtonLink)`
	flex: 1;
`;

const CustomizedDonateButton = styled(DonateButton)<{ $isHover: boolean }>`
	${mediaQueries.laptopS} {
		opacity: ${props => (props.$isHover ? '1' : '0')};
		transition: opacity 0.3s ease-in-out;
	}
`;

const VerifiedText = styled(Subline)`
	color: ${semanticColors.jade[500]};
`;

const GivbackEligibleText = styled(Subline)`
	color: ${brandColors.giv[500]};
`;

const LastUpdatedContainer = styled(Subline)<{ $isHover?: boolean }>`
	position: absolute;
	bottom: 30px;
	background-color: ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
	padding: 2px 8px;
	border-radius: 4px;
	${mediaQueries.laptopS} {
		transition: opacity 0.3s ease-in-out;
		display: inline;
		opacity: ${props => (props.$isHover ? 1 : 0)};
	}
`;

const Hr = styled.hr`
	margin-left: ${SIDE_PADDING};
	margin-right: ${SIDE_PADDING};
	border: 1px solid ${neutralColors.gray[300]};
`;

const Description = styled(P)`
	padding: 0 ${SIDE_PADDING};
	height: 75px;
	overflow: hidden;
	color: ${neutralColors.gray[800]};
	margin-bottom: 16px;
`;

enum ECardBodyHover {
	NONE,
	HALF,
	FULL,
}

interface ICardBody {
	$isOtherOrganization?: boolean | '';
	$isHover: ECardBodyHover;
	$isCause?: boolean;
}

interface IWrapperProps {
	$order?: number;
	$activeStartedRound?: boolean;
	$projectType?: EProjectType;
	$isListingInsideCauseProjectTabs?: boolean;
}

const CardBody = styled.div<ICardBody>`
	position: absolute;
	left: 0;
	right: 0;
	top: 112px;
	background-color: ${neutralColors.gray[100]};
	transition: top 0.3s ease;
	border-radius: ${props =>
		props.$isOtherOrganization ? '0 12px 12px 12px' : '12px'};
	${mediaQueries.laptopS} {
		top: ${props =>
			props.$isHover == ECardBodyHover.FULL
				? props.$isCause
					? '35px'
					: '55px'
				: props.$isHover == ECardBodyHover.HALF
					? '104px'
					: props.$isCause
						? '121px'
						: '161px'};
	}
`;

const TitleWrapper = styled.div`
	padding: 32px ${SIDE_PADDING} 0;
	position: relative;
`;

const Title = styled(H6)`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin-bottom: 2px;
	&:hover {
		color: ${brandColors.pinky[500]};
	}
`;

const ImagePlaceholder = styled.div`
	height: ${imgHeight};
	width: 100%;
	position: relative;
	overflow: hidden;
`;

const Wrapper = styled.div<IWrapperProps>`
	position: relative;
	width: 100%;
	border-radius: ${cardRadius};
	margin: 0 auto;
	background: white;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};
	height: ${props => (props.$activeStartedRound ? '638px' : '536px')};
	order: ${props => props.$order};
	${mediaQueries.mobileS} {
		height: ${
			props =>
				props.$isListingInsideCauseProjectTabs
					? '448px' // Inside cause project tabs
					: props.$projectType === EProjectType.CAUSE
						? props.$activeStartedRound
							? '474px' // Cause with active round
							: '456px' // Cause without active round
						: props.$activeStartedRound
							? '470px' // Not a cause but in active round
							: '446px' // Not a cause or active round
		};
	}
	${mediaQueries.mobileM} {
		height: ${props =>
			props.$isListingInsideCauseProjectTabs
				? '424px' // Inside cause project tabs
				: props.$activeStartedRound
					? '603px'
					: '536px'};
	}
	${mediaQueries.mobileL} {
		height: ${props =>
			props.$isListingInsideCauseProjectTabs
				? '424px' // Inside cause project tabs
				: props.$activeStartedRound
					? '562px'
					: '536px'};
	}
	${mediaQueries.laptopS} {
		height: ${
			props =>
				props.$isListingInsideCauseProjectTabs
					? '470px' // Inside cause project tabs
					: props.$projectType === EProjectType.CAUSE
						? props.$activeStartedRound
							? '460px' // Cause with active round
							: '468px' // Cause without active round
						: props.$activeStartedRound
							? '460px' // Not a cause but in active round
							: '448px' // Not a cause or active round
		};
	}
`;

interface IPaddedRowProps {
	$sidePadding?: string;
}

export const PaddedRow = styled(Flex)<IPaddedRowProps>`
	padding: 0 ${props => props.$sidePadding || SIDE_PADDING};
`;

export const StyledPaddedRow = styled(PaddedRow)`
	margin-bottom: 16px;
	margin-top: 2px;
	& > a span&:hover {
		color: ${brandColors.pinky[500]} !important;
	}
	&:hover #pfp-avatar {
		box-shadow: 0px 0.762881px 4.57729px 1.14432px rgba(225, 69, 141, 0.5);
	}
`;

const ActionButtons = styled(PaddedRow)`
	margin: 25px 0;
	gap: 16px;
	flex-direction: column;
`;

const QFBadge = styled(Subline)`
	background-color: ${brandColors.cyan[600]};
	color: ${neutralColors.gray[100]};
	padding: 4px 8px;
	border-radius: 16px;
	display: flex;
	align-items: center;
`;

const CauseBadge = styled(QFBadge)`
	background-color: ${neutralColors.gray[800]};
	color: ${neutralColors.gray[200]};
`;

export default ProjectCard;
