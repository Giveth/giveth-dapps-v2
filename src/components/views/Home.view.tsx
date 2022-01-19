import { TabOverviewTop, TabOverviewBottom } from '../homeTabs/Overview';

import Tabs from '../Tabs';

function HomeView() {
	return (
		<>
			<TabOverviewTop />
			<Tabs />
			<TabOverviewBottom />
		</>
	);
}

export default HomeView;
