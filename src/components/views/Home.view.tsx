import dynamic from 'next/dynamic';
import { TabOverviewBottom } from '../homeTabs/Overview';

import Tabs from '../Tabs';

const TabOverviewVideo = dynamic(() => import('../homeTabs/TabOverviewVideo'), {
	ssr: false,
});

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
