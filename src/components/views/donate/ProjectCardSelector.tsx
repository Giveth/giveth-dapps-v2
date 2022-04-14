import React, { useState } from 'react';
import styled from 'styled-components';
import { brandColors, neutralColors } from '@giveth/ui-design-system';

import useDeviceDetect from '@/hooks/useDeviceDetect';
import { IProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCardAlt';
import SocialBox from '@/components/views/donate/SocialBox';
import { Shadow } from '@/components/styled-components/Shadow';
import { mediaQueries } from '@/lib/constants/constants';

const ProjectCardSelector = (props: { project: IProject }) => {
	const { project } = props;

	const { isMobile } = useDeviceDetect();

	const [hideMobileCard, setHideMobileCard] = useState<boolean>(true);

	if (isMobile) {
		return (
			<CardMobileWrapper
				onClick={() => setHideMobileCard(!hideMobileCard)}
			>
				<SlideBtn />
				{!hideMobileCard && (
					<MobileCardContainer>
						<ProjectCard project={project} />
						<SocialBox project={project} />
					</MobileCardContainer>
				)}
			</CardMobileWrapper>
		);
	} else {
		return (
			<Left>
				<ProjectCard project={project} />
			</Left>
		);
	}
};

const Left = styled.div`
	z-index: 1;
	justify-content: center;
	align-items: center;
	background: ${neutralColors.gray[200]};
	box-shadow: ${Shadow.Neutral[400]};
	padding: 29px;
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
	${mediaQueries.mobileL} {
		align-items: flex-start;
		> div:first-child {
			padding: 0 1%;
		}
	}
`;

const CardMobileWrapper = styled.div`
	flex-direction: column;
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	left: 0;
	bottom: 0;
	margin: 0;
	-webkit-backface-visibility: hidden;
	padding: 0 16px;
	background-color: white;
	z-index: 10;
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.7);
	border-radius: 40px 40px 0 0;
`;

const MobileCardContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const SlideBtn = styled.div`
	width: 78px;
	height: 0;
	margin: 16px 0;
	border: 1.5px solid ${brandColors.giv[500]};
	border-radius: 15%;
`;

export default ProjectCardSelector;
