import React from 'react';
import {
	Caption,
	P,
	neutralColors,
	brandColors,
	H6,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import ProjectCardBadges from './ProjectCardBadges';
import ProjectCardImage from './ProjectCardImage';
import ProjectCardOrgBadge from './ProjectCardOrgBadge';
import { IProject } from '@/apollo/types/types';
import { htmlToText } from '@/lib/helpers';
import { Shadow } from '@/components/styled-components/Shadow';
import { mediaQueries } from '@/lib/constants/constants';
import Routes from '@/lib/constants/Routes';
import InternalLink from '@/components/InternalLink';

interface IProjectCard {
	project: IProject;
	noHearts?: boolean;
	isNew?: boolean;
}

const ProjectCard = (props: IProjectCard) => {
	const { noHearts, isNew, project } = props;
	const {
		title,
		description,
		image,
		verified,
		traceCampaignId,
		adminUser,
		slug,
		id,
		totalDonations,
		organization,
	} = project;

	const name = adminUser?.name;
	const orgLabel = organization?.label;

	return (
		<Wrapper isNew={isNew}>
			<ImagePlaceholder>
				<ProjectCardImage image={image} />
			</ImagePlaceholder>
			<ProjectCardOrgBadge
				organization={orgLabel}
				isHover={false}
				isAbsolute={true}
			/>
			{!isNew && (
				<ProjectCardBadges
					verified={verified}
					traceable={!!traceCampaignId}
					projectHref={slug}
					projectDescription={description}
					projectId={id}
					noHearts={noHearts}
				/>
			)}
			<CardBody>
				<Title>{title}</Title>
				{name && (
					<InternalLink
						href={`${Routes.User}/${adminUser?.walletAddress}`}
					>
						<Author>{name}</Author>
					</InternalLink>
				)}
				<Description>{htmlToText(description)}</Description>
				{!isNew && (
					<Captions>
						<BodyCaption>
							Raised: ${totalDonations?.toLocaleString()}
						</BodyCaption>
					</Captions>
				)}
			</CardBody>
		</Wrapper>
	);
};

const BodyCaption = styled(Caption)`
	color: ${neutralColors.gray[700]};
`;

const Captions = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 14px;
`;

const Description = styled(P)`
	height: 76px;
	overflow: hidden;
	color: ${neutralColors.gray[900]};
	margin-bottom: 20px;
`;

const CardBody = styled.div`
	margin: 50px 24px 0 24px;
	text-align: left;
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

const Wrapper = styled.div<{ isNew?: boolean }>`
	position: relative;
	height: 430px;
	max-width: 440px;
	min-width: 300px;
	border-radius: 12px;
	margin-top: 0;
	z-index: 0;
	background: ${props => props.isNew && 'white'};
	box-shadow: ${props => props.isNew && Shadow.Dark[500]};
	${mediaQueries.mobileL} {
		width: 100%;
	}
`;

export default ProjectCard;
