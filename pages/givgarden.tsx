import { useEffect } from 'react';

import GIVgardenView from '@/components/views/Garden.view';
import { givgardenMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { setDarkTheme, setLightTheme } from '@/features/general/general.sclie';
import { useAppDispatch } from '@/features/hooks';

export default function GIVgardenRoute() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);
	return (
		<>
			<GeneralMetatags info={givgardenMetatags} />
			<GIVgardenView />
		</>
	);
}
