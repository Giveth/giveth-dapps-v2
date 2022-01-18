import { Footer } from '../Footer';
import { TabOverviewTop, TabOverviewBottom } from '../homeTabs/Overview';

import Tabs from '../Tabs';

function HomeView() {
	return (
		<>
			<TabOverviewTop />
			<Tabs />
			<TabOverviewBottom />
			<Footer />
		</>
	);
}

export default HomeView;
