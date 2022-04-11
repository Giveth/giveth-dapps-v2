import React, { useState } from 'react';
import styled from 'styled-components';
import {
	GLink,
	P,
	H6,
	brandColors,
	neutralColors,
	Caption,
	ButtonLink,
	OutlineLinkButton,
} from '@giveth/ui-design-system';
import Link from 'next/link';

import { Shadow } from '@/components/styled-components/Shadow';
import ProjectCardBadges from './ProjectCardBadges';
import ProjectCardOrgBadge from './ProjectCardOrgBadge';
import { IProject } from '@/apollo/types/types';
import { calcBiggestUnitDifferenceTime, htmlToText } from '@/lib/helpers';
import ProjectCardImage from './ProjectCardImage';
import { slugToProjectDonate, slugToProjectView } from '@/lib/routeCreators';
import { Flex } from '../styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { Row } from '@/components/Grid';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { mediaQueries } from '@/lib/constants/constants';

const cardRadius = '12px';
const imgHeight = '226px';

interface IProjectCard {
	project: IProject;
}

const ProjectCard = (props: IProjectCard) => {
	const {
		title,
		description,
		image,
		verified,
		slug,
		reaction,
		totalReactions,
		adminUser,
		totalDonations,
		traceCampaignId,
		id,
		updatedAt,
		organization,
	} = props.project;
	const [isHover, setIsHover] = useState(false);

	const isForeignOrg =
		organization?.label !== ORGANIZATION.trace &&
		organization?.label !== ORGANIZATION.giveth;
	const name = adminUser?.name;

	return (
		<Wrapper
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			<ImagePlaceholder>
				<ProjectCardBadges
					totalReactions={totalReactions}
					reaction={reaction}
					verified={verified}
					traceable={!!traceCampaignId}
					projectHref={slug}
					projectDescription={description}
					projectId={id}
				/>
				<ProjectCardOrgBadge
					organization={organization?.label}
					isHover={isHover}
				/>
				<ProjectCardImage image={image} />
			</ImagePlaceholder>
			<CardBody isHover={isHover}>
				<Title weight={700}>{title}</Title>
				{adminUser && !isForeignOrg ? (
					<Link
						href={`${Routes.User}/${adminUser?.walletAddress}`}
						passHref
					>
						<Author size='Big'>{name || '\u200C'}</Author>
					</Link>
				) : (
					<Author size='Big'>
						<br />
					</Author>
				)}
				<Description>{htmlToText(description)}</Description>
				<Captions>
					<Caption>
						Raised: ${Math.ceil(totalDonations as number)}
					</Caption>
					<Caption>
						Last updated:{calcBiggestUnitDifferenceTime(updatedAt)}
					</Caption>
				</Captions>
				<ActionButtons>
					<Link href={slugToProjectView(slug)} passHref>
						<LearnMoreButton
							linkType='primary'
							size='small'
							label='LEARN MORE'
							aria-Lbel='Learn more about this project'
						/>
					</Link>
					<Link href={slugToProjectDonate(slug)} passHref>
						<DonateButton
							linkType='primary'
							size='small'
							label='DONATE'
						/>
					</Link>
				</ActionButtons>
			</CardBody>
		</Wrapper>
	);
};

const DonateButton = styled(ButtonLink)`
	flex: 1;
`;
const LearnMoreButton = styled(OutlineLinkButton)`
	flex: 1;
`;

const ActionButtons = styled(Row)`
	gap: 16px;
`;

const Captions = styled(Flex)`
	justify-content: space-between;
	margin-bottom: 24px;
	color: ${neutralColors.gray[700]};
	text-overflow: ellipsis;
`;

const Description = styled(P)`
	height: 120px;
	overflow: hidden;
	color: ${neutralColors.gray[800]};
	margin-bottom: 16px;
`;

const CardBody = styled.div`
	padding: 24px;
	position: absolute;
	left: 0;
	right: 0;
	top: ${(props: { isHover: boolean }) =>
		props.isHover ? '124px' : '200px'};
	background-color: ${neutralColors.gray[100]};
	transition: top 0.3s ease;
	border-radius: 0px 12px 12px 12px;
`;

const Author = styled(GLink)`
	color: ${brandColors.pinky[500]};
	margin-bottom: 16px;
	display: block;
`;

const Title = styled(H6)`
	color: ${brandColors.deep[700]};
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin-bottom: 2px;
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
	background: white;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};

	${mediaQueries.mobileS} {
		height: 536px;
	}

	${mediaQueries.tablet} {
		height: 472px;
	}
`;

export default ProjectCard;
