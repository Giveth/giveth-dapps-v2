import React, { useState } from 'react';

import ProjectCardBadges from './ProjectCardBadges';
import ProjectCardImage from './ProjectCardImage';
import { IProject } from '../../apollo/types/types';
import { htmlToText, noImgColor, noImgIcon } from '../../lib/helpers';
import {
	Caption,
	P,
	neutralColors,
	brandColors,
	H6,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

const cardWidth = '440px';
const cardRadius = '12px';
const imgHeight = '200px';

interface IProjectCard {
	project: IProject;
	noHearts?: boolean;
}

const ProjectCard = (props: IProjectCard) => {
	const [rndColor, setRndColor] = useState(noImgColor);
	const {
		title,
		description,
		image,
		verified,
		totalReactions,
		adminUser,
		slug,
		id,
	} = props.project;
	const { noHearts } = props;

	const name = adminUser?.name;

	return (
		<Wrapper>
			<Wrapper2>
				<ImagePlaceholder>
					<ProjectCardImage
						image={image}
						cardWidth={cardWidth}
						cardRadius={cardRadius}
					/>
				</ImagePlaceholder>
				{!noHearts && (
					<ProjectCardBadges
						cardWidth={cardWidth}
						likes={totalReactions}
						verified={verified}
						projectHref={slug}
						projectDescription={description}
						projectId={id}
					/>
				)}
				<CardBody>
					<Title>{title}</Title>
					{name && <Author>{name}</Author>}
					<Description>{htmlToText(description)}</Description>
					<Captions>
						<BodyCaption>Raised: $</BodyCaption>
						<BodyCaption>Last updated: x days ago</BodyCaption>
					</Captions>
				</CardBody>
			</Wrapper2>
		</Wrapper>
	);
};

const NoImg = styled.div`
	background: ${(props: { rndColor: string }) => props.rndColor};
	width: 100%;
	height: 100%;
	background-image: url(${noImgIcon});
`;

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
	margin: 30px 24px 0 24px;
	text-align: left;
`;

const Author = styled(P)`
	color: ${brandColors.pinky[500]};
	margin-bottom: 10px;
`;

const Title = styled(H6)`
	color: ${brandColors.deep[500]};
	height: 26px;
	overflow: hidden;
`;

const Img = styled.img`
	border-radius: ${cardRadius} ${cardRadius} 0 0;
	width: ${cardWidth};
	height: auto;
`;

const ImagePlaceholder = styled.div`
	height: ${imgHeight};
	width: 100%;
	position: relative;
	overflow: hidden;
	border-radius: 16px;
`;

const Wrapper2 = styled.div`
	position: relative;
	height: 430px;
	width: ${cardWidth};
	border-radius: ${cardRadius};
	margin-top: 0;
	z-index: 0;
	transition: all 0.3s ease;
`;

const Wrapper = styled.div`
	position: relative;
	height: 430px;
	width: ${cardWidth};
	border-radius: ${cardRadius};
`;

export default ProjectCard;
