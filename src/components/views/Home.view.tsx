import { TabOverviewBottom } from '../homeTabs/Overview';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

import Tabs from '../Tabs';

const TabOverviewVideo = dynamic<ReactNode>(
	() => import('../homeTabs/Overview').then(mod => mod.TabOverviewVideo),
	{
		ssr: false,
	},
);

function HomeView() {
	return (
		<>
			<Tabs />
			<TabOverviewVideo />
			<TabOverviewBottom />
		</>
	);
}

export default HomeView;
