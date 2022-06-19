import { useEffect } from 'react';

import GIVstreamView from '@/components/views/Stream.view';
import { givstreamMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { setDarkTheme, setLightTheme } from '@/features/general/general.sclie';
import { useAppDispatch } from '@/features/hooks';

export default function GIVstreamRoute() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);
	return (
		<>
			<GeneralMetatags info={givstreamMetatags} />
			<GIVstreamView />
		</>
	);
}
