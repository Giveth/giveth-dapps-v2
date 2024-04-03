import { useState } from 'react';
import styled from 'styled-components';
import {
	P,
	H6,
	brandColors,
	neutralColors,
	ButtonLink,
	Subline,
	semanticColors,
	// B,
	// IconRocketInSpace16,
	IconVerifiedBadge16,
	H5,
	Flex,
	IconHelpFilled16,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Shadow } from '@/components/styled-components/Shadow';
import ProjectCardBadges from './ProjectCardLikeAndShareButtons';
import ProjectCardOrgBadge from './ProjectCardOrgBadge';
import { IProject } from '@/apollo/types/types';
import { thousandsSeparator, timeFromNow } from '@/lib/helpers';
import ProjectCardImage from './ProjectCardImage';
import { slugToProjectDonate, slugToProjectView } from '@/lib/routeCreators';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { mediaQueries } from '@/lib/constants/constants';
import { ProjectCardUserName } from './ProjectCardUserName';
import { calculateTotalEstimatedMatching, getActiveRound } from '@/helpers/qf';
import { formatDonation } from '@/helpers/number';
import { RoundNotStartedModal } from './RoundNotStartedModal';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';

const cardRadius = '12px';
const imgHeight = '226px';
const SIDE_PADDING = '26px';

interface IProjectCard {
	project: IProject;
	className?: string;
	order?: number;
}
interface IPaddedRowProps {
	sidePadding?: string;
}

const ProjectCard = (props: IProjectCard) => {
	const { project, className } = props;
	const {
		title,
		descriptionSummary,
		image,
		slug,
		adminUser,
		sumDonationValueUsd,
		sumDonationValueUsdForActiveQfRound,
		updatedAt,
		organization,
		verified,
		// projectPower,
		countUniqueDonors,
		qfRounds,
		estimatedMatching,
	} = project;
	const [isHover, setIsHover] = useState(false);
	const [showHintModal, setShowHintModal] = useState(false);
	const [destination, setDestination] = useState('');
	const orgLabel = organization?.label;
	const isForeignOrg =
		orgLabel !== ORGANIZATION.trace && orgLabel !== ORGANIZATION.giveth;
	const name = adminUser?.name;
	const { formatMessage, formatRelativeTime, locale } = useIntl();
	const router = useRouter();

	const { allProjectsSum, matchingPool, projectDonationsSqrtRootSum } =
		estimatedMatching || {};

	const activeQFRound = getActiveRound(qfRounds);
	const hasFooter = activeQFRound || verified;

	const projectLink = slugToProjectView(slug);
	const donateLink = slugToProjectDonate(slug);

	// Show hint modal if the user clicks on the card and the round is not started
	const handleClick = (e: any) => {
		if (router.route === '/qf/[slug]') {
			if (activeQFRound) return;
			e.preventDefault();
			e.stopPropagation();
			setShowHintModal(true);
		}
	};

	return (
		// </Link>
		<Wrapper
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			className={className}
			$order={props.order}
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
							updatedAt,
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
						<Flex $flexDirection='column' gap='4px'>
							<PriceText>
								{formatDonation(
									(activeQFRound
										? sumDonationValueUsdForActiveQfRound
										: sumDonationValueUsd) || 0,
									'$',
									locale,
								)}
							</PriceText>
							{activeQFRound ? (
								<>
									<Subline color={neutralColors.gray[700]}>
										{formatMessage({
											id: 'label.amount_raised_in_this_round',
										})}
									</Subline>
									<AmountRaisedText>
										{formatMessage({
											id: 'label.total_raised',
										}) + ' '}
										<span>
											{formatDonation(
												sumDonationValueUsd || 0,
												'$',
												locale,
											)}
										</span>
									</AmountRaisedText>
								</>
							) : (
								<AmountRaisedText>
									{formatMessage({
										id: 'label.total_amount_raised',
									})}
								</AmountRaisedText>
							)}

							{!activeQFRound && (
								<div>
									<LightSubline>
										{formatMessage({
											id: 'label.raised_from',
										})}{' '}
									</LightSubline>
									<Subline
										style={{ display: 'inline-block' }}
									>
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
							)}
						</Flex>
						{activeQFRound && (
							<Flex $flexDirection='column' gap='6px'>
								<EstimatedMatchingPrice>
									+
									{thousandsSeparator(
										formatDonation(
											calculateTotalEstimatedMatching(
												projectDonationsSqrtRootSum,
												allProjectsSum,
												matchingPool,
												activeQFRound?.maximumReward,
											),
											'$',
											locale,
											true,
										),
									)}
								</EstimatedMatchingPrice>
								<EstimatedMatching>
									<span>
										{formatMessage({
											id: 'label.estimated_matching',
										})}
									</span>
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
								</EstimatedMatching>
							</Flex>
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
								{verified && (
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
								{activeQFRound && (
									<QFBadge>{activeQFRound?.name}</QFBadge>
								)}
							</Flex>
							{/* {verified && (
								<GivpowerRankContainer
									gap='8px'
									$alignItems='center'
								>
									<IconRocketInSpace16
										color={neutralColors.gray[700]}
									/>
									<B>
										{projectPower?.powerRank &&
										projectPower?.totalPower !== 0
											? `#${projectPower.powerRank}`
											: '--'}
									</B>
								</GivpowerRankContainer>
							)} */}
						</PaddedRow>
					</Link>
				)}
				<ActionButtons>
					<Link
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
			{showHintModal && qfRounds && (
				<RoundNotStartedModal
					setShowModal={setShowHintModal}
					destination={destination}
					qfRounds={qfRounds}
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

const EstimatedMatching = styled(Subline)`
	display: flex;
	gap: 5px;
	color: ${neutralColors.gray[700]};
	> *:last-child {
		margin-top: 2px;
	}
`;

const VerifiedText = styled(Subline)`
	text-transform: uppercase;
	color: ${semanticColors.jade[500]};
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

const Wrapper = styled.div<{ $order?: number }>`
	position: relative;
	width: 100%;
	border-radius: ${cardRadius};
	margin: 0 auto;
	background: white;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};
	height: 536px;
	order: ${props => props.$order};
	${mediaQueries.laptopS} {
		height: 472px;
	}
`;

const GivpowerRankContainer = styled(Flex)`
	padding: 2px 8px;
	background-color: ${neutralColors.gray[300]};
	color: ${neutralColors.gray[800]};
	border-radius: 8px;
	margin-left: auto;
`;

export const PaddedRow = styled(Flex)<IPaddedRowProps>`
	padding: 0 ${props => props.sidePadding || SIDE_PADDING};
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

const EstimatedMatchingPrice = styled(H5)`
	color: ${semanticColors.jade[500]};
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

const QFBadge = styled(Subline)`
	background-color: ${brandColors.cyan[600]};
	color: ${neutralColors.gray[100]};
	padding: 4px 8px;
	border-radius: 16px;
	display: flex;
	align-items: center;
`;

export default ProjectCard;
