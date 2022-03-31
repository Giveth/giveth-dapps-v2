import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { neutralColors, Overline } from '@giveth/ui-design-system';

interface IProjectCardOrgBadge {
	image?: string;
	isHover: boolean;
	show: boolean;
	organization?: string;
	isAbsolute?: boolean;
	isProjectView?: boolean;
}

const setOrgImage = (org?: string) => {
	let img = '';
	switch (org) {
		case 'givingBlock':
			img = '/images/thegivingblock.svg';
			break;
		case 'change':
			img = '/images/change.png';
			break;
	}
	return img;
};

const ProjectCardOrgBadge = ({
	image,
	isHover,
	show,
	organization,
	isAbsolute,
	isProjectView,
}: IProjectCardOrgBadge) => {
	const displayImg = image || setOrgImage(organization);
	if (!displayImg || !show) return null;
	console.log({ organization });
	const content = (
		<>
			<GivingBlocksText>PROJECT BY:</GivingBlocksText>
			<Image
				src={displayImg}
				alt={organization || 'The Giving Block icon.'}
				height={20}
				width={78}
			/>
		</>
	);
	return (
		<>
			{isAbsolute ? (
				<AbsolutContainer>{content}</AbsolutContainer>
			) : isProjectView ? (
				<ProjectViewContainer>{content}</ProjectViewContainer>
			) : (
				<GivingBadgeContainer isHover={isHover}>
					{content}
				</GivingBadgeContainer>
			)}
		</>
	);
};

const GivingBadgeContainer = styled.div<{ isHover: boolean }>`
	height: 36px;
	width: 200px;
	background-color: ${neutralColors.gray[200]};
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 0 24px;
	position: absolute;
	bottom: ${props => (props.isHover ? '100px' : '24px')};
	transition: bottom 0.3s ease;
	border-radius: 0px 12px 0px 0px;
`;

const AbsolutContainer = styled(Flex)`
	position: absolute;
	align-items: center;
	border-radius: 0 12px 0 0;
	color: ${neutralColors.gray[600]};
	background: ${neutralColors.gray[200]};
	margin-top: -30px;
	padding: 8px 24px;
	img {
		padding-left: 10px;
	}
`;

const ProjectViewContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-bottom: 12px;
`;

const GivingBlocksText = styled(Overline)`
	color: ${neutralColors.gray[600]};
	font-size: 10px;
`;

export default ProjectCardOrgBadge;
