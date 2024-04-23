import { type FC } from 'react';
import { Flex, deviceSize } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ProjectTip, { type IProjectTipProps } from './ProjectTips/ProjectTip';
import useMediaQuery from '@/hooks/useMediaQuery';

interface IProGuideProps extends IProjectTipProps {}

export const ProGuide: FC<IProGuideProps> = ({ activeSection }) => {
	const isLaptopL = useMediaQuery(`(min-width: ${deviceSize.laptopL}px)`);
	return isLaptopL ? (
		<Wrapper>
			<ProjectTip activeSection={activeSection} />
		</Wrapper>
	) : null;
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	position: sticky;
	top: 100px;
	margin-top: 80px;
	gap: 24px;
	max-height: calc(100vh - 100px);
	overflow-y: auto;
`;
