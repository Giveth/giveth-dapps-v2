import { FC } from 'react';
import BeforeStart from '@/components/views/verification/BeforeStart';
import PersonalInfo from '@/components/views/verification/PersonalInfo';
import SocialProfile from '@/components/views/verification/SocialProfile';
import ProjectRegistry from './ProjectRegistry';
import ProjectContactIndex from './projectContact/ProjectContactIndex';
import ManageFundsIndex from '@/components/views/verification/manageFunds/ManageFundsIndex';
import TermsAndConditions from './TermsAndConditions';
import Milestones from './Milestones';
import Done from '@/components/views/verification/Done';
import { useVerificationData } from '@/context/verification.context';

const ContentSelector: FC = () => {
	const { step } = useVerificationData();

	switch (step) {
		case 0:
			return <BeforeStart />;
		case 1:
			return <PersonalInfo />;
		case 2:
			return <SocialProfile />;
		case 3:
			return <ProjectRegistry />;
		case 4:
			return <ProjectContactIndex />;
		case 5:
			return <Milestones />;
		case 6:
			return <ManageFundsIndex />;
		case 7:
			return <TermsAndConditions />;
		case 8:
			return <Done />;
		default:
			return null;
	}
};

export default ContentSelector;
