import { TabGIVfarmTop, TabGIVfarmBottom } from '../GIVeconomyPages/GIVfarm';

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
