import HeaderSection from './HeaderSection';
import { SettingsContainer } from './common/common.sc';
import ProjectSection from './ProjectSection';
import GIVeconomySection from './GIVeconomySection';
import SupportedProjects from '@/components/views/notification/notificationSettings/SupportedProjects';

const SettingsIndex = () => {
	return (
		<SettingsContainer>
			<HeaderSection />
			<ProjectSection />
			<SupportedProjects />
			<GIVeconomySection />
		</SettingsContainer>
	);
};

export default SettingsIndex;
