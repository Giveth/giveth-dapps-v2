import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { neutralColors, Overline } from '@giveth/ui-design-system';

interface IProjectCardOrgBadge {
	image: string;
	isHover: boolean;
	show: boolean;
}

const ProjectCardOrgBadge = ({
	image,
	isHover,
	show,
}: IProjectCardOrgBadge) => {
	return (
		<>
			{show && (
				<GivingBadgeContainer isHover={isHover}>
					<GivingBlocksText>PROJECT BY:</GivingBlocksText>
					<Image
						src={image}
						alt='The Giving Block icon.'
						height={36}
						width={78}
					/>
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
	bottom: ${props => (props.isHover ? '88px' : '24px')};
	transition: bottom 0.3s ease;
	border-radius: 0px 12px 0px 0px;
`;

const GivingBlocksText = styled(Overline)`
	color: ${neutralColors.gray[600]};
	font-size: 10px;
`;

export default ProjectCardOrgBadge;
