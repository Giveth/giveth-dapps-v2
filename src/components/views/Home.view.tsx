import { Footer } from '../Footer';
import Header from '../Header';
import { TabOverviewTop, TabOverviewBottom } from '../homeTabs/Overview';

import Tabs from '../Tabs';

function HomeView() {
	return (
		<>
			<Header />
			<TabOverviewTop />
			<Tabs />
			<TabOverviewBottom />
			<Footer />
		</>
	);
}

export default HomeView;
