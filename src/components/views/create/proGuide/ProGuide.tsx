import { type FC } from 'react';
import { Flex, deviceSize } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ProjectTip, { type IProjectTipProps } from './ProjectTips/ProjectTip';
import useMediaQuery from '@/hooks/useMediaQuery';
import {
	type IProjectScoreCardProps,
	ProjectScoreCard,
} from './score/ProjectScoreCard';

interface IProGuideProps extends IProjectTipProps, IProjectScoreCardProps {}

export const ProGuide: FC<IProGuideProps> = ({
	activeSection,
	formData,
	getFieldState,
	setQuality,
}) => {
	const isLaptopL = useMediaQuery(`(min-width: ${deviceSize.laptopL}px)`);
	return isLaptopL ? (
		<Wrapper>
			<ProjectTip activeSection={activeSection} />
			<ProjectScoreCard
				formData={formData}
				getFieldState={getFieldState}
				setQuality={setQuality}
			/>
		</Wrapper>
	) : null;
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	position: sticky;
	top: 100px;
	margin-top: 80px;
	gap: 24px;
`;
