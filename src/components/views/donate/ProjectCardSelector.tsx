import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/project-card/ProjectCardAlt';
import SocialBox from '@/components/SocialBox';
import { Shadow } from '@/components/styled-components/Shadow';
import { mediaQueries } from '@/lib/constants/constants';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useDonateData } from '@/context/donate.context';
import { EContentType } from '@/lib/constants/shareContent';

const ProjectCardSelector: FC = () => {
	const [wrapperHeight, setWrapperHeight] = useState<number>(0);

	const { project } = useDonateData();
	const { isMobile } = useDetectDevice();
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => {
			setWrapperHeight(wrapperRef?.current?.clientHeight || 0);
		};
		if (isMobile) {
			handleResize();
			window.addEventListener('resize', handleResize);
		}
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [project, isMobile]);

	if (isMobile) {
		return (
			<MobileCardWrapper
				height={wrapperHeight}
				ref={wrapperRef}
				dragConstraints={{ top: 50 - wrapperHeight, bottom: 0 }}
				drag='y'
				dragElastic={0}
			>
				<BlueBar />
				<MobileCardContainer>
					<ProjectCard project={project} />
					<MobileGrayBar />
					<SocialBox
						contentType={EContentType.thisProject}
						project={project}
						isDonateFooter
					/>
				</MobileCardContainer>
			</MobileCardWrapper>
		);
	} else {
		return (
			<Left>
				<ProjectCard project={project} />
			</Left>
		);
	}
};

const BlueBar = styled.div`
	width: 80px;
	height: 3px;
	background-color: ${brandColors.giv[500]};
	margin: 24px auto;
	position: relative;
`;

const MobileGrayBar = styled.div`
	border-bottom: 3px solid ${neutralColors.gray[200]};
	margin-top: 16px;
`;

const Left = styled.div`
	z-index: 1;
	background: ${neutralColors.gray[200]};
	box-shadow: ${Shadow.Neutral[400]};
	padding: 29px;
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
	${mediaQueries.mobileL} {
		> div:first-child {
			padding: 0 1%;
		}
	}
`;

const MobileCardWrapper = styled(motion.div)<{ height: number }>`
	flex-direction: column;
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	left: 0;
	bottom: ${({ height }) => `calc(50px - ${height}px)`};
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

export default ProjectCardSelector;
