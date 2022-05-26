import { FC } from 'react';
import BeforeStart from '@/components/views/verification/BeforeStart';
import PersonalInfo from '@/components/views/verification/PersonalInfo';
import SocialProfile from '@/components/views/verification/SocialProfile';

interface IContentSelector {
	step: number;
}

const ContentSelector: FC<IContentSelector> = ({ step }) => {
	switch (step) {
		case 0:
			return <BeforeStart />;
		case 1:
			return <PersonalInfo />;
		case 2:
			return <SocialProfile />;
		default:
			return null;
	}
};

export default ContentSelector;
