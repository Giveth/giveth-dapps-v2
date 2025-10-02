import React from 'react';
import {
	P,
	neutralColors,
	brandColors,
	H6,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Link from 'next/link';
import ProjectCardImage from './ProjectCardImage';
import ProjectCardOrgBadge from './ProjectCardOrgBadge';
import { IProject } from '@/apollo/types/types';
import { htmlToText } from '@/lib/helpers';
import { Shadow } from '@/components/styled-components/Shadow';
import { mediaQueries } from '@/lib/constants/constants';
import InternalLink from '@/components/InternalLink';
import {
	addressToUserView,
	slugToCauseView,
	slugToProjectView,
} from '@/lib/routeCreators';
import { VerifiedBadge } from '@/components/badges/VerifiedBadge';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { PFP } from '../PFP';
import { EProjectType } from '@/apollo/types/gqlEnums';

interface IProjectCard {
	project: IProject;
	isNew?: boolean;
	projectsCount?: number;
}

const ProjectCard = (props: IProjectCard) => {
	const { isNew, project } = props;
	const {
		title,
		description,
		image,
		verified,
		isGivbackEligible,
		adminUser,
		slug,
		organization,
		projectType,
	} = project;

	const { name, walletAddress } = adminUser || {};
	const orgLabel = organization?.label;
	const pfpToken = useGiverPFPToken(
		adminUser?.walletAddress,
		adminUser?.avatar,
	);
	const showVerifiedBadge = verified || isGivbackEligible;

	const projectLink =
		projectType === EProjectType.CAUSE
			? slugToCauseView(slug!)
			: slugToProjectView(slug!);
	return (
		<Wrapper $isNew={isNew}>
			<ImagePlaceholder>
				<Link href={projectLink}>
					<ProjectCardImage image={image} />
				</Link>
			</ImagePlaceholder>
			<ProjectCardOrgBadge
				organization={orgLabel}
				isHover={false}
				isAbsolute={true}
			/>
			{!isNew && (
				<BadgeContainer>
					{showVerifiedBadge && <VerifiedBadge />}
				</BadgeContainer>
			)}
			<CardBody $isNew={isNew}>
				<InternalLink href={projectLink}>
					<Title>{title}</Title>
				</InternalLink>
				{name && (
					<div>
						<InternalLink
							href={addressToUserView(
								walletAddress?.toLowerCase(),
							)}
						>
							{pfpToken ? (
								<Flex gap='8px'>
									<PFP pfpToken={pfpToken} />
									<Author>{name || '\u200C'}</Author>
								</Flex>
							) : (
								<Author>{name || '\u200C'}</Author>
							)}
						</InternalLink>
						<Description>{htmlToText(description)}</Description>
						{props.projectsCount !== undefined && (
							<ProjectsCount>
								<strong>{props.projectsCount}</strong>{' '}
								{props.projectsCount === 1
									? 'Project'
									: 'Projects'}
							</ProjectsCount>
						)}
					</div>
				)}
			</CardBody>
		</Wrapper>
	);
};

const BadgeContainer = styled.div`
	display: flex;
	position: absolute;
	padding: 16px;
`;
const ProjectsCount = styled.div`
	margin-top: 10px;
	font-size: 14px;
	font-weight: 400;
	color: ${neutralColors.gray[500]};
	text-align: left;

	strong {
		font-weight: 700;
		color: ${neutralColors.gray[800]};
	}
`;

const Description = styled(P)`
	height: 76px;
	overflow: hidden;
	color: ${neutralColors.gray[900]};
	margin-bottom: 8px;
	margin-top: 8px;
`;

const CardBody = styled.div<{ $isNew?: boolean }>`
	margin-top: ${props => (props.$isNew ? '50px' : '50px')};
	text-align: left;
	padding: 0 24px 34px 24px; // Bottom padding set here
`;
const Author = styled(P)`
	color: ${brandColors.pinky[500]};
	margin-bottom: 10px;
	cursor: pointer;
`;

const Title = styled(H6)`
	color: ${brandColors.deep[500]};
	font-weight: 700;
	height: 26px;
	overflow: hidden;
`;

const ImagePlaceholder = styled.div`
	height: 200px;
	width: 100%;
	position: relative;
	overflow: hidden;
	border-radius: 16px;
`;

const Wrapper = styled.div<{ $isNew?: boolean }>`
	position: relative;
	height: ${props =>
		props.$isNew ? '450px' : '440px'}; // add 10px if it's new
	max-width: 440px;
	min-width: 300px;
	border-radius: 12px;
	margin-top: 0;
	z-index: 0;
	background: ${props => props.$isNew && 'white'};
	box-shadow: ${props => props.$isNew && Shadow.Dark[500]};
	${mediaQueries.mobileL} {
		width: 100%;
	}
`;

export default ProjectCard;
