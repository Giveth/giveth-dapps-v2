import { type FC } from 'react';
import ProjectTip, { IProjectTipProps } from './ProjectTips/ProjectTip';

interface IProGuideProps extends IProjectTipProps {}

export const ProGuide: FC<IProGuideProps> = ({ activeSection }) => {
	return (
		<div>
			<ProjectTip activeSection={activeSection} />
		</div>
	);
};
