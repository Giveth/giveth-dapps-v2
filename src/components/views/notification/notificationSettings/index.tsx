import { useEffect } from 'react';
import { GrayBar } from '../notification.sc';
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
			<GrayBar />
			<GeneralSection />
			<GrayBar />
			<ProjectSection />
			<GrayBar />
			<GIVeconomySection />
		</SettingsContainer>
	);
};

export default SettingsIndex;
