import { Footer } from '../Footer';
import Header from '../Header';
import { TabGardenTop, TabGardenBottom } from '../homeTabs/GIVgarden';

import Tabs from '../Tabs';

function GIVgardenView() {
	return (
		<>
			<Header />
			<TabGardenTop />
			<Tabs />
			<TabGardenBottom />
			<Footer />
		</>
	);
}

export default GIVgardenView;
