import { TabGIVfarmTop, TabGIVfarmBottom } from '../homeTabs/GIVfarm';

import { FarmProvider } from '@/context/farm.context';

function GIVfarmView() {
	return (
		<>
			<FarmProvider>
				<TabGIVfarmTop />
				<TabGIVfarmBottom />
			</FarmProvider>
		</>
	);
}

export default GIVfarmView;
