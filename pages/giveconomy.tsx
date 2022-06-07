import { useEffect } from 'react';

import HomeView from '@/components/views/Home.view';
import { ETheme, useGeneral } from '@/context/general.context';
import { giveconomyMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

export default function GIVeconomyRoute() {
	const { setTheme } = useGeneral();

	useEffect(() => {
		setTheme(ETheme.Dark);
		return () => {
			setTheme(ETheme.Light);
		};
	}, [setTheme]);

	return (
		<>
			<GeneralMetatags info={giveconomyMetatags} />
			<HomeView />
		</>
	);
}
