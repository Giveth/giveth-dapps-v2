import { type FC } from 'react';
import { Flex, deviceSize } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ProjectTip, { type IProjectTipProps } from './ProjectTips/ProjectTip';
import useMediaQuery from '@/hooks/useMediaQuery';
import { type IProjectScoreCardProps } from './score/ProjectScoreCard';
import { EScrollDir, useScrollDetection } from '@/hooks/useScrollDetection';

interface IProGuideProps extends IProjectTipProps, IProjectScoreCardProps {}

export const ProGuide: FC<IProGuideProps> = ({
	activeSection,
	formData,
	getFieldState,
	setQuality,
}) => {
	const isLaptopL = useMediaQuery(`(min-width: ${deviceSize.laptopL}px)`);
	const scrollDir = useScrollDetection();
	return isLaptopL ? (
		<Wrapper $show={scrollDir !== EScrollDir.Down}>
			<ProjectTip activeSection={activeSection} />
			{/* <ProjectScoreCard
				formData={formData}
				getFieldState={getFieldState}
				setQuality={setQuality}
			/> */}
		</Wrapper>
	) : null;
};

const Wrapper = styled(Flex)<{ $show: boolean }>`
	flex-direction: column;
	position: sticky;
	top: ${props => (props.$show ? '100px' : '10px')};
	margin-top: 80px;
	gap: 24px;
	max-height: calc(100vh - ${props => (props.$show ? '100px' : '10px')});
	overflow-y: auto;
`;
