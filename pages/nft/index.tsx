import { useEffect } from 'react';
import { setDarkTheme, setLightTheme } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import OverviewIndex from '@/components/views/nft/overview';
import { GeneralMetatags } from '@/components/Metatag';
import { nftMetatags } from '@/content/metatags';

const NFTRoute = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setDarkTheme());
		return () => {
			dispatch(setLightTheme());
		};
	}, [dispatch]);

	return (
		<>
			<GeneralMetatags info={nftMetatags} />
			<OverviewIndex />
		</>
	);
};

export default NFTRoute;
