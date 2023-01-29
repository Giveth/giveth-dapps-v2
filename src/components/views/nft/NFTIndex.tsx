import React, { useEffect } from 'react';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import OverviewIndex from './overview';

export const NFTIndex = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);
	return (
		<div>
			<OverviewIndex />
		</div>
	);
};
