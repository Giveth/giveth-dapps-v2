import { Footer } from '../Footer';
import { TabGIVfarmTop, TabGIVfarmBottom } from '../homeTabs/GIVfarm';

import Tabs from '../Tabs';

function GIVfarmView() {
	return (
		<>
			<TabGIVfarmTop />
			<Tabs />
			<TabGIVfarmBottom />
			<Footer />
		</>
	);
}

export default GIVfarmView;
