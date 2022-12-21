import dynamic from 'next/dynamic';
import { TabOverview } from '../homeTabs/Overview';

import Tabs from '../Tabs';

const TabOverviewVideo = dynamic(() => import('../homeTabs/TabOverviewVideo'), {
	ssr: false,
});

function HomeView() {
	return (
		<>
			<Tabs />
			<TabOverviewVideo />
			<TabOverview />
		</>
	);
}

export default HomeView;
