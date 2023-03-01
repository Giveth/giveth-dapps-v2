import { useEffect } from 'react';

import GIVfarmView from '@/components/views/givfarm/GIVfarm.view';
import { givfarmMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

export default function GIVfarmRoute() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);
	return (
		<>
			<GeneralMetatags info={givfarmMetatags} />
			<GIVfarmView />
		</>
	);
}
