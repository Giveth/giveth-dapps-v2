import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { neutralColors, Overline } from '@giveth/ui-design-system';

import { ORGANIZATION } from '@/lib/constants/organizations';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

interface IProjectCardOrgBadge {
	isHover: boolean;
	organization?: string;
	isAbsolute?: boolean;
	isProjectView?: boolean;
}

const setOrgImage = (org?: string) => {
	let img = '';
	switch (org) {
		case ORGANIZATION.givingBlock:
			img = '/images/thegivingblock.svg';
			break;
		case ORGANIZATION.change:
			img = '/images/change.png';
			break;
	}
	return img;
};

const ProjectCardOrgBadge = ({
	isHover,
	organization,
	isAbsolute,
	isProjectView,
}: IProjectCardOrgBadge) => {
	const { formatMessage } = useIntl();
	const displayImg = setOrgImage(organization);
	const hideBadge =
		organization === ORGANIZATION.giveth ||
		organization === ORGANIZATION.trace ||
		!displayImg;

	if (hideBadge) return null;

	const content = (
		<>
			<OrganizationText>
				{formatMessage({ id: 'label.project_by' })}:  
			</OrganizationText>
			<ImageContainer>
				<img src={displayImg} alt={organization} />
			</ImageContainer>
		</>
	);
	return (
		<>
			{isAbsolute ? (
				<AbsolutContainer>{content}</AbsolutContainer>
			) : isProjectView ? (
				<ProjectViewContainer>{content}</ProjectViewContainer>
			) : (
				<HomeViewContainer isHover={isHover}>
					{content}
				</HomeViewContainer>
			)}
		</>
	);
};

const ImageContainer = styled.div`
	max-width: 100px;
	img {
		width: 100%;
		height: auto;
	}
`;

const HomeViewContainer = styled(FlexCenter)<{ isHover: boolean }>`
	z-index: 2;
	height: 36px;
	background-color: ${neutralColors.gray[200]};
	gap: 8px;
	padding: 0 24px;
	position: absolute;
	bottom: 112px;
	transition: bottom 0.3s ease;
	border-top-right-radius: 12px;
	${mediaQueries.laptopS} {
		bottom: ${props => (props.isHover ? '167px' : '89px')};
	}
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

const ProjectViewContainer = styled(FlexCenter)`
	gap: 8px;
	margin-bottom: 12px;
`;

const OrganizationText = styled(Overline)`
	color: ${neutralColors.gray[600]};
	font-size: 10px;
`;

export default ProjectCardOrgBadge;
