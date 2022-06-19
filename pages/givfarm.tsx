import { useEffect } from 'react';

import GIVfarmView from '@/components/views/Farm.view';
import { givfarmMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { setDarkTheme, setLightTheme } from '@/features/general/general.sclie';
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
