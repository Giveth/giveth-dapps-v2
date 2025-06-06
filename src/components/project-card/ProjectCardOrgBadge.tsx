import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import {
	neutralColors,
	Overline,
	Flex,
	FlexCenter,
} from '@giveth/ui-design-system';

import { ORGANIZATION } from '@/lib/constants/organizations';
import { mediaQueries } from '@/lib/constants/constants';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import links from '@/lib/constants/links';

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
		case ORGANIZATION.endaoment:
			img = '/images/endaoment.svg';
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

	const content =
		organization === ORGANIZATION.endaoment ? (
			<IconWithTooltip
				icon={
					<Flex gap='4px' $alignItems='center'>
						<OrganizationText>
							{formatMessage({ id: 'label.project_by' })}:
						</OrganizationText>
						<ImageContainer>
							<Image
								src={displayImg}
								alt={organization as string}
								width={100}
								height={30}
							/>
						</ImageContainer>
					</Flex>
				}
				direction={'bottom'}
			>
				<TooltipContent>
					This project is delivered by{' '}
					<a
						href={links.ENDAOMENT}
						target={'_blank'}
						rel='noopener noreferrer'
					>
						Endaoment
					</a>
					, who handles the conversion and delivery of funds to this
					project.
				</TooltipContent>
			</IconWithTooltip>
		) : (
			<>
				<OrganizationText>
					{formatMessage({ id: 'label.project_by' })}:  
				</OrganizationText>
				<ImageContainer>
					<Image
						src={displayImg}
						alt={organization as string}
						fill={true}
						objectFit='contain'
					/>
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
				<HomeViewContainer $isHover={isHover}>
					{content}
				</HomeViewContainer>
			)}
		</>
	);
};

const ImageContainer = styled.div`
	position: relative;
	width: 100px;
	height: 100%;
`;

const HomeViewContainer = styled(FlexCenter)<{ $isHover: boolean }>`
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
		bottom: ${props => (props.$isHover ? '167px' : '89px')};
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
