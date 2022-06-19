import { useEffect } from 'react';

import HomeView from '@/components/views/Home.view';
import { giveconomyMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { setDarkTheme, setLightTheme } from '@/features/general/general.sclie';
import { useAppDispatch } from '@/features/hooks';

export default function GIVeconomyRoute() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);

	return (
		<>
			<GeneralMetatags info={giveconomyMetatags} />
			<HomeView />
		</>
	);
}
