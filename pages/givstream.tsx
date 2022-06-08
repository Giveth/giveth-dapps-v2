import { useEffect } from 'react';

import GIVstreamView from '@/components/views/Stream.view';
import { useGeneral, ETheme } from '@/context/general.context';
import { givstreamMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

export default function GIVstreamRoute() {
	const { setTheme } = useGeneral();

	useEffect(() => {
		setTheme(ETheme.Dark);
		return () => {
			setTheme(ETheme.Light);
		};
	}, [setTheme]);
	return (
		<>
			<GeneralMetatags info={givstreamMetatags} />
			<GIVstreamView />
		</>
	);
}
