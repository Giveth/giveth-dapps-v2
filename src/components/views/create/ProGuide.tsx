import { type FC } from 'react';
import { deviceSize } from '@giveth/ui-design-system';
import ProjectTip, { IProjectTipProps } from './ProjectTips/ProjectTip';
import useMediaQuery from '@/hooks/useMediaQuery';

interface IProGuideProps extends IProjectTipProps {}

export const ProGuide: FC<IProGuideProps> = ({ activeSection }) => {
	const isLaptopL = useMediaQuery(`(min-width: ${deviceSize.laptopL}px)`);
	return isLaptopL ? (
		<div>
			<ProjectTip activeSection={activeSection} />
		</div>
	) : null;
};
