import { FC } from 'react';
import BeforeStart from '@/components/views/verification/BeforeStart';
import PersonalInfo from '@/components/views/verification/PersonalInfo';
import SocialProfile from '@/components/views/verification/SocialProfile';
import ProjectRegistry from './ProjectRegistry';

interface IContentSelector {
	step: number;
}

const ContentSelector: FC<IContentSelector> = ({ step }) => {
	switch ((step = 3)) {
		case 0:
			return <BeforeStart />;
		case 1:
			return <PersonalInfo />;
		case 2:
			return <SocialProfile />;
		case 3:
			return <ProjectRegistry />;
		default:
			return null;
	}
};

export default ContentSelector;
