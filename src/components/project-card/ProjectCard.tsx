import { useState } from 'react';
import styled from 'styled-components';
import {
	P,
	H6,
	brandColors,
	neutralColors,
	ButtonLink,
	B,
	Subline,
	semanticColors,
	IconGIVBack,
	IconRocketInSpace16,
	IconVerifiedBadge16,
} from '@giveth/ui-design-system';
import Link from 'next/link';

import { useIntl } from 'react-intl';
import { Shadow } from '@/components/styled-components/Shadow';
import ProjectCardBadges from './ProjectCardLikeAndShareButtons';
import ProjectCardOrgBadge from './ProjectCardOrgBadge';
import { IProject } from '@/apollo/types/types';
import { timeFromNow } from '@/lib/helpers';
import ProjectCardImage from './ProjectCardImage';
import { slugToProjectDonate, slugToProjectView } from '@/lib/routeCreators';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '../styled-components/Flex';
import { ProjectCardUserName } from './ProjectCardUserName';

const cardRadius = '12px';
const imgHeight = '226px';
const SIDE_PADDING = '26px';

interface IProjectCard {
	project: IProject;
	className?: string;
}

const ProjectCard = (props: IProjectCard) => {
	const { project, className } = props;
	const {
		title,
		descriptionSummary,
		image,
		slug,
		adminUser,
		totalDonations,
		updatedAt,
		organization,
		verified,
		projectPower,
	} = project;

	const [isHover, setIsHover] = useState(false);

	const orgLabel = organization?.label;
	const isForeignOrg =
		orgLabel !== ORGANIZATION.trace && orgLabel !== ORGANIZATION.giveth;
	const name = adminUser?.name;
	const { formatMessage, formatRelativeTime } = useIntl();

	return (
		<Wrapper
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			className={className}
		>
			<ImagePlaceholder>
				<ProjectCardBadges project={project} />
				<ProjectCardOrgBadge
					organization={orgLabel}
					isHover={isHover}
				/>
				<Link href={slugToProjectView(slug)}>
					<ProjectCardImage image={image} />
				</Link>
			</ImagePlaceholder>
			<CardBody
				isHover={
					isHover
						? verified
							? ECardBodyHover.FULL
							: ECardBodyHover.HALF
						: ECardBodyHover.NONE
				}
				isOtherOrganization={
					orgLabel && orgLabel !== ORGANIZATION.giveth
				}
			>
				<TitleWrapper>
					<LastUpdatedContainer isHover={isHover}>
						{formatMessage({ id: 'label.last_updated' })}:
						{timeFromNow(
							updatedAt,
							formatRelativeTime,
							formatMessage({ id: 'label.just_now' }),
						)}
					</LastUpdatedContainer>
					<Link href={slugToProjectView(slug)}>
						<Title weight={700} isHover={isHover}>
							{title}
						</Title>
					</Link>
				</TitleWrapper>
				<ProjectCardUserName
					name={name}
					adminUser={adminUser}
					slug={slug}
					isForeignOrg={isForeignOrg}
				/>
				<Link href={slugToProjectView(slug)}>
					<Description>{descriptionSummary}</Description>
					<PaddedRow alignItems='center' gap='4px'>
						<PriceText>
							${Math.round(totalDonations as number)}
						</PriceText>
						<LightSubline>
							{' '}
							{formatMessage({ id: 'label.raised_two' })}
						</LightSubline>
					</PaddedRow>
				</Link>
				{verified && (
					<Link href={slugToProjectView(slug)}>
						<Hr />
						<PaddedRow justifyContent='space-between'>
							<Flex gap='16px'>
								<Flex alignItems='center' gap='4px'>
									<IconVerifiedBadge16
										color={semanticColors.jade[500]}
									/>
									<VerifiedText>
										{formatMessage({
											id: 'label.verified',
										})}
									</VerifiedText>
								</Flex>
								<Flex alignItems='center' gap='2px'>
									<GivBackIconContainer>
										<IconGIVBack
											size={24}
											color={brandColors.giv[500]}
										/>
									</GivBackIconContainer>
									<GivBackText>
										{formatMessage({
											id: 'label.givbacks',
										})}
									</GivBackText>
								</Flex>
							</Flex>
							<GivpowerRankContainer
								gap='8px'
								alignItems='center'
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
						</PaddedRow>
					</Link>
				)}
				<ActionButtons>
					<Link href={slugToProjectDonate(slug)}>
						<CustomizedDonateButton
							linkType='primary'
							size='small'
							label={formatMessage({ id: 'label.donate' })}
							isHover={isHover}
						/>
					</Link>
				</ActionButtons>
			</CardBody>
		</Wrapper>
		// </Link>
	);
};

const DonateButton = styled(ButtonLink)`
	flex: 1;
`;

const CustomizedDonateButton = styled(DonateButton)<{ isHover: boolean }>`
	${mediaQueries.laptopS} {
		opacity: ${props => (props.isHover ? '1' : '0')};
		transition: opacity 0.3s ease-in-out;
	}
`;

const PriceText = styled(B)`
	display: inline;
	color: ${neutralColors.gray[800]};
`;

const LightSubline = styled(Subline)`
	display: inline;
	color: ${neutralColors.gray[700]};
`;

const VerifiedText = styled(Subline)`
	text-transform: uppercase;
	color: ${semanticColors.jade[500]};
`;

const GivBackText = styled(Subline)`
	text-transform: uppercase;
	color: ${brandColors.giv[500]};
`;

const GivBackIconContainer = styled.div`
	display: flex;
	align-items: center;
	transform: scale(0.8);
`;

const LastUpdatedContainer = styled(Subline)<{ isHover?: boolean }>`
	position: absolute;
	bottom: 30px;
	background-color: ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
	padding: 2px 8px;
	border-radius: 4px;
	${mediaQueries.laptopS} {
		transition: opacity 0.3s ease-in-out;
		display: inline;
		opacity: ${props => (props.isHover ? 1 : 0)};
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
	isOtherOrganization?: boolean | '';
	isHover: ECardBodyHover;
}

const CardBody = styled.div<ICardBody>`
	position: absolute;
	left: 0;
	right: 0;
	top: 192px;
	background-color: ${neutralColors.gray[100]};
	transition: top 0.3s ease;
	border-radius: ${props =>
		props.isOtherOrganization ? '0 12px 12px 12px' : '12px'};
	${mediaQueries.laptopS} {
		top: ${props =>
			props.isHover == ECardBodyHover.FULL
				? '109px'
				: props.isHover == ECardBodyHover.HALF
				? '150px'
				: '186px'};
	}
`;

const TitleWrapper = styled.div`
	padding: 32px ${SIDE_PADDING} 0;
	position: relative;
`;

const Title = styled(H6)<{ isHover?: boolean }>`
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

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	border-radius: ${cardRadius};
	margin: 0 auto;
	background: white;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};
	height: 536px;
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

export const PaddedRow = styled(Flex)`
	padding: 0 ${SIDE_PADDING};
`;

export const StyledPaddedRow = styled(PaddedRow)`
	& > a span:hover {
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

export default ProjectCard;
