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
	H5,
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

const cardRadius = '12px';
const imgHeight = '226px';
const SIDE_PADDING = '26px';

interface IProjectCard {
	project: IProject;
	className?: string;
	order?: number;
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
	const { project, className } = props;

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

	const { activeStartedRound, activeQFRound } = getActiveRound(qfRounds);
	const hasFooter = activeStartedRound || verified || isGivbackEligible;
	const showVerifiedBadge = verified || isGivbackEligible;

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
					isHover
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
						{!activeStartedRound && (
							<ProjectCardTotalRaised
								activeStartedRound={!!activeStartedRound}
								totalDonations={totalDonations || 0}
								sumDonationValueUsdForActiveQfRound={
									sumDonationValueUsdForActiveQfRound || 0
								}
								countUniqueDonors={countUniqueDonors || 0}
							/>
						)}
						{activeStartedRound && (
							<ProjectCardTotalRaisedQF
								activeStartedRound={!!activeStartedRound}
								totalDonations={totalDonations || 0}
								sumDonationValueUsdForActiveQfRound={
									sumDonationValueUsdForActiveQfRound || 0
								}
								countUniqueDonors={
									countUniqueDonorsForActiveQfRound || 0
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
							<Flex gap='16px'>
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
							</Flex>
						</PaddedRow>
					</Link>
				)}
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

const PriceText = styled(H5)`
	display: inline;
	color: ${neutralColors.gray[900]};
	font-weight: 700;
`;

const LightSubline = styled(Subline)`
	display: inline-block;
	color: ${neutralColors.gray[700]};
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

interface IWrapperProps {
	$order?: number;
	$activeStartedRound?: boolean;
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
				? '59px'
				: props.$isHover == ECardBodyHover.HALF
					? '104px'
					: '137px'};
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
	${mediaQueries.mobileM} {
		height: ${props => (props.$activeStartedRound ? '603px' : '536px')};
	${mediaQueries.mobileL} {
		height: ${props => (props.$activeStartedRound ? '562px' : '536px')};
	}
	${mediaQueries.laptopS} {
		height: 472px;
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

export default ProjectCard;
