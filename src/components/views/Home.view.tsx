import { TabOverviewTop, TabOverviewBottom } from '../homeTabs/Overview';

import Tabs from '../Tabs';

function HomeView() {
	return (
		<>
			<Tabs />
			<TabOverviewTop />
			<TabOverviewBottom />
		</>
	);
}

export default HomeView;
