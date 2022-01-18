import { Footer } from '../Footer';
import Header from '../Header';
import { TabGIVfarmTop, TabGIVfarmBottom } from '../homeTabs/GIVfarm';

import Tabs from '../Tabs';

function GIVfarmView() {
	return (
		<>
			<Header />
			<TabGIVfarmTop />
			<Tabs />
			<TabGIVfarmBottom />
			<Footer />
		</>
	);
}

export default GIVfarmView;
