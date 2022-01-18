import { Footer } from '../Footer';
import { TabGIVstreamTop, TabGIVstreamBottom } from '../homeTabs/GIVstream';

import Tabs from '../Tabs';

function GIVstreamView() {
	return (
		<>
			<TabGIVstreamTop />
			<Tabs />
			<TabGIVstreamBottom />
			<Footer />
		</>
	);
}

export default GIVstreamView;
