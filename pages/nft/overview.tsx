import React, { useEffect } from 'react';
import OverviewIndex from '@/components/views/nft/overview';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

const Overview = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);

	return <OverviewIndex />;
};

export default Overview;
