import { Footer } from '../Footer/Footer';
import { TabGIVbacksTop, TabGIVbacksBottom } from '../homeTabs/GIVbacks';

import Tabs from '../Tabs';

function GIVbackView() {
	return (
		<>
			<Tabs />
			<TabGIVbacksTop />
			<TabGIVbacksBottom />
		</>
	);
}

export default GIVbackView;
