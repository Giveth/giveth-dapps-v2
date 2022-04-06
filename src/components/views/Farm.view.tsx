import { TabGIVfarmTop, TabGIVfarmBottom } from '../homeTabs/GIVfarm';

import Tabs from '../Tabs';
import { FarmProvider } from '@/context/farm.context';

function GIVfarmView() {
	return (
		<>
			<Tabs />
			<FarmProvider>
				<TabGIVfarmTop />
				<TabGIVfarmBottom />
			</FarmProvider>
		</>
	);
}

export default GIVfarmView;
