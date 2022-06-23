import { useEffect } from 'react';

import GIVbackView from '@/components/views/Back.view';
import { givbacksMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { useAppDispatch } from '@/features/hooks';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';

export default function GIVbacksRoute() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);
	return (
		<>
			<GeneralMetatags info={givbacksMetatags} />
			<GIVbackView />
		</>
	);
}
