import { type FC } from 'react';
import { deviceSize } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ProjectTip, { IProjectTipProps } from './ProjectTips/ProjectTip';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Flex } from '@/components/styled-components/Flex';
import { ProjectScoreCard } from './score/ProjectScoreCard';

interface IProGuideProps extends IProjectTipProps {}

export const ProGuide: FC<IProGuideProps> = ({ activeSection }) => {
	const isLaptopL = useMediaQuery(`(min-width: ${deviceSize.laptopL}px)`);
	return isLaptopL ? (
		<Wrapper>
			<ProjectTip activeSection={activeSection} />
			<ProjectScoreCard />
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
