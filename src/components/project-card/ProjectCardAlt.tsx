import React from 'react';
import {
	Caption,
	P,
	neutralColors,
	brandColors,
	H6,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import ProjectCardImage from './ProjectCardImage';
import ProjectCardOrgBadge from './ProjectCardOrgBadge';
import { IProject } from '@/apollo/types/types';
import { htmlToText } from '@/lib/helpers';
import { Shadow } from '@/components/styled-components/Shadow';
import { mediaQueries } from '@/lib/constants/constants';
import InternalLink from '@/components/InternalLink';
import { addressToUserView, slugToProjectView } from '@/lib/routeCreators';
import VerificationBadge from '@/components/badges/VerificationBadge';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { PFP } from '../PFP';
import { Flex } from '../styled-components/Flex';

interface IProjectCard {
	project: IProject;
	isNew?: boolean;
}

const ProjectCard = (props: IProjectCard) => {
	const { isNew, project } = props;
	const {
		title,
		description,
		image,
		verified,
		adminUser,
		slug,
		totalDonations,
		organization,
	} = project;

	const { name, walletAddress } = adminUser || {};
	const orgLabel = organization?.label;
	const { formatMessage } = useIntl();
	const pfpToken = useGiverPFPToken(
		adminUser?.walletAddress,
		adminUser?.avatar,
	);

	return (
		<Wrapper isNew={isNew}>
			<ImagePlaceholder>
				<InternalLink href={slugToProjectView(slug)}>
					<ProjectCardImage image={image} />
				</InternalLink>
			</ImagePlaceholder>
			<ProjectCardOrgBadge
				organization={orgLabel}
				isHover={false}
				isAbsolute={true}
			/>
			{!isNew && (
				<BadgeContainer>
					{verified && <VerificationBadge />}
				</BadgeContainer>
			)}
			<CardBody isNew={isNew}>
				<InternalLink href={slugToProjectView(slug)}>
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
					</div>
				)}
				<Description>{htmlToText(description)}</Description>
				{!isNew && (
					<BodyCaption>
						{formatMessage({ id: 'label.raised' })}: $
						{totalDonations?.toLocaleString()}
					</BodyCaption>
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

const BodyCaption = styled(Caption)`
	margin-top: 14px;
	color: ${neutralColors.gray[700]};
`;

const Description = styled(P)`
	height: 76px;
	overflow: hidden;
	color: ${neutralColors.gray[900]};
	margin-bottom: 20px;
	margin-top: 8px;
`;

const CardBody = styled.div<{ isNew?: boolean }>`
	margin: ${props => (props.isNew ? '50px 24px 0' : '50px 0 0')};
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
