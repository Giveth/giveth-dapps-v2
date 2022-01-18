import { Footer } from '../Footer';
import { TabGIVbacksTop, TabGIVbacksBottom } from '../homeTabs/GIVbacks';

import Tabs from '../Tabs';

function GIVbackView() {
	return (
		<>
			<TabGIVbacksTop />
			<Tabs />
			<TabGIVbacksBottom />
			<Footer />
		</>
	);
}

export default GIVbackView;
