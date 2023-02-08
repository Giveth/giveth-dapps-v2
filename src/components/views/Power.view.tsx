import { TabPowerTop, TabPowerBottom } from '../homeTabs/GIVpower';
import Tabs from '../Tabs';
import GIVpowerVideo from '@/components/homeTabs/GIVpowerVideo';

export default function GIVpowerView() {
	return (
		<>
			<Tabs />
			<TabPowerTop />
			<GIVpowerVideo />
			<TabPowerBottom />
		</>
	);
}
