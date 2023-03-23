import { useEffect } from 'react';
import GIVpowerView from '@/components/views/GIVpower.view';
import { GeneralMetatags } from '@/components/Metatag';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import { givpowerMetatags } from '@/content/metatags';

export default function GIVpowerRoute() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);
	return (
		<>
			<GeneralMetatags info={givpowerMetatags} />
			<GIVpowerView />
		</>
	);
}
