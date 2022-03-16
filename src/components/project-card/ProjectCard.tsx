import React, { useState } from 'react';
import Image from 'next/image';
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
import { Shadow } from '@/components/styled-components/Shadow';
import ProjectCardBadges from './ProjectCardBadges';
import ProjectCardOrgBadge from './ProjectCardOrgBadge';
import { IProject } from '@/apollo/types/types';
import { calcBiggestUnitDiffernceTime, htmlToText } from '@/lib/helpers';
import ProjectCardImage from './ProjectCardImage';
import { slugToProjectDonate, slugToProjectView } from '@/lib/routeCreators';
import { Flex } from '../styled-components/Flex';
import Link from 'next/link';
import Routes from '@/lib/constants/Routes';
import { Row } from '@/components/Grid';

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
		givingBlocksId,
	} = props.project;
	const [isHover, setIsHover] = useState(false);

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
					image={'/images/thegivingblock.svg'}
					isHover={isHover}
					show={!!givingBlocksId}
				/>
				<ProjectCardImage image={image} />
			</ImagePlaceholder>
			<CardBody isHover={isHover}>
				{givingBlocksId && (
					<GivingBlockBadge src='/images/thegivingblock.svg' />
				)}
				<Title weight={700}>{title}</Title>
				<Link
					href={`${Routes.User}/${adminUser?.walletAddress}`}
					passHref
				>
					<Author size='Big'>{name || '\u200C'}</Author>
				</Link>
				<Description>{htmlToText(description)}</Description>
				<Captions>
					<Caption>
						Raised: ${Math.ceil(totalDonations as number)}
					</Caption>
					<Caption>
						Last updated:{calcBiggestUnitDiffernceTime(updatedAt)}
					</Caption>
				</Captions>
				<ActionButtons>
					<Link href={slugToProjectView(slug)} passHref>
						<LearnMoreButton
							linkType='primary'
							size='small'
							label='LEARN MORE'
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
		props.isHover ? '136px' : '200px'};
	background-color: ${neutralColors.gray[100]};
	transition: top 0.3s ease;
	border-radius: 0px 12px 12px 12px;
`;

const Author = styled(GLink)`
	color: ${brandColors.pinky[500]};
	margin-bottom: 16px;
	cursor: pointer;
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
	height: 472px;
	width: 100%;
	border-radius: ${cardRadius};
	background: white;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};
`;

const GivingBlockBadge = styled.img`
	position: absolute;
	top: -5%;
	right: 0;
	background: white;
	padding: 4px 12px;
	border-top-left-radius: 10px;
`;

export default ProjectCard;
