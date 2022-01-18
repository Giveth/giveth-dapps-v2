import { Footer } from '../Footer';
import { TabGardenTop, TabGardenBottom } from '../homeTabs/GIVgarden';

import Tabs from '../Tabs';

function GIVgardenView() {
	return (
		<>
			<TabGardenTop />
			<Tabs />
			<TabGardenBottom />
			<Footer />
		</>
	);
}

export default GIVgardenView;
