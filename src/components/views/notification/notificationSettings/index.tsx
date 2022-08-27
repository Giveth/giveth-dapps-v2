import { useEffect } from 'react';
import HeaderSection from './HeaderSection';
import GeneralSection from './GeneralSection';
import { SettingsContainer } from './common/common.sc';
import ProjectSection from './ProjectSection';
import GIVeconomySection from './GIVeconomySection';
import { setShowFooter } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

const SettingsIndex = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
	}, []);

	return (
		<SettingsContainer>
			<HeaderSection />
			<GeneralSection />
			<ProjectSection />
			<GIVeconomySection />
		</SettingsContainer>
	);
};

export default SettingsIndex;
