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
import {
	getCountUniqueDonorsForActiveQfRound,
	getProjectTotalRaisedUSD,
	getSumDonationValueUsdForActiveQfRound,
	haveProjectRound,
} from '@/lib/helpers/projectHelpers';

const cardRadius = '12px';
const imgHeight = '226px';
const SIDE_PADDING = '26px';

interface IProjectCard {
	project: IProject;
	className?: string;
	order?: number;
	amountReceived?: number;
	amountReceivedUsdValue?: number;
	providedQFRoundId?: number;
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
	const {
		project,
		className,
		amountReceived,
		amountReceivedUsdValue,
		providedQFRoundId,
	} = props;

	const {
		id,
		title,
		descriptionSummary,
		image,
		slug,
		adminUser,
		admin,
		sumDonationValueUsdForActiveQfRound,
		organization,
		verified,
		isGivbackEligible,
		isGivbacksEligible,
		latestUpdateCreationDate,
		countUniqueDonors,
		qfRounds,
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
	const name = adminUser?.name ? adminUser?.name : admin?.name;
	const { formatMessage, formatRelativeTime } = useIntl();
	const router = useRouter();

	// Check if the project is listing inside the cause project tabs
	// This will be used to show the amount received and amount received usd value only for cause projects
	const isListingInsideCauseProjectTabs =
		router.pathname === '/cause/[causeIdSlug]' &&
		router.query?.tab === 'projects';

	const isListingInsideProjectsCausesAllPage =
		router.pathname === '/projects/[slug]' ||
		router.pathname === '/causes/[slug]';

	const isGivbackEligibleCheck = isGivbackEligible || isGivbacksEligible;

	const { activeStartedRound: checkActiveRound, activeQFRound } =
		getActiveRound(qfRounds);

	const activeStartedRound = checkActiveRound || activeQFRound?.isActive;

	const hasFooter = activeStartedRound || verified || isGivbackEligibleCheck;
	const showVerifiedBadge = verified || isGivbackEligibleCheck;

	// Check if the project has only one address and it is a Stellar address
	const isOnlyStellar =
		addresses?.length === 1 && addresses[0]?.chainType === 'STELLAR';

	const isStellarOnlyRound =
		activeQFRound?.eligibleNetworks?.length === 1 &&
		activeQFRound?.eligibleNetworks[0] === config.STELLAR_NETWORK_NUMBER;

	const projectLink =
		projectType === EProjectType.CAUSE
			? slugToCauseView(slug)
			: slugToProjectView(slug);

	const donateLink = isStellarOnlyRound
		? slugToProjectDonateStellar(slug)
		: projectType === EProjectType.CAUSE
			? slugToCauseDonate(slug) +
				(providedQFRoundId ? `?roundId=${providedQFRoundId}` : '')
			: isOnlyStellar
				? slugToProjectDonateStellar(slug) +
					(providedQFRoundId ? `?roundId=${providedQFRoundId}` : '')
				: slugToProjectDonate(slug) +
					(providedQFRoundId ? `?roundId=${providedQFRoundId}` : '');

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
		const startDate = activeQFRound?.beginDate;
		const endDate = activeQFRound?.endDate;
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
			if (activeQFRound?.isActive) {
				const donations = await fetchProjectRecurringDonationsByDate();
				let totalAmountStreamed;
				if (donations.totalCount != 0) {
					console.log(id, donations.recurringDonations);
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
					adminUser={adminUser || admin}
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
						{isListingInsideProjectsCausesAllPage && (
							<ProjectCardTotalRaised
								activeStartedRound={!!activeStartedRound}
								totalDonations={getProjectTotalRaisedUSD(
									project,
								)}
								sumDonationValueUsdForActiveQfRound={
									project.totalDonations || 0
								}
								countUniqueDonors={countUniqueDonors || 0}
								projectsCount={project.activeProjectsCount || 0}
								isCause={projectType === EProjectType.CAUSE}
							/>
						)}
						{!activeStartedRound &&
							!isListingInsideProjectsCausesAllPage &&
							!isListingInsideCauseProjectTabs && (
								<ProjectCardTotalRaised
									activeStartedRound={!!activeStartedRound}
									totalDonations={getProjectTotalRaisedUSD(
										project,
									)}
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
							!isListingInsideCauseProjectTabs &&
							!isListingInsideProjectsCausesAllPage && (
								<ProjectCardTotalRaisedQF
									activeStartedRound={!!activeStartedRound}
									totalDonations={getProjectTotalRaisedUSD(
										project,
									)}
									sumDonationValueUsdForActiveQfRound={getSumDonationValueUsdForActiveQfRound(
										project,
									)}
									countUniqueDonors={getCountUniqueDonorsForActiveQfRound(
										project,
									)}
									isCause={projectType === EProjectType.CAUSE}
									projectsCount={
										project.causeProjects?.length || 0
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
								{isGivbackEligibleCheck && (
									<Flex $alignItems='center' gap='4px'>
										<IconGIVBack16
											color={brandColors.giv[500]}
										/>
										<GivbackEligibleText>
											GIVbacks
										</GivbackEligibleText>
									</Flex>
								)}
								{(haveProjectRound(project) === true ||
									project.isQfActive === true) && (
									<QFBadge>
										{formatMessage({
											id:
												projectType ===
												EProjectType.CAUSE
													? 'label.qf.qf_cause'
													: 'label.qf.project',
										})}
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
			</CardBody>
			{!isListingInsideCauseProjectTabs && (
				<ActionButtons className='action-buttons'>
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

interface IWrapperProps {
	$order?: number;
	$activeStartedRound?: boolean;
	$projectType?: EProjectType;
}

const Wrapper = styled.div<IWrapperProps>`
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	border-radius: ${cardRadius};
	margin: 0 auto;
	background: #fff;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};
	/* Let the parent grid set equal heights via align-stretch; the card will fill. */
	height: 100%;
	order: ${p => p.$order};

	&:hover .action-buttons {
		max-height: 56px;
		margin-top: 16px;
		opacity: 1;
		pointer-events: auto;
	}
`;

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
}

const CardBody = styled.div<ICardBody>`
	position: static;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background-color: ${neutralColors.gray[100]};
	border-radius: ${p =>
		p.$isOtherOrganization ? '0 12px 12px 12px' : '12px'};

	/* static slight overlap if you want */
	margin-top: -25px;
	margin-bottom: 20px;

	/* visual slide up on hover, no reflow */
	transform: translateY(0);
	transition: transform 0.3s ease;
	will-change: transform;

	${Wrapper}:hover & {
		transform: translateY(-75px); /* visual slide up, no layout change */
	}
	z-index: 1;
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
	position: relative;
	width: 100%;
	height: ${imgHeight};
	overflow: hidden;
`;

interface IPaddedRowProps {
	$sidePadding?: string;
}

export const PaddedRow = styled(Flex)<IPaddedRowProps>`
	margin-top: 16px;
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
	position: static;
	margin: 5px 0 20px 0;
	gap: 16px;
	flex-direction: column;

	display: block;
	z-index: 2;

	${mediaQueries.laptopS} {
		position: absolute;
		margin-bottom: 0;
		bottom: 20px;
		left: 0;
		right: 0;
		pointer-events: none;
	}
`;

const QFBadge = styled(Subline)`
	background-color: ${brandColors.cyan[600]};
	color: ${neutralColors.gray[100]};
	padding: 4px 8px;
	border-radius: 16px;
	display: flex;
	align-items: center;
	text-transform: uppercase;
`;

const CauseBadge = styled(QFBadge)`
	background-color: ${neutralColors.gray[800]};
	color: ${neutralColors.gray[200]};
`;

export default ProjectCard;
