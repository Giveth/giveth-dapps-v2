import { useEffect } from 'react';

import GIVgardenView from '@/components/views/Garden.view';
import { useGeneral, ETheme } from '@/context/general.context';
import { givgardenMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

export default function GIVgardenRoute() {
	const { setTheme } = useGeneral();

	useEffect(() => {
		setTheme(ETheme.Dark);
		return () => {
			setTheme(ETheme.Light);
		};
	}, [setTheme]);
	return (
		<>
			<GeneralMetatags info={givgardenMetatags} />
			<GIVgardenView />
		</>
	);
}
