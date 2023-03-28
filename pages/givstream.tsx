import { useEffect } from 'react';

import GIVstreamView from '@/components/views/GIVstream.view';
import { givstreamMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
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
