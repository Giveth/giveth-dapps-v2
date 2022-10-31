import HeaderSection from './HeaderSection';
import { SettingsContainer } from './common/common.sc';
import ProjectSection from './ProjectSection';
import GIVeconomySection from './GIVeconomySection';

const SettingsIndex = () => {
	return (
		<SettingsContainer>
			<HeaderSection />
			<ProjectSection />
			<GIVeconomySection />
		</SettingsContainer>
	);
};

export default SettingsIndex;
