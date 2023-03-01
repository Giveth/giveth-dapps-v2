import { useEffect } from 'react';

import { giveconomyMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import GIVeconomyView from '@/components/views/GIVeconomy.view';

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
			<GIVeconomyView />
		</>
	);
}
